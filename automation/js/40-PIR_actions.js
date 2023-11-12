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
  logger.info('>>>>utils.OPENHAB_JS_VERSION: {}', utils.OPENHAB_JS_VERSION);
  logger.info('>>>>helpers.OHRT_VERSION: {}', helpers.OHRT_VERSION);
  logger.debug('>>>>sensorLights: {}', JSON.stringify(sensorLights));
};

let kitchenLHSensorOccupancy = 'pir05_occupancy';
let kitchenRHSensorOccupancy = 'pir01_occupancy';

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
class SensorLight {
  constructor(occupancyItemName, offTimerDuration, ...lightItemNames) {
    this.occupancyItemName = occupancyItemName;
    this.offTimerDuration = offTimerDuration;
    this.lightItemNames = lightItemNames;
  }
}
const { timeoutMs_KN_RHS, timeoutMs_KN_LHS } = getTimeouts();
const kitchenLHS = new SensorLight('pir05_occupancy', timeoutMs_KN_LHS, 'KT_light_2_Power', 'KT_light_3_Power');
const kitchenRHS = new SensorLight('pir01_occupancy', timeoutMs_KN_RHS, 'KT_light_1_Power');
const slPir03 = new SensorLight('pir03_occupancy', 5000, 'gDiningRoomAutoLights', 'ZbColourBulb02_CYCLE');
const slPir04 = new SensorLight('pir04_occupancy', 5000, 'gDiningRoomAutoLights', 'ZbColourBulb02_CYCLE');
//test items
const slPir06 = new SensorLight('pir06_occupancy', 5000, 'bg_wifisocket_6_2_power');
const slPir02 = new SensorLight('pir02_occupancy', 5000, 'bg_wifisocket_9_1_power');

// const testSensorLight = new SensorLight('pir99_occupancy', 29999, 'KT_light_zzzzzz_Power');
// const testSensorLight2 = new SensorLight('pir02_occupancy', 29999, 'KT_light_2222222222222_Power');

const sensorLights = [kitchenLHS, kitchenRHS, slPir02, slPir03, slPir04, slPir06];


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
    timerHandle = itemName;
    timerName = ruleUID + '_' + itemName;

    //find sensorlight that has occupancy triggered
    const currentSensorLight = sensorLights.find((sensorLight) => sensorLight.occupancyItemName === itemName);
    logger.debug(`PIR - OFF to ON....find sensorlight: ${itemName}, found currentSensorLight is: ${JSON.stringify(currentSensorLight)}`);


    if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
      //turn on the sensorlight light item(s)
      if (currentSensorLight !== undefined) {
        lightNames = currentSensorLight.lightItemNames;
        lightsOn(lightNames);
      }

      //re/start the timer
      // timerDuration = currentSensorLight.offTimerDuration;
      timerDuration = 1000 * 60 * 10;
      timerMgr.cancel(itemName);
      logger.debug('cancel timer - timerHandle:{}', timerHandle);

      timerMgr.check(timerHandle, timerDuration, () => { lightsOff(lightNames); }, true, null, timerName);
      // timerMgr.check(itemName, currentSensorLight.offTimerDuration, () => { pir_dummy(lightNames); }, true, null, timerName);
      // logger.debug('timerMgr - dummyOffTimer: {}, duration: {} : ', JSON.stringify(lightNames), timerDuration);
      logger.debug('timerMgr.check - timerHandle:{}, duration:{}, lightNames:{}, timerRuleName:{} ', timerHandle, timerDuration, JSON.stringify(lightNames), timerName);

    } else {
      logger.debug(`BridgeLightSensorLevel ABOVE ConservatoryLightTriggerLevel, NOT setting timer : ${timerName}, for item: ${itemName}`);
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
    timerHandle = itemName;

    timerName = ruleUID + '_' + itemName;

    //find sensorlight that has occupancy triggered
    const currentSensorLight = sensorLights.find((sensorLight) => sensorLight.occupancyItemName === itemName);
    logger.debug(`PIR - ON to OFF.........find sensorlight: ${itemName}, found currentSensorLight is: ${JSON.stringify(currentSensorLight)}`);

    if (currentSensorLight !== undefined) {
      lightNames = currentSensorLight.lightItemNames;
      lightsOn(lightNames);
    }
    //re/start the timer
    timerDuration = currentSensorLight.offTimerDuration;
    timerMgr.cancel(timerHandle);
    logger.debug('cancel timer - timerHandle:{}', timerHandle);

    timerMgr.check(timerHandle, timerDuration, () => { lightsOff(lightNames); }, true, null, timerName);
    // timerMgr.check(itemName, currentSensorLight.offTimerDuration, () => { pir_dummy(lightNames); }, true, null, timerName);
    // logger.debug('timerMgr.check - itemName:{}, duration:{}, lightNames:{}, timerName:{} ', itemName, timerDuration, JSON.stringify(lightNames), timerName);
    logger.debug('timerMgr.check - timerHandle:{}, duration:{}, lightNames:{}, timerRuleName:{} ', timerHandle, timerDuration, JSON.stringify(lightNames), timerName);

  },
});

function lightsOff(lightNames) {
  lightNames.forEach((lightName) => {
    logger.debug('==lightsOff lightItemNames: sendCommand( OFF )---{}', lightName);
    items.getItem(lightName).sendCommand('OFF');
  });
}
function lightsOn(lightNames) {
  lightNames.forEach((lightName) => {
    logger.debug('==lightsOn lightItemNames: sendCommand( ON )---{}', lightName);
    items.getItem(lightName).sendCommand('ON');
  });
}

function getTimeouts() {
  let timeoutMs_KN_RHS = (items.getItem('KT_cupboard_lights_timeout').rawState + 1) * 1000
  if (time.toZDT().isBetweenTimes('16:30', '19:30') || time.toZDT().isBetweenTimes('06:00', '07:30')) {
    timeoutMs_KN_RHS = timeoutMs_KN_RHS * 2;
  }

  // let timeoutMs_KN_LHS = (items.getItem('DR_auto_lights_timeout').rawState + 1) * 1000
  let timeoutMs_KN_LHS = timeoutMs_KN_RHS;
  return {
    timeoutMs_KN_RHS,
    timeoutMs_KN_LHS
  };
}

function dummyOffTimer(itemName) {
  logger.debug(`dummyOffTimer called by: ${itemName}`);
}