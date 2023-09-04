const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

const logger = log('kitchen_pir');

scriptLoaded = function () {
  logger.debug('scriptLoaded - pir1_2');
  // loadedDate = Date.now();
};

function pir1_off_body() {
  logger.debug('===The timer is over.pir1_off_body');
  items.getItem('KT_light_1_Power').sendCommand('OFF');
}
function pir2_off_body() {
  logger.debug('===The timer is over.pir2_off_body');
  items.getItem('KT_light_2_Power').sendCommand('OFF');
  items.getItem('KT_light_3_Power').sendCommand('OFF');
}

let pir01_off_timer = null;
let pir02_off_timer = null;
rules.JSRule({
  name: 'pir01 or 02 updated with ON',
  description: 'pir01 or 02  - Turn ON lights, cancel off timers  ',
  triggers: [
    triggers.ItemStateUpdateTrigger('pir01_occupancy', 'ON'),
    triggers.ItemStateUpdateTrigger('pir02_occupancy', 'ON'),
  ],
  execute: (data) => {
    // logger.debug(
    //   `-pir_occupancy received update itemName : ${data.itemName
    //   }, state: ${items.getItem(data.itemName).state
    //   }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
    // );
    logger.debug(`-BridgeLightSensorLevel: ${items.getItem('BridgeLightSensorLevel').rawState}`);
    logger.debug(
      `-ConservatoryLightTriggerLevel: ${items.getItem('ConservatoryLightTriggerLevel').rawState}`,
    );
    logger.debug(`-pir01_occupancy: ${items.getItem('pir01_occupancy').state}`);

    if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
      logger.debug(`pir01_occupancy inner: ${items.getItem('pir01_occupancy').state}`);
      if (items.getItem('pir01_occupancy').state === 'ON') {
        items.getItem('KT_light_1_Power').sendCommand('ON');//! on
        logger.debug('-rxed pir01_occupancy KT_light_1_Power ON');
        // cancrl the off timer if running
        if (pir01_off_timer && pir01_off_timer.isActive()) {
          pir01_off_timer.cancel();
          logger.debug('-CANCEL STOP running pir01_off_timer');
        }

        // if timer is null, start it
        // pir01_off_timer = null;
        // if (pir01_off_timer == null || pir01_off_timer === undefined) {
        //   const now = time.ZonedDateTime.now();
        //   pir01_off_timer = actions.ScriptExecution.createTimer(
        //     now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
        //     pir1_off_body,
        //   );
        //   logger.debug('===pir01_occupancy: STARTING OFF TIMER KT_light_1_Power');
        // } else { // else retrigger it, it exists
        //   const now = time.ZonedDateTime.now();
        //   logger.debug('===pir01_occupancy: retrigger  TIMER KT_light_1_Power');
        //   pir01_off_timer.reschedule(now.plusSeconds(20));
        // }
      }

      if (items.getItem('pir02_occupancy').state === 'ON') {
        items.getItem('KT_light_2_Power').sendCommand('ON');
        items.getItem('KT_light_3_Power').sendCommand('ON');
        logger.debug('-rxed pir02_occupancy KT_light_2 3_Power ON');
        if (pir02_off_timer && pir02_off_timer.isActive()) {
          pir02_off_timer.cancel();
          logger.debug('-CANCEL STOP running pir02_off_timer');
        }
      }
    }
    // logger.debug('pir01_occupancy: end');
  },
});

rules.JSRule({
  name: 'PIRsensor ON to OFF - start the lights off timer',
  description: 'PIRsensor start OFF lights timer',
  triggers: [
    triggers.ItemStateChangeTrigger('pir01_occupancy', 'ON', 'OFF'),
    triggers.ItemStateChangeTrigger('pir02_occupancy', 'ON', 'OFF'),
  ],
  execute: (data) => {
    // logger.debug(
    //   `-pir_occupancy received update itemName : ${data.itemName
    //   }, state: ${items.getItem(data.itemName).state
    //   }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
    // );

    logger.info(
      `${data.itemName}: STARTING off TIMER , off time is: ${items.getItem('KT_cupboard_lights_timeout').state.toString()}`,
    );

    //!set off timer duration based on bridge light level and /or time of day
    // if(items.getItem('BridgeLightSensorLevel').rawState < )
    if (items.getItem('CT_LightDark_State').state === "OFF") {
      offTimerDuration = items.getItem('KT_cupboard_lights_timeout').rawState;
    } else {
      offTimerDuration = items.getItem('KT_cupboard_lights_timeout').rawState / 3;
    }
    if (data.itemName === 'pir01_occupancy') {
      // logger.debug(
      //   `-pir01_occupancy: STARTING TIMER KT_light_1_Power: OFF, off time is: ${items.getItem('KT_cupboard_lights_timeout').state.toString()}`,
      // );
      const now = time.ZonedDateTime.now();
      pir01_off_timer = actions.ScriptExecution.createTimer(
        // now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
        now.plusSeconds(offTimerDuration),
        pir1_off_body,
      );
      // logger.debug('-pir01_occupancy: STARTING TIMER KT_light_1_Power: OFF END');
    }
    if (data.itemName === 'pir02_occupancy') {
      // logger.debug(
      //   `-STARTING TIMER KT_light_2&3_Power : OFF, off timer is: ${items.getItem('KT_cupboard_lights_timeout').state}`,
      // );
      const now = time.ZonedDateTime.now();
      pir02_off_timer = actions.ScriptExecution.createTimer(
        now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
        pir2_off_body,
      );
      // logger.debug('-pir02_occupancy: STARTING TIMER KT_light_2&3_Power: OFF END');
    }
  },
});
