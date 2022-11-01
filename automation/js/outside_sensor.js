const {
  log, items, rules, actions, triggers,
} = require('openhab');
// const { myutils } = require('personal');

const logger = log('outside_sensor');

scriptLoaded = function () {
  logger.error('scriptLoaded init outside sensor stuff');
  // loadedDate = Date.now();
};

rules.JSRule({
  name: 'outside sensor went offlineZZ',
  description: 'outside sensor went offline',
  triggers: [
    triggers.ItemStateUpdateTrigger('Outside_Reachable', 'Offline'),
  ],
  execute: () => {
    logger.error('outside sensor went offline YY');
    // const { alerting } = require('personal');
    // alerting.sendInfo('outside sensor went offline');
    // alerting.sendAlert('Outside_Reachable gone Online');

    if (items.getItem('outsideReboots').state == 'NULL') {
      logger.error('++++++++++++++++++++++Checking outsideRebbots is NULL?');
      items.getItem('outsideReboots').postUpdate('OFF');
    }
    // items.getItem("outsideSensorPower").sendCommand("OFF");
  },
});

rules.JSRule({
  name: 'outside sensor came online',
  description: 'outside sensor came online',
  triggers: [
    triggers.ItemStateUpdateTrigger('Outside_Reachable', 'Online'),
  ],
  execute: () => {
    logger.error('outside sensor came online');
    // const { alerting } = require('personal');
    // alerting.sendInfo('outside sensor came online');
    // alerting.sendAlert('Outside_Reachable gone Online');
  },
});
rules.JSRule({
  name: 'outside sensor temperature update',
  description: 'outside sensor temperature update',
  triggers: [
    triggers.ItemStateUpdateTrigger('Outside_Temperature'),
  ],
  execute: (event) => {
    // logger.error('outside sensor temperature update');
    logger.error(`.....outside sensor temperature update : ${event.receivedState}`);
    // console.log(event);
    // const { alerting } = require('personal');
    // alerting.sendInfo('outside sensor came online');
    // alerting.sendAlert('Outside_Reachable gone Online');
  },
});
