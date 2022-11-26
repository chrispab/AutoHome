const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

const logger = log('pir');

scriptLoaded = function () {
  logger.warn('scriptLoaded - pir 03 04');
  // loadedDate = Date.now();
};

rules.JSRule({
  name: 'sonoff PIR MONITOR',
  description: 'monitor any sonoff PIR occupancy updates..v..',
  triggers: [triggers.ItemStateUpdateTrigger('pir03_occupancy')],
  execute: (data) => {
    logger.warn(
      `PIR sonoff MONITOR -  pir_occupancy received update itemName : ${data.itemName
      }, state: ${items.getItem(data.itemName).state
      }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
    );
  },
});
function pir04_off_body() {
  logger.warn('===The timer is over.pir04_off_body');
  items.getItem('ZbWhiteBulb01Switch').sendCommand('OFF');
}
// function pir2_off_body() {
//   logger.warn('===The timer is over.pir2_off_body');
//   items.getItem('KT_light_2_Power').sendCommand('OFF');
//   items.getItem('KT_light_3_Power').sendCommand('OFF');
// }

let pir04_off_timer = null;
// let pir02_off_timer = null;
rules.JSRule({
  name: 'pir04 updated with ON',
  description: 'pir04  - Turn ON lights, cancel off timers  ',
  triggers: [
    triggers.ItemStateUpdateTrigger('pir04_occupancy', 'ON'),
    // triggers.ItemStateUpdateTrigger('pir02_occupancy', 'ON'),
  ],
  execute: (data) => {
    logger.warn(
      `-pir04_occupancy received update itemName : ${data.itemName
      }, state: ${items.getItem(data.itemName).state
      }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
    );
    logger.warn(`-BridgeLightSensorLevel: ${items.getItem('BridgeLightSensorLevel').rawState}`);
    logger.warn(
      `-ConservatoryLightTriggerLevel: ${items.getItem('ConservatoryLightTriggerLevel').rawState}`,
    );
    logger.warn(`-pir01_occupancy: ${items.getItem('pir01_occupancy').state}`);

    if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
      logger.warn(`pir04_occupancy inner: ${items.getItem('pir04_occupancy').state}`);
      if (items.getItem('pir04_occupancy').state === 'ON') {
        items.getItem('ZbWhiteBulb01Switch').sendCommand('ON');
        logger.warn('-rxed pir01_occupancy KT_light_1_Power ON');
        // cancrl the off timer if running
        if (pir04_off_timer && pir04_off_timer.isActive()) {
          pir04_off_timer.cancel();
          logger.warn('-CANCEL STOP running pir04_off_timer');
        }
      }

      // if (items.getItem('pir02_occupancy').state === 'ON') {
      //   items.getItem('KT_light_2_Power').sendCommand('ON');
      //   items.getItem('KT_light_3_Power').sendCommand('ON');
      //   logger.warn('-rxed pir02_occupancy KT_light_2 3_PowerON');
      //   if (pir02_off_timer && pir02_off_timer.isActive()) {
      //     pir02_off_timer.cancel();
      //     logger.warn('-CANCEL STOP running pir02_off_timer');
      //   }
      // }
    }
    // logger.warn('pir01_occupancy: end');
  },
});

rules.JSRule({
  name: 'PIRsensor 04ON to OFF - start the lights off timer',
  description: 'PIRsensor start OFF lights timer',
  triggers: [
    triggers.ItemStateChangeTrigger('pir04_occupancy', 'ON', 'OFF'),
    // triggers.ItemStateChangeTrigger('pir02_occupancy', 'ON', 'OFF'),
  ],
  execute: (data) => {
    logger.warn(
      `-pir04_occupancy received update itemName : ${data.itemName
      }, state: ${items.getItem(data.itemName).state
      }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
    );
    if (data.itemName === 'pir04_occupancy') {
      logger.warn(
        `-pir04_occupancy: STARTING TIMER KT_light_1_Power: OFF, off time is: ${items.getItem('KT_cupboard_lights_timeout').state.toString()}`,
      );
      const now = time.ZonedDateTime.now();
      pir04_off_timer = actions.ScriptExecution.createTimer(
        now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
        pir04_off_body,
      );
      logger.warn('-pir04_occupancy: STARTING TIMER KT_light_1_Power: OFF END');
    }
    // if (data.itemName === 'pir04_occupancy') {
    //   logger.warn(
    //     `-STARTING TIMER KT_light_2&3_Power : OFF, off timer is: ${items.getItem('KT_cupboard_lights_timeout').state}`,
    //   );
    //   const now = time.ZonedDateTime.now();
    //   pir02_off_timer = actions.ScriptExecution.createTimer(
    //     now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
    //     pir2_off_body,
    //   );
    //   // logger.warn('-pir02_occupancy: STARTING TIMER KT_light_2&3_Power: OFF END');
    // }
  },
});
