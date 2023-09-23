const {
  log, items, rules, actions,
} = require('openhab');
const { myutils } = require('personal');


var ruleUID = "bg_avail";
const logger = log(ruleUID);
const { timeUtils } = require('openhab_rules_tools');

scriptLoaded = function () {

  logger.warn('scriptLoaded -   init   BG avail statusesss');
  // myutils.showGroupMembers('gBG_sockets_reachable');

  items.getItem('gBG_sockets_reachable').members.forEach((item) => {
    item.postUpdate('Offline');
  });

};

const timers = {};// [];
const timeoutSeconds = 60; // use an appropriate value
const { timeUtils } = require('openhab_rules_tools');

rules.JSRule({
  name: 'update BG sockets Online/Offline status',
  description: 'monitor BG MQTT updates',
  triggers: [triggers.GroupStateUpdateTrigger('gBG_socket_maxworktime_updates')],
  execute: (event) => {
   // myutils.showGroupMembers('gBG_socket_maxworktime_updates');
    const stub = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    const itemNameReachable = `${stub}_reachable`;

    items.getItem(itemNameReachable).postUpdate('Online');

    if (timers.hasOwnProperty(itemNameReachable)) {

      if (timers[itemNameReachable].hasTerminated()) { // RESTART timer
        // console.warn(`!!!!!!!---timer has terminated, Lets recreate it: ${itemNameReachable} `, timers[itemNameReachable]);
      }
      // NOT YET terminated STILL RUNNING...
      timers[itemNameReachable].reschedule(time.toZDT((timeoutSeconds * 1000)), // , () => {
      );
    } else { // dosent exists so create a new one  actions.ScriptExecution.createTimer
      timers[itemNameReachable] = actions.ScriptExecution.createTimer(time.toZDT((timeoutSeconds * 1000)), () => {
        items.getItem(itemNameReachable).postUpdate('Offline');
      });
    }
  },
});
