const {
  log, items, rules, actions, time, triggers,
} = require('openhab');

var ruleUID = "pir_action";
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.pir_action
// log:set INFO org.openhab.automation.openhab-js.pir_action

var { TimerMgr } = require('openhab_rules_tools');
var timerMgr = cache.private.get('timers', () => TimerMgr());


scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
};

let kitchenLHSensorOccupancy = 'pir05_occupancy';
let kitchenRHSensorOccupancy = 'pir01_occupancy';

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
class SensorLight {
  constructor(occupancyItem, time, ...items) {
    this.occupancyItem = occupancyItem;
    this.time = time;
    // this.timeTwo = timeTwo;
    // this.itemOne = itemOne;
    // this.itemTwo = itemTwo;
    this.items = items;
  }
}
const { timeoutMs_KN_RHS, timeoutMs_KN_LHS } = getTimeouts();
const kitchenLHS = new SensorLight('pir05_occupancy', timeoutMs_KN_LHS, 'KT_light_2_Power', 'KT_light_3_Power');
const kitchenRHS = new SensorLight('pir01_occupancy', timeoutMs_KN_RHS, 'KT_light_1_Power');
const slPir02 = new SensorLight('pir02_occupancy', timeoutMs_KN_RHS, 'KT_light_1_Power');
const slPir03 = new SensorLight('pir03_occupancy', 5000, 'KT_light_1_Power');
const slPir04 = new SensorLight('pir04_occupancy', 5000, 'KT_light_1_Power');
const slPir06 = new SensorLight('pir06_occupancy', 5000, 'KT_light_1_Power');

// const testSensorLight = new SensorLight('pir99_occupancy', 29999, 'KT_light_zzzzzz_Power');
// const testSensorLight2 = new SensorLight('pir02_occupancy', 29999, 'KT_light_2222222222222_Power');

const sensorLights = [kitchenLHS, kitchenRHS, slPir02, slPir03, slPir04, slPir06];


rules.JSRule({
  name: 'PIR occupancy ON',
  description: 'PIR occupancy ON - Turn ON light',
  triggers: [
    triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON'),
    // triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON'),
  ],
  execute: (event) => {
    logger.debug('>>>>sensorLights: {}', JSON.stringify(sensorLights));

    itemName = event.itemName.toString();
    logger.debug(`PIR occupancy ON, Triggering item: ${itemName},state is: ${items.getItem(itemName).state}`);
    timerName = ruleUID + '_' + itemName;

    //find sensorlight that has occupancy triggered
    const thisSensorLight = sensorLights.find((sensorLight) => sensorLight.occupancyItem === itemName);
    logger.debug(`...............sensorLights.find: ${itemName}, found thisSensorLight is: ${JSON.stringify(thisSensorLight)}`);


    if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
      //turn on the sensorlight light item(s)
      if (thisSensorLight !== undefined) {
        lightNames = thisSensorLight.items;
        lightsOn(lightNames);
        // lightNames.forEach((lightName) => {
        //   logger.debug('===========sensor light items: sendCommand( ON )---{}', lightName);
        //   items.getItem(lightName).sendCommand('ON');
        // });
      }

      //re/start the timer
      timerMgr.check(itemName, thisSensorLight.time*4, () => { lightsOff(lightNames); }, true, null, timerName);
      // timerMgr.check(itemName, thisSensorLight.time, () => { pir_dummy(lightNames); }, true, null, timerName);

    } else {
      logger.debug(`BridgeLightSensorLevel ABOVE ConservatoryLightTriggerLevel, NOT setting ON : ${timerName}, for item: ${itemName}`);
    }



    // let { timeoutMs_KN_RHS, timeoutMs_KN_LHS } = getTimeouts();
    // logger.debug(`pir01_2 timeoutMs_KN_RHS - OFFtimer is: ${timeoutMs_KN_RHS}`);
    // logger.debug(`pir03_4 timeoutMs_KN_LHS - OFFtimer is: ${timeoutMs_KN_LHS}`);

    // if (itemName === kitchenRHSensorOccupancy || itemName === kitchenLHSensorOccupancy) {
    //   if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
    //     if (itemName === kitchenRHSensorOccupancy) {
    //       items.getItem('KT_light_1_Power').sendCommand('ON');//! on
    //       logger.info('kitchenRHSensorOccupancy - KT_light_1 Power ON');
    //     }
    //     if (itemName === kitchenLHSensorOccupancy) {
    //       items.getItem('KT_light_2_Power').sendCommand('ON');
    //       items.getItem('KT_light_3_Power').sendCommand('ON');
    //       logger.info('kitchenLHSensorOccupancyy KT_light_2_3 Power ON');
    //     }
    //     logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);
    //     logger.debug(`pir01_2 TIMER - OFFtimer is: ${timeoutMs_KN_RHS}`);

    //     timerMgr.check(itemName, timeoutMs_KN_RHS, () => { pir_dummy(timerName); }, true, null, timerName);
    //   } else {
    //     logger.debug(`BridgeLightSensorLevel ABOVE ConservatoryLightTriggerLevel, NOT setting ON : ${timerName}, for item: ${itemName}`);
    //   }
    // }

    if (itemName === 'pir03_occupancy' || itemName === 'pir04_occupancy') {
      if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('DR_Auto_Lighting_Trigger_SetPoint').rawState) {
        if (itemName === 'pir03_occupancy') {
          items.getItem('gDiningRoomAutoLights').sendCommand('ON');
          items.getItem('ZbColourBulb02_CYCLE').sendCommand('ON');

          // ZbColourBulb02_CYCLE
          logger.info('gDiningRoomAutoLights Power ON');
        }
        if (itemName === 'pir04_occupancy') {
          items.getItem('gDiningRoomAutoLights').sendCommand('ON');

          items.getItem('ZbColourBulb02_CYCLE').sendCommand('OFF');
          items.getItem('ZbColourBulb02_CYCLE').sendCommand('ON');

          logger.info('gDiningRoomAutoLights Power ON');
        }
        logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);
        timerMgr.check(itemName, timeoutMs_KN_LHS, () => { pir_dummy(timerName); }, true, null, timerName);
        logger.debug(`pir03_4 TIMER - OFFtimer is: ${timeoutMs_KN_LHS}`);

      } else {
        logger.debug(`BridgeLightSensorLevel ABOVE DR_Auto_Lighting_Trigger_SetPoint, NOT setting ON : ${timerName}, for item: ${itemName}`);
      }
    }
  },
});

