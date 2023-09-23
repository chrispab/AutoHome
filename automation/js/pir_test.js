const {
    log, items, rules, actions, time, triggers,
  } = require('openhab');
  const { timeUtils } = require('openhab_rules_tools');

  const logger = log('zb1');

  scriptLoaded = function () {
    logger.info('scriptLoaded - pir_test');

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

      var item = items.getItem(data.itemName);
      var historic = item.history.previousState;
      logger.debug(
        `-pir_occupancy received update- itemName : ${data.itemName
        }, now state: ${item.state
        // }, PREV state: ${items.getItem(data.itemName).history.previousState.state}`,
        }, previous state: ${historic.state}`,
      // }, PREV state: ${data.oldItemState}`,

        );
    },
  });
