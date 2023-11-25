const {
  log, items, rules, actions, time, triggers,
} = require('openhab');

// Log versions
var { helpers } = require('openhab_rules_tools');


var ruleUID = "pir_action";
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.pir_action
// log:set INFO org.openhab.automation.openhab-js.pir_action

var { TimerMgr } = require('openhab_rules_tools');
var timerMgr = cache.private.get('timerMgr', () => TimerMgr());


scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
  logger.info('>utils.OPENHAB_JS_VERSION: {}', utils.OPENHAB_JS_VERSION);
  logger.info('>helpers.OHRT_VERSION: {}', helpers.OHRT_VERSION);
  logger.debug('>sensorLights: {}', JSON.stringify(sensorLights));
};

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
/**
 * 
 */
class SensorLight {
  constructor(name, occupancyItemName, offTimerDurationItemName, offTimerDuration, ...lightItemNames) {
    this.name = name;
    this.occupancyItemName = occupancyItemName;
    this.offTimerDurationItemName = offTimerDurationItemName;
    this.offTimerDuration = offTimerDuration;
    this.lightItemNames = lightItemNames;
  }
  getOffTimerDuration() {
    // get timerDuration for this offTimerDurationItemName, return null if missing
    let timerDuration = items.getItem(this.offTimerDurationItemName, true).rawState;
    timerDuration = timerDuration ? timerDuration : 10;//default to 10s if offTimerDurationItemName not defined(null)
    let timerDurationMs = (timerDuration * 1000) + 1;
    logger.debug('occupancyItemName: {}, offTimerDuration()(secs): {}', this.occupancyItemName, timerDuration);

    // if (time.toZDT().isBetweenTimes('16:30', '19:30') || time.toZDT().isBetweenTimes('06:00', '07:30')) {
    //   timerDurationMs = timerDurationMs * 2;
    // }

    return timerDurationMs;
  }
}


const slPir05 = new SensorLight('kitchen-LHS-sensor', 'pir05_occupancy', 'pir05_offTimerDurationItem', 100, 'KT_light_2_Power', 'KT_light_3_Power');
const slPir01 = new SensorLight('kitchen-RHS-sensor', 'pir01_occupancy', 'pir01_offTimerDurationItem', 200, 'KT_light_1_Power');
const slPir03 = new SensorLight('Dining-room-sensor', 'pir03_occupancy', 'pir03_offTimerDurationItem', 5000, 'v_StartColourBulbsCycle');
const slPir04 = new SensorLight('Stairs-senor', 'pir04_occupancy', 'pir04_offTimerDurationItem', 5000, 'v_StartColourBulbsCycle', 'ZbWhiteBulb01Switch');
const slPir02 = new SensorLight('top-of-stairs', 'pir02_occupancy', 'pir02_offTimerDurationItem', 5000, 'ZbWhiteBulb01Switch');
const slPir06 = new SensorLight('CT-room-sensor', 'pir06_occupancy', 'pir06_offTimerDurationItem', 5000, 'v_StartColourBulbsCycle');

const sensorLights = [slPir01, slPir02, slPir03, slPir04, slPir05, slPir06];


rules.JSRule({
  name: 'PIR - OFF to ON',
  description: 'PIR occupancy ON - Turn ON light',
  triggers: [
    triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON'),
  ],
  execute: (event) => {

    itemName = event.itemName.toString();
    logger.debug(`Triggering item: ${itemName},state is: ${items.getItem(itemName).state}`);
    timerKey = itemName;

    //find sensorlight that has occupancy triggered
    const currentSensorLight = sensorLights.find((sensorLight) => sensorLight.occupancyItemName === itemName);
    logger.debug('PIR OFF > ON ..currentSensorLight is: {} - {}', currentSensorLight.name, currentSensorLight.occupancyItemName);

    timerMgr = cache.private.get('timerMgr');
    //if an old timer exists stop it
    if (timerMgr.hasTimer(timerKey)) {
      timerMgr.cancel(timerKey);
      logger.debug('timer with timerKey: {}, exists - cancelling it', timerKey);
    }
    cache.private.put('timerMgr', timerMgr);

    if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {

      //turn on the sensorlight light item(s)
      if (currentSensorLight !== undefined) {
        lightNames = currentSensorLight.lightItemNames;
        lightsControl(lightNames, 'ON');
      }

    } else {
      logger.debug(`BridgeLightSensorLevel ABOVE ConservatoryLightTriggerLevel, NOT turning light on : ${currentSensorLight}, for item: ${itemName}`);
    }
  },
});


rules.JSRule({
  name: 'PIR - ON to OFF',
  description: 'PIR sensor start OFF lights timer',
  triggers: [
    triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'ON', 'OFF'),
  ],
  execute: (event) => {
    itemName = event.itemName.toString();
    logger.debug(`Triggering item: ${itemName} ON -> OFF,state: ${items.getItem(itemName).state}`);

    timerKey = itemName;
    timerName = ruleUID + '_' + itemName;

    //find sensorlight that has occupancy triggered
    const currentSensorLight = sensorLights.find((sensorLight) => sensorLight.occupancyItemName === itemName);
    logger.debug('ON -> OFF..currentSensorLight is: {} - {}', currentSensorLight.name, currentSensorLight.occupancyItemName);

    //re/start the timer
    timerMgr = cache.private.get('timerMgr');

    //get off timer duration
    timerDuration = currentSensorLight.getOffTimerDuration();

    timerMgr.cancel(timerKey);
    logger.debug('cancel timer with timerKey:{}', timerKey);

    timerMgr.check(timerKey, timerDuration, occupancyOffTimerFunction(currentSensorLight), true, null, timerName);
    logger.debug('ON > OFF timerMgr.check - timerKey:{}, duration-s:{}, occupancyOffTimerFunction:{}, lightNames:{}, timerRuleName:{} ', timerKey, timerDuration / 1000, 'lightsOff', JSON.stringify(currentSensorLight.lightItemNames), timerName);

    cache.private.put('timerMgr', timerMgr);

  },
});

/**
 * 
 * @param {*} ASensorLight 
 * @returns 
 */
var occupancyOffTimerFunction = (ASensorLight) => {
  return () => {
    logger.debug('OFF Timer expired, location: {}, sensor: {} lights: {}', ASensorLight.name, JSON.stringify(ASensorLight.occupancyItemName), JSON.stringify(ASensorLight.lightItemNames));
    lightsControl(ASensorLight.lightItemNames, 'OFF');
  }
}

/**
 * 
 * @param {*} lightNames 
 * @param {*} state 
 */
function lightsControl(lightNames, state = 'OFF') {
  lightNames.forEach((lightName) => {
    logger.debug('send {} -> {}', state, lightName);
    items.getItem(lightName).sendCommand(state);
  });
}

