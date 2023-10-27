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

rules.JSRule({
  name: 'PIR n updated with ON',
  description: 'PIR - Turn ON lights, cancel off timers  ',
  triggers: [
    triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON'),
  ],
  execute: (event) => {

    itemName = event.itemName.toString();
    logger.debug(`updated pirx_occupancy, Triggering item: ${itemName},state: ${items.getItem(itemName).state}`);

    timerName = ruleUID + '_' + itemName;

    let { timeoutMs_KN_RHS, timeoutMs_KN_LHS } = getTimeouts();
    // logger.debug(`pir01_2 TIMER - OFFtimer is: ${timeoutMs_KN_RHS}`);
    // logger.debug(`pir03_4 TIMER - OFFtimer is: ${timeoutMs_KN_LHS}`);

    if (itemName === kitchenRHSensorOccupancy || itemName === kitchenLHSensorOccupancy) {
      if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
        if (itemName === kitchenRHSensorOccupancy) {
          items.getItem('KT_light_1_Power').sendCommand('ON');//! on
          logger.info('kitchenRHSensorOccupancy - KT_light_1 Power ON');
        }
        if (itemName === kitchenLHSensorOccupancy) {
          items.getItem('KT_light_2_Power').sendCommand('ON');
          items.getItem('KT_light_3_Power').sendCommand('ON');
          logger.info('kitchenLHSensorOccupancyy KT_light_2_3 Power ON');
        }
        logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);
        logger.debug(`pir01_2 TIMER - OFFtimer is: ${timeoutMs_KN_RHS}`);

        timerMgr.check(itemName, timeoutMs_KN_RHS, () => { pir_dummy(timerName); }, true, null, timerName);
      } else {
        logger.debug(`BridgeLightSensorLevel ABOVE ConservatoryLightTriggerLevel, NOT setting ON : ${timerName}, for item: ${itemName}`);
      }
    }

    if (itemName === 'pir03_occupancy' || itemName === 'pir04_occupancy') {
      if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('DR_Auto_Lighting_Trigger_SetPoint').rawState) {
        if (itemName === 'pir03_occupancy') {
          items.getItem('gDiningRoomAutoLights').sendCommand('ON');
          items.getItem('ZbColourBulb02_CYCLE').sendCommand('ON');

          ZbColourBulb02_CYCLE
          logger.info('gDiningRoomAutoLights Power ON');
        }
        if (itemName === 'pir04_occupancy') {
          items.getItem('gDiningRoomAutoLights').sendCommand('ON');
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


rules.JSRule({
  name: 'PIR n changed ON to OFF',
  description: 'PIR sensor start OFF lights timer',
  triggers: [
    triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'ON', 'OFF'),
  ],
  execute: (event) => {
    itemName = event.itemName.toString();
    logger.debug(`pirx_occupancy: ON -> OFF, Triggering item: ${itemName},state: ${items.getItem(itemName).state}`);

    timerName = ruleUID + '_' + itemName;

    let { timeoutMs_KN_RHS, timeoutMs_KN_LHS } = getTimeouts();
    // logger.debug(`pir01_2 TIMER - OFFtimer is: ${timeoutMs_KN_RHS}`);
    // logger.debug(`pir03_4 TIMER - OFFtimer is: ${timeoutMs_KN_LHS}`);



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
  timeoutMs_KN_RHS = (items.getItem('KT_cupboard_lights_timeout').rawState + 1) * 1000
  if (time.toZDT().isBetweenTimes('16:30', '19:30') || time.toZDT().isBetweenTimes('06:00', '07:30')){
    timeoutMs_KN_RHS = timeoutMs_KN_RHS * 2;
  }

  timeoutMs_KN_LHS = (items.getItem('DR_auto_lights_timeout').rawState + 1) * 1000

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
