const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

const logger = log('pir04');

scriptLoaded = function () {
  logger.warn('scriptLoaded - pir 04');
  // loadedDate = Date.now();
};

rules.JSRule({
  name: 'sonoff PIR MONITOR',
  description: 'monitor any sonoff PIR occupancy updates..v..',
  triggers: [triggers.ItemStateUpdateTrigger('pir04_occupancy')],
  execute: (data) => {
    logger.warn(
      `PIR sonoff MONITOR -  pir_occupancy04 received update itemName : ${data.itemName
      }, state: ${items.getItem(data.itemName).state
      }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
    );
  },
});
function pir04_off_body() {
  logger.warn('===The timer is over.pir04_off_body');
  items.getItem('ZbWhiteBulb01Switch').sendCommand('OFF');
}

let pir04_off_timer = null;

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
    logger.warn(`-pir04_occupancy: ${items.getItem('pir04_occupancy').state}`);

    if (items.getItem('CT_LightDark_State').state === 'OFF') {
      logger.warn(`pir04_occupancy inner: ${items.getItem('pir04_occupancy').state}`);
      if (items.getItem('pir04_occupancy').state === 'ON') {
        items.getItem('ZbWhiteBulb01Switch').sendCommand('ON');
        logger.warn("ZbWhiteBulb01Switch').sendCommand('ON')");
        // cancrl the off timer if running
        if (pir04_off_timer && pir04_off_timer.isActive()) {
          pir04_off_timer.cancel();
          logger.warn('-CANCEL STOP running pir04_off_timer');
        }
      }
    }
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
      // logger.warn(
      //   `-pir04_occupancy: STARTING TIMER : OFF, off time is: ${items.getItem('KT_cupboard_lights_timeout').state.toString()}`,
      // );
      const now = time.ZonedDateTime.now();
      pir04_off_timer = actions.ScriptExecution.createTimer(
        now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
        pir04_off_body,
      );
      logger.warn('-pir04_occupancy: STARTING TIMER  OFF END');
    }
  },
});
