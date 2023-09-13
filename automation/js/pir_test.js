const {
    log, items, rules, actions, time, triggers,
  } = require('openhab');
  const { timeUtils } = require('openhab_rules_tools');

  const logger = log('pir_test');

  scriptLoaded = function () {
    logger.error('scriptLoaded - pir_test');

};

rules.JSRule({
    name: 'pir01 to 06 updated',
    description: 'pir01 to 06 updated ',
    triggers: [
      triggers.ItemStateUpdateTrigger('pir01_occupancy'),
      triggers.ItemStateUpdateTrigger('pir02_occupancy'),
      triggers.ItemStateUpdateTrigger('pir03_occupancy'),
      triggers.ItemStateUpdateTrigger('pir04_occupancy'),
      triggers.ItemStateUpdateTrigger('pir05_occupancy'),
      triggers.ItemStateUpdateTrigger('pir06_occupancy'),

    ],
    execute: (data) => {
      logger.error(
        `-pir_occupancy received update itemName : ${data.itemName
        }, state: ${items.getItem(data.itemName).state
        }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
      );
    //   logger.debug(`-BridgeLightSensorLevel: ${items.getItem('BridgeLightSensorLevel').rawState}`);
    //   logger.debug(
    //     `-ConservatoryLightTriggerLevel: ${items.getItem('ConservatoryLightTriggerLevel').rawState}`,
    //   );
    //   logger.debug(`-pir01_occupancy: ${items.getItem('pir01_occupancy').state}`);

    //   if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
    //     logger.debug(`pir01_occupancy inner: ${items.getItem('pir01_occupancy').state}`);
    //     if (items.getItem('pir01_occupancy').state === 'ON') {
    //       items.getItem('KT_light_1_Power').sendCommand('ON');//! on
    //       logger.debug('-rxed pir01_occupancy KT_light_1_Power ON');
    //       // cancrl the off timer if running
    //       if (pir01_off_timer && pir01_off_timer.isActive()) {
    //         pir01_off_timer.cancel();
    //         logger.debug('-CANCEL STOP running pir01_off_timer');
    //       }

    //       // if timer is null, start it
    //       // pir01_off_timer = null;
    //       // if (pir01_off_timer == null || pir01_off_timer === undefined) {
    //       //   const now = time.ZonedDateTime.now();
    //       //   pir01_off_timer = actions.ScriptExecution.createTimer(
    //       //     now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
    //       //     pir1_off_body,
    //       //   );
    //       //   logger.debug('===pir01_occupancy: STARTING OFF TIMER KT_light_1_Power');
    //       // } else { // else retrigger it, it exists
    //       //   const now = time.ZonedDateTime.now();
    //       //   logger.debug('===pir01_occupancy: retrigger  TIMER KT_light_1_Power');
    //       //   pir01_off_timer.reschedule(now.plusSeconds(20));
    //       // }
    //     }

    //     if (items.getItem('pir02_occupancy').state === 'ON') {
    //       items.getItem('KT_light_2_Power').sendCommand('ON');
    //       items.getItem('KT_light_3_Power').sendCommand('ON');
    //       logger.debug('-rxed pir02_occupancy KT_light_2 3_Power ON');
    //       if (pir02_off_timer && pir02_off_timer.isActive()) {
    //         pir02_off_timer.cancel();
    //         logger.debug('-CANCEL STOP running pir02_off_timer');
    //       }
    //     }
    //   }
      // logger.debug('pir01_occupancy: end');
    },
  });
