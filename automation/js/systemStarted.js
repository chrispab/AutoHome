const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('system_started');
const { timeUtils } = require('openhab_rules_tools');

scriptLoaded = function () {
  logger.warn('scriptLoaded -   init   system_started');
  items.getItem('Zone1Reachable').postUpdate('OFF');
  items.getItem('Zone3Reachable').postUpdate('OFF');
};
