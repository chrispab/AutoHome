const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

const logger = log('pir03');

scriptLoaded = function () {
  logger.warn('scriptLoaded - pir 03');
  // loadedDate = Date.now();
};

function pir03_off_body() {
  logger.debug('===The timer is over.pir03_off_body');
  // items.getItem('ZbWhiteBulb01Switch').sendCommand('OFF');
  // items.getItem('ZbColourBulb01_switch').sendCommand('OFF');
  items.getItem('gDiningRoomAutoLights').sendCommand('OFF');
}

let pir03_off_timer = null;

rules.JSRule({
  name: 'pir03 updated with ON',
  description: 'pir03_occupancy  - Turn ON lights, cancel off timers  ',
  triggers: [
    triggers.ItemStateUpdateTrigger('pir03_occupancy', 'ON'),
    // triggers.ItemStateUpdateTrigger('pir02_occupancy', 'ON'),
  ],
  execute: (data) => {
    logger.debug(
      `-pir03_occupancy received update itemName : ${data.itemName
      }, state: ${items.getItem(data.itemName).state
      }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
    );
    logger.debug(`-BridgeLightSensorLevel: ${items.getItem('BridgeLightSensorLevel').rawState}`);
    logger.debug(
      `-ConservatoryLightTriggerLevel: ${items.getItem('ConservatoryLightTriggerLevel').rawState}`,
    );
    logger.debug(`-pir03_occupancy: ${items.getItem('pir03_occupancy').state}`);

    if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('DR_Auto_Lighting_Trigger_SetPoint').rawState) {
      logger.info(`pir03_occupancy inner: ${items.getItem('pir03_occupancy').state}`);
      if (items.getItem('pir03_occupancy').state === 'ON') {
        // items.getItem('ZbWhiteBulb01Switch').sendCommand('ON');
        items.getItem('gDiningRoomAutoLights').sendCommand('ON');

        logger.debug("items.getItem('ZbWhiteBulb01Switch').sendCommand('ON')");

        // items.getItem('ZbColourBulb01_switch').sendCommand('ON');

        // cancrl the off timer if running
        if (pir03_off_timer && pir03_off_timer.isActive()) {
          pir03_off_timer.cancel();
          logger.debug('-CANCEL STOP running pir03_off_timer');
        }
      }
    }
  },
});

rules.JSRule({
  name: 'PIRsensor 03 ON to OFF - start the lights off timer',
  description: 'PIRsensor start OFF lights timer',
  triggers: [
    triggers.ItemStateChangeTrigger('pir03_occupancy', 'ON', 'OFF'),
  ],
  execute: (data) => {
    logger.debug(
      `-pir03_occupancy received update itemName : ${data.itemName
      }, state: ${items.getItem(data.itemName).state
      }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
    );
    if (data.itemName === 'pir03_occupancy') {
      // logger.warn(
      //   `-pir03_occupancy: STARTING TIMER KT_light_1_Power: OFF, off time is: ${items.getItem('KT_cupboard_lights_timeout').state.toString()}`,
      // );
      const now = time.ZonedDateTime.now();
      pir03_off_timer = actions.ScriptExecution.createTimer(
        now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
        pir03_off_body,
      );
      logger.debug('-pir03_occupancy: STARTING TIMER : OFF END');
    }
  },
});
