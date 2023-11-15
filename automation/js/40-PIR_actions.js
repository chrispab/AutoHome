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
class SensorLight {
  constructor(name, occupancyItemName, offTimerDurationItemName, offTimerDuration, ...lightItemNames) {
    this.name = name;
    this.occupancyItemName = occupancyItemName;
    this.offTimerDurationItemName = offTimerDurationItemName;
    this.offTimerDuration = offTimerDuration;
    this.lightItemNames = lightItemNames;
  }
  getOffTimerDuration() {
    // let timerDuration = (items.getItem(this.offTimerDurationItemName).rawState + 1) * 1000
    let timerDuration = items.getItem(this.offTimerDurationItemName, true).rawState;// get item for this offTimerDurationItemName, return null if missing
    timerDuration = timerDuration ? timerDuration : 10;//default to 10s if offTimerDurationItemName not defined(null)
    let timerDurationMs = (timerDuration * 1000) + 1;
    logger.debug('occupancyItemName: {}, offTimerDuration()(secs): {}', this.occupancyItemName, timerDuration);

    if (time.toZDT().isBetweenTimes('16:30', '19:30') || time.toZDT().isBetweenTimes('06:00', '07:30')) {
      timerDurationMs = timerDurationMs * 2;
    }
    return timerDurationMs;
  }
}


const slPir05 = new SensorLight('kitchen-LHS-sensor', 'pir05_occupancy', 'pir05_offTimerDurationItem', 100, 'KT_light_2_Power', 'KT_light_3_Power');
const slPir01 = new SensorLight('kitchen-RHS-sensor', 'pir01_occupancy', 'pir01_offTimerDurationItem', 200, 'KT_light_1_Power');

const slPir03 = new SensorLight('Stairs-senor', 'pir03_occupancy', 'pir03_offTimerDurationItem', 5000, 'gDiningRoomAutoLights', 'gLightCyclers');
const slPir04 = new SensorLight('Dining-room-sensor', 'pir04_occupancy', 'pir04_offTimerDurationItem', 5000, 'gDiningRoomAutoLights', 'gLightCyclers');

const slPir06 = new SensorLight('big-bulb-sensor', 'pir06_occupancy', 'pir06_offTimerDurationItem', 5000, 'bg_wifisocket_6_2_power');
const slPir02 = new SensorLight('small-spot-sensor', 'pir02_occupancy', 'pir02_offTimerDurationItem', 5000, 'bg_wifisocket_9_1_power');

const sensorLights = [slPir01, slPir05, slPir02, slPir03, slPir04, slPir06];


rules.JSRule({
  name: 'PIR - OFF to ON',
  description: 'PIR occupancy ON - Turn ON light',
  triggers: [
    triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON'),
    // triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON'),
  ],
  execute: (event) => {

    itemName = event.itemName.toString();
    logger.debug(`Triggering item: ${itemName},state is: ${items.getItem(itemName).state}`);
    timerKey = itemName;
    timerName = ruleUID + '_' + itemName;

    //find sensorlight that has occupancy triggered
    const currentSensorLight = sensorLights.find((sensorLight) => sensorLight.occupancyItemName === itemName);
    logger.debug(`ON to OFF..currentSensorLight is: ${JSON.stringify(currentSensorLight)}`);


    if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
      //turn on the sensorlight light item(s)
      if (currentSensorLight !== undefined) {
        lightNames = currentSensorLight.lightItemNames;
        lightsOn(lightNames);
      }

      //re/start the timer
      timerDuration = currentSensorLight.getOffTimerDuration();

      timerMgr = cache.private.get('timerMgr');
      timerMgr.cancel(timerKey);
      logger.debug('cancel timer with timerKey: {}', timerKey);

      var timerFunc = (currentSensorLight) => {
        return () => {
          logger.debug('on Timer expired, location: {}, sensor: {} lights: {}', currentSensorLight.name, JSON.stringify(currentSensorLight.occupancyItemName), JSON.stringify(currentSensorLight.lightItemNames));
          dummyOffTimer(currentSensorLight.lightItemNames);
        }
      }

      timerMgr.check(timerKey, timerDuration, timerFunc(currentSensorLight), true, null, timerName);
      logger.debug('OFF > ON timerMgr.check - timerKey:{}, duration-s:{}, timerFunc:{}, lightNames:{}, timerRuleName:{} ', timerKey, Math.round(timerDuration / 1000), 'dummyOffTimer', JSON.stringify(lightNames), timerName);

    } else {
      logger.debug(`BridgeLightSensorLevel ABOVE ConservatoryLightTriggerLevel, NOT setting timer : ${timerName}, for item: ${itemName}`);
    }
    cache.private.put('timerMgr', timerMgr);
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
    logger.debug(`ON to OFF..currentSensorLight is: ${JSON.stringify(currentSensorLight)}`);

    if (currentSensorLight !== undefined) {
      lightNames = currentSensorLight.lightItemNames;
      lightsOn(lightNames);
    }
    //re/start the timer
    timerMgr = cache.private.get('timerMgr');

    //get off timer duration
    timerDuration = currentSensorLight.getOffTimerDuration();

    timerMgr.cancel(timerKey);
    logger.debug('cancel timer with timerKey:{}', timerKey);
 
    var timerFunc = (currentSensorLight) => {
      return () => {
        logger.debug('off Timer expired, location: {}, sensor: {} lights: {}', currentSensorLight.name, JSON.stringify(currentSensorLight.occupancyItemName), JSON.stringify(currentSensorLight.lightItemNames));
        lightsOff(currentSensorLight.lightItemNames);
      }
    }
    timerMgr.check(timerKey, timerDuration, timerFunc(currentSensorLight), true, null, timerName);
    logger.debug('ON > OFF timerMgr.check - timerKey:{}, duration-s:{}, timerFunc:{}, lightNames:{}, timerRuleName:{} ', timerKey, timerDuration / 1000, 'lightsOff', JSON.stringify(lightNames), timerName);

    cache.private.put('timerMgr', timerMgr);

  },
});

function lightsOff(lightNames) {
  lightNames.forEach((lightName) => {
    logger.debug('=>lightsOff - sendCommand( OFF )->{}', lightName);
    items.getItem(lightName).sendCommand('OFF');
  });
}
function lightsOn(lightNames) {
  lightNames.forEach((lightName) => {
    logger.debug('==lightsOn - sendCommand( ON )->{}', lightName);
    items.getItem(lightName).sendCommand('ON');
  });
}

function dummyOffTimer(itemName) {
  logger.debug(`dummyOffTimer called by: ${itemName}`);
}