const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

var ruleUID = "pir_action";
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.kitchen_pir
var { TimerMgr } = require('openhab_rules_tools');
var timerMgr = cache.private.get('timers', () => TimerMgr());


scriptLoaded = function () {
  logger.debug(`scriptLoaded - ${ruleUID}`);
};

function pir1_off_body() {
  logger.info('pir01_occupancy - KT_light_1_Power OFF');
  items.getItem('KT_light_1_Power').sendCommand('OFF');
}
function pir2_off_body() {
  logger.info('pir02_occupancy - KT_light_2_3_Power OFF');
  items.getItem('KT_light_2_Power').sendCommand('OFF');
  items.getItem('KT_light_3_Power').sendCommand('OFF');
}
function pir_dummy() {
  logger.info('pir_dummy - on');

}

rules.JSRule({
  name: 'pir n updated with ON',
  description: 'pir - Turn ON lights, cancel off timers  ',
  triggers: [
    triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON'),

  ],
  execute: (event) => {
    itemName = event.itemName.toString();
    logger.debug(`Triggering item: ${itemName}`);

    logger.debug(`updated pirx_occupancy: ${items.getItem(itemName).state}`);
    logger.debug(`-BridgeLightSensorLevel: ${items.getItem('BridgeLightSensorLevel').rawState}`);
    logger.debug(`-ConservatoryLightTriggerLevel: ${items.getItem('ConservatoryLightTriggerLevel').rawState}`);

    timeout = items.getItem('KT_cupboard_lights_timeout').rawState
    timerName = ruleUID + '_' + itemName;

    timeoutSeconds = items.getItem('KT_cupboard_lights_timeout').rawState + 1;
    timeoutMs = timeoutSeconds * 1000;
    timeout = time.toZDT(timeoutMs);

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
      if (itemName === 'pir03_occupancy') {
        items.getItem('gDiningRoomAutoLights').sendCommand('ON');
        logger.info('gDiningRoomAutoLights Power ON');
      }
      if (itemName === 'pir04_occupancy') {
        items.getItem('gDiningRoomAutoLights').sendCommand('ON');
        logger.info('gDiningRoomAutoLights Power ON');
      }
      timerMgr.check(itemName, timeout, () => {pir_dummy();}, true, null, timerName);
    }
  },
});


rules.JSRule({
  name: 'PIR n sensor ON to OFF',
  description: 'PIR sensor start OFF lights timer',
  triggers: [
    triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'ON', 'OFF'),
  ],
  execute: (event) => {
    itemName = event.itemName.toString();
    logger.debug(`Triggering item: ${itemName}`);
    logger.debug(`pirx_occupancy: ON -> OFF`);

    timerName = ruleUID + '_' + itemName;

    timeoutSeconds = items.getItem('KT_cupboard_lights_timeout').rawState + 1;
    timeoutMs = timeoutSeconds * 1000;
    timeout = time.toZDT(timeoutMs);

    if (event.itemName === 'pir01_occupancy') {
      logger.debug(`pir01_occupancy: STARTING OFF TIMER KT_light_1_ Power: OFF,time is: ${timeout}` );
      timerMgr.check(itemName, timeout, () => {pir1_off_body();}, true, null, timerName);
    }
    if (event.itemName === 'pir02_occupancy') {
      logger.debug(`pir02_occupancy: STARTING OFF TIMER KT_light_2_3 Power: OFF,time is: ${timeout}` );
      timerMgr.check(itemName, timeout, () => {pir2_off_body();}, true, null, timerName);
    }
    if (event.itemName === 'pir03_occupancy') {
      logger.debug(`pir03_occupancy: STARTING OFF TIMER gDiningRoomAutoLights: OFF,time is: ${timeout}` );
      timerMgr.check(itemName, timeout, items.getItem('gDiningRoomAutoLights').sendCommand('OFF'), true, null, timerName);
    }
    if (event.itemName === 'pir04_occupancy') {
      logger.debug(`pir04_occupancy: STARTING OFF TIMER gDiningRoomAutoLights: OFF,time is: ${timeout}` );
      timerMgr.check(itemName, timeout, items.getItem('gDiningRoomAutoLights').sendCommand('OFF'), true, null, timerName);
    }
  },
});