function lightsOff(lightNames) {
  lightNames.forEach((lightName) => {
    logger.debug('===========sensor light items: sendCommand( OFF )---{}', lightName);
    items.getItem(lightName).sendCommand('OFF');
  });
}
function lightsOn(lightNames) {
  lightNames.forEach((lightName) => {
    logger.debug('===========sensor light items: sendCommand( ON )---{}', lightName);
    items.getItem(lightName).sendCommand('ON');
  });
}

rules.JSRule({
  name: 'PIR -changed ON to OFF',
  description: 'PIR sensor start OFF lights timer',
  triggers: [
    triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'ON', 'OFF'),
  ],
  execute: (event) => {
    itemName = event.itemName.toString();
    logger.debug(`Triggering item: ${itemName} ON -> OFF,state: ${items.getItem(itemName).state}`);

    timerName = ruleUID + '_' + itemName;

    let { timeoutMs_KN_RHS, timeoutMs_KN_LHS } = getTimeouts();
    logger.debug(`pir01_2 TIMER - OFFtimer is: ${timeoutMs_KN_RHS}`);
    logger.debug(`pir03_4 TIMER - OFFtimer is: ${timeoutMs_KN_LHS}`);



    if (event.itemName === kitchenRHSensorOccupancy) {
      logger.debug(`pir01_occupancy: STARTING OFF TIMER KT_light_1_ Power: OFF,time is: ${timeoutMs_KN_RHS}`);
      timerMgr.check(itemName, timeoutMs_KN_RHS, () => { pir1_off_body(); }, true, null, timerName);
      logger.debug(`pir01_2 TIMER - OFFtimer is: ${timeoutMs_KN_RHS}`);

      logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);
    }
    if (event.itemName === kitchenLHSensorOccupancy) {
      logger.debug(`pir02_occupancy: STARTING OFF TIMER KT_light_2_3 Power: OFF,time is: ${timeoutMs_KN_RHS}`);
      timerMgr.check(itemName, timeoutMs_KN_RHS, () => { pir2_off_body(); }, true, null, timerName);
      logger.debug(`pir01_2 TIMER - OFFtimer is: ${timeoutMs_KN_RHS}`);

      logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);

    }
    if (event.itemName === 'pir03_occupancy') {
      logger.debug(`pir03_occupancy: STARTING OFF TIMER gDiningRoomAutoLights: OFF,time is: ${timeoutMs_KN_LHS}`);
      timerMgr.check(itemName, timeoutMs_KN_LHS, () => { timer_pir_off('gDiningRoomAutoLights'); }, true, null, timerName);
      logger.debug(`pir03_4 TIMER - OFFtimer is: ${timeoutMs_KN_LHS}`);

      logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);

    }
    if (event.itemName === 'pir04_occupancy') {
      logger.debug(`pir04_occupancy: STARTING OFF TIMER gDiningRoomAutoLights: OFF,time is: ${timeoutMs_KN_LHS}`);
      timerMgr.check(itemName, timeoutMs_KN_LHS, () => { timer_pir_off('gDiningRoomAutoLights'); }, true, null, timerName);
      logger.debug(`pir03_4 TIMER - OFFtimer is: ${timeoutMs_KN_LHS}`);

      logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);

    }
  },
});

function getTimeouts() {
  let timeoutMs_KN_RHS = (items.getItem('KT_cupboard_lights_timeout').rawState + 1) * 1000
  if (time.toZDT().isBetweenTimes('16:30', '19:30') || time.toZDT().isBetweenTimes('06:00', '07:30')) {
    let timeoutMs_KN_RHS = timeoutMs_KN_RHS * 2;
  }

  let timeoutMs_KN_LHS = (items.getItem('DR_auto_lights_timeout').rawState + 1) * 1000

  return {
    timeoutMs_KN_RHS,
    timeoutMs_KN_LHS
  };
}


function pir1_off_body() {
  logger.info('pir01_occupancy - KT_light_1_Power OFF');
  items.getItem('KT_light_1_Power').sendCommand('OFF');
}
function pir2_off_body() {
  logger.info('pir02_occupancy - KT_light_2_3_Power OFF');
  items.getItem('KT_light_2_Power').sendCommand('OFF');
  items.getItem('KT_light_3_Power').sendCommand('OFF');
}
function pir_dummy(itemName) {
  logger.debug(`pir_dummy_timer called by: ${itemName}`);
}
function timer_pir_off(itemName) {
  logger.info(`timer_pir_off ${itemName} Power OFF`);
  items.getItem(itemName).sendCommand('OFF');
}
