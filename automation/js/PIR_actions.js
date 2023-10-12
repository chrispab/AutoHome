const {
  log, items, rules, actions, time, triggers,
} = require('openhab');

var ruleUID = "pir_action";
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.pir_action
var { TimerMgr } = require('openhab_rules_tools');
var timerMgr = cache.private.get('timers', () => TimerMgr());


scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
};



rules.JSRule({
  name: 'PIR n updated with ON',
  description: 'PIR - Turn ON lights, cancel off timers  ',
  triggers: [
    triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON'),
  ],
  execute: (event) => {
    itemName = event.itemName.toString();
    logger.debug(`updated pirx_occupancy, Triggering item: ${itemName},state: ${items.getItem(itemName).state}`);

    // logger.debug(`updated pirx_occupancy: ${items.getItem(itemName).state}`);
    // logger.debug(`-BridgeLightSensorLevel: ${items.getItem('BridgeLightSensorLevel').rawState}`);
    // logger.debug(`-ConservatoryLightTriggerLevel: ${items.getItem('ConservatoryLightTriggerLevel').rawState}`);

    // timeout = items.getItem('KT_cupboard_lights_timeout').rawState
    timerName = ruleUID + '_' + itemName;

    // timeoutSeconds = items.getItem('KT_cupboard_lights_timeout').rawState + 1;
    // timeoutMs = timeoutSeconds * 1000;
    // timeout = time.toZDT(timeoutMs);
    timeoutMsPir1_2 = (items.getItem('KT_cupboard_lights_timeout').rawState + 1) * 1000
    if (time.toZDT().isBetweenTimes('17:00', '19:00')){
      timeoutMsPir1_2 = timeoutMsPir1_2 * 4;
    }
    // timeoutDefaultPir3_4 = time.toZDT(1000);
    timeoutMsPir3_4 = (items.getItem('DR_auto_lights_timeout').rawState + 1) * 1000

    if (itemName === 'pir01_occupancy' || itemName === 'pir02_occupancy') {
      if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
        if (itemName === 'pir01_occupancy') {
          items.getItem('KT_light_1_Power').sendCommand('ON');//! on
          logger.info('pir01_occupancy - KT_light_1 Power ON');
        }
        if (itemName === 'pir02_occupancy') {
          items.getItem('KT_light_2_Power').sendCommand('ON');
          items.getItem('KT_light_3_Power').sendCommand('ON');
          logger.info('pir02_occupancy KT_light_2_3 Power ON');
        }
        logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);
        timerMgr.check(itemName, timeoutMsPir1_2, () => { pir_dummy(timerName); }, true, null, timerName);
      } else {
        logger.debug(`BridgeLightSensorLevel ABOVE ConservatoryLightTriggerLevel, NOT setting ON : ${timerName}, for item: ${itemName}`);
      }
    }

    if (itemName === 'pir03_occupancy' || itemName === 'pir04_occupancy') {
      if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('DR_Auto_Lighting_Trigger_SetPoint').rawState) {
        if (itemName === 'pir03_occupancy') {
          items.getItem('gDiningRoomAutoLights').sendCommand('ON');
          logger.info('gDiningRoomAutoLights Power ON');
        }
        if (itemName === 'pir04_occupancy') {
          items.getItem('gDiningRoomAutoLights').sendCommand('ON');
          logger.info('gDiningRoomAutoLights Power ON');
        }
        logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);
        timerMgr.check(itemName, timeoutMsPir3_4, () => { pir_dummy(timerName); }, true, null, timerName);
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

    // logger.debug(`Triggering item: ${itemName}`);
    // logger.debug(`pirx_occupancy: ON -> OFF`);

    timerName = ruleUID + '_' + itemName;

    // timeoutSeconds = items.getItem('KT_cupboard_lights_timeout').rawState + 1;
    // timeoutMs = timeoutSeconds * 1000;
    // timeout = time.toZDT(timeoutMs);
    // timeoutDefaultPir3_4 = time.toZDT(1000);

    timeoutMsPir1_2 = (items.getItem('KT_cupboard_lights_timeout').rawState + 1) * 1000
    if (time.toZDT().isBetweenTimes('17:00', '19:00')){
      timeoutMsPir1_2 = timeoutMsPir1_2 * 4;
    }

    timeoutMsPir3_4 = (items.getItem('DR_auto_lights_timeout').rawState + 1) * 1000

    if (event.itemName === 'pir01_occupancy') {
      logger.debug(`pir01_occupancy: STARTING OFF TIMER KT_light_1_ Power: OFF,time is: ${timeoutMsPir1_2}`);
      timerMgr.check(itemName, timeoutMsPir1_2, () => { pir1_off_body(); }, true, null, timerName);
      logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);
    }
    if (event.itemName === 'pir02_occupancy') {
      logger.debug(`pir02_occupancy: STARTING OFF TIMER KT_light_2_3 Power: OFF,time is: ${timeoutMsPir1_2}`);
      timerMgr.check(itemName, timeoutMsPir1_2, () => { pir2_off_body(); }, true, null, timerName);
      logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);

    }
    if (event.itemName === 'pir03_occupancy') {
      logger.debug(`pir03_occupancy: STARTING OFF TIMER gDiningRoomAutoLights: OFF,time is: ${timeoutMsPir3_4}`);
      timerMgr.check(itemName, timeoutMsPir3_4, () => { timer_pir_off('gDiningRoomAutoLights'); }, true, null, timerName);
      logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);

    }
    if (event.itemName === 'pir04_occupancy') {
      logger.debug(`pir04_occupancy: STARTING OFF TIMER gDiningRoomAutoLights: OFF,time is: ${timeoutMsPir3_4}`);
      timerMgr.check(itemName, timeoutMsPir3_4, () => { timer_pir_off('gDiningRoomAutoLights'); }, true, null, timerName);
      logger.debug(`checking/starting/restarting Timer: ${timerName}, for item: ${itemName}`);

    }
  },
});


function pir1_off_body() {
  logger.debug('pir01_occupancy - KT_light_1_Power OFF');
  items.getItem('KT_light_1_Power').sendCommand('OFF');
}
function pir2_off_body() {
  logger.debug('pir02_occupancy - KT_light_2_3_Power OFF');
  items.getItem('KT_light_2_Power').sendCommand('OFF');
  items.getItem('KT_light_3_Power').sendCommand('OFF');
}
function pir_dummy(itemName) {
  logger.debug(`pir_dummy_timer called by: ${itemName}`);

}
function timer_pir_off(itemName) {
  logger.debug(`timer_pir_off ${itemName} Power OFF`);
  items.getItem(itemName).sendCommand('OFF');
}
