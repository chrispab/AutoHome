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
  logger.debug('scriptLoaded - pir1_2');
};

function pir1_off_body() {
  logger.debug('===The timer is over.pir1_off_body');
  logger.info('pir01_occupancy - KT_light_1_Power OFF');
  items.getItem('KT_light_1_Power').sendCommand('OFF');
}
function pir2_off_body() {
  logger.debug('===The timer is over.pir2_off_body');
  logger.info('pir02_occupancy - KT_light_2_3_Power OFF');
  items.getItem('KT_light_2_Power').sendCommand('OFF');
  items.getItem('KT_light_3_Power').sendCommand('OFF');
}

// let pir01_off_timer = null;
// let pir02_off_timer = null;
rules.JSRule({
  name: 'pir01 or 02 updated with ON',
  description: 'pir01 or 02  - Turn ON lights, cancel off timers  ',
  triggers: [
    triggers.ItemStateUpdateTrigger('pir01_occupancy', 'ON'),
    triggers.ItemStateUpdateTrigger('pir02_occupancy', 'ON'),
  ],
  execute: (event) => {
    logger.debug(`updated pir01_occupancy: ${items.getItem('pir01_occupancy').state}`);
    logger.debug(`-BridgeLightSensorLevel: ${items.getItem('BridgeLightSensorLevel').rawState}`);
    logger.debug(`-ConservatoryLightTriggerLevel: ${items.getItem('ConservatoryLightTriggerLevel').rawState}`);

    itemName = event.itemName.toString();
    timeout = items.getItem('KT_cupboard_lights_timeout').rawState
    timerName = ruleUID + '_' + itemName;

    if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
      if (itemName == 'pir01_occupancy') {
        items.getItem('KT_light_1_Power').sendCommand('ON');//! on
        logger.info('pir01_occupancy - KT_light_1_Power ON');

        timerMgr.check(itemName, timeout, () => {
          logger.debug(`${timerName} TIMER on - no body`);
        }, true, null, timerName);
      }

      if (itemName == 'pir02_occupancy') {
        items.getItem('KT_light_2_Power').sendCommand('ON');
        items.getItem('KT_light_3_Power').sendCommand('ON');
        logger.info('pir02_occupancy KT_light_2 3_Power ON');

        timerMgr.check(itemName, timeout, () => {
          logger.debug(`${timerName} TIMER on - no body`);
        }, true, null, timerName);
      }
    }
  },
});


rules.JSRule({
  name: 'PIR2sensor ON to OFF - start the lights off timer',
  description: 'PIR2sensor start OFF lights timer',
  triggers: [
    triggers.ItemStateChangeTrigger('pir01_occupancy', 'ON', 'OFF'),
    triggers.ItemStateChangeTrigger('pir02_occupancy', 'ON', 'OFF'),
  ],
  execute: (event) => {
    logger.debug(`pirx_occupancy: ON -> OFF`);

    itemName = event.itemName.toString();
    timeoutms = items.getItem('KT_cupboard_lights_timeout').rawState;
    timeout = time.toZDT((timeoutms+1)*1000);

    logger.info( `${event.itemName}: STARTING off TIMER , off time: ${timeout}` );
    timerName = ruleUID + '_' + itemName;
    //!set off timer duration based on bridge light level and /or time of day
    // if (items.getItem('CT_LightDark_State').state === "OFF") {
    //   timeout = items.getItem('KT_cupboard_lights_timeout').rawState;
    // } else {
    //   timeout = items.getItem('KT_cupboard_lights_timeout').rawState / 3;
    // }
    if (event.itemName === 'pir01_occupancy') {
      logger.debug(`pir01_occupancy: STARTING OFF TIMER KT_light_1_Power: OFF,time is: ${timeout}` );

      timerMgr.check(itemName, timeout, () => {pir1_off_body();}, false, null, timerName);
    }
    if (event.itemName === 'pir02_occupancy') {
      logger.debug(`pir02_occupancy: STARTING OFF TIMER KT_light_2_Power: OFF,time is: ${timeout}` );

      timerMgr.check(itemName, timeout, () => {pir2_off_body();}, false, null, timerName);
    }
  },
});
