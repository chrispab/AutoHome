const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

var ruleUID = "kitchen_pir";
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
  name: 'pir01 or 02 updated with ON',
  description: 'pir01 or 02  - Turn ON lights, cancel off timers  ',
  triggers: [
    // triggers.ItemStateUpdateTrigger('pir01_occupancy', 'ON'),
    // triggers.ItemStateUpdateTrigger('pir02_occupancy', 'ON'),
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
        logger.info('pir01_occupancy - KT_light_1_Power ON');
      }

      if (itemName === 'pir02_occupancy') {
        items.getItem('KT_light_2_Power').sendCommand('ON');
        items.getItem('KT_light_3_Power').sendCommand('ON');
        logger.info('pir02_occupancy KT_light_2 3_Power ON');
      }

      timerMgr.check(itemName, timeout, () => {pir_dummy();}, true, null, timerName);

    }
  },
});


rules.JSRule({
  name: 'PIR2sensor ON to OFF - start the lights off timer',
  description: 'PIR2sensor start OFF lights timer',
  triggers: [
    triggers.ItemStateChangeTrigger('pir01_occupancy', 'ON', 'OFF'),
    triggers.ItemStateChangeTrigger('pir02_occupancy', 'ON', 'OFF'),
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

    logger.info( `${event.itemName}: STARTING off TIMER , off time: ${timeoutSeconds} secs` );
    logger.info( `${event.itemName}: STARTING off TIMER , off time: ${timeoutMs} Msecs` );


    if (event.itemName === 'pir01_occupancy') {
      logger.debug(`pir01_occupancy: STARTING OFF TIMER KT_light_1_Power: OFF,time is: ${timeout}` );
      timerMgr.check(itemName, timeout, () => {pir1_off_body();}, true, null, timerName);
    }
    if (event.itemName === 'pir02_occupancy') {
      logger.debug(`pir02_occupancy: STARTING OFF TIMER KT_light_2_Power: OFF,time is: ${timeout}` );
      timerMgr.check(itemName, timeout, () => {pir2_off_body();}, true, null, timerName);
    }
  },
});
