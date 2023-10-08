const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

const logger = log('ir-button');

// scriptLoaded = function () {
//   logger.warn('scriptLoaded - pir1_2');
//   // loadedDate = Date.now();
// };


let irBtn_off_timer = null;
rules.JSRule({
  name: 'IR button pressed - ON',
  description: 'IR button pressed - ON',
  triggers: [
    triggers.GroupStateChangeTrigger('gIRRemoteButtons', 'OFF', 'ON')
  ],
  execute: (event) => {


    logger.info(`IR button pressed - ON: ${event.itemName}`);

  },
});
