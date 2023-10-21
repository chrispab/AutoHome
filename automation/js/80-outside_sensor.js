const {
  log, items, rules, actions, triggers,
} = require('openhab');
// log:set WARN org.openhab.automation.openhab-js.outside_sensor
// log:set DEBUG org.openhab.automation.openhab-js.outside_sensor
var ruleUID = "outside_sensor";
const logger = log(ruleUID);

scriptLoaded = function () {
  logger.info('scriptLoaded init outside sensor stuff');
};

rules.JSRule({
  name: 'outside sensor went offlineZZ',
  description: 'outside sensor went offline',
  triggers: [
    triggers.ItemStateUpdateTrigger('Outside_Reachable', 'Offline'),
  ],
  execute: () => {
    logger.info('outside sensor went offline');
    if (items.getItem('outsideReboots').state == 'NULL') {
      logger.debug('++++++++++++++++++++++Checking outsideRebbots is NULL?');
      items.getItem('outsideReboots').postUpdate('OFF');
    }
  },
});

rules.JSRule({
  name: 'outside sensor came online',
  description: 'outside sensor came online',
  triggers: [
    triggers.ItemStateUpdateTrigger('Outside_Reachable', 'Online'),
  ],
  execute: () => {
    logger.info('outside sensor came online');
  },
});
rules.JSRule({
  name: 'outside sensor temperature update',
  description: 'outside sensor temperature update',
  triggers: [
    triggers.ItemStateUpdateTrigger('Outside_Temperature'),
  ],
  execute: (event) => {
    logger.debug(`Outside sensor temperature update : ${event.receivedState} C`);
  },
});
