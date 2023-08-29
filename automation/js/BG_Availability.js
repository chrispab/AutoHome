const {
  log, items, rules, actions,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('BG_Availability');

scriptLoaded = function () {
  // const { items } = require('@runtime');#
  // console.log(items);
  logger.warn('scriptLoaded -   init   BG avail statusesss');
  // myutils.showGroupMembers('gBG_sockets_reachable');

  items.getItem('gBG_sockets_reachable').members.forEach((item) => {
    // whatitis = `${whatitis + batt.label}: ${batt.state}\r\n`;
    item.postUpdate('Offline');
  });

  // myutils.showGroupMembers('gBG_sockets_reachable');
};

const timers = {};// [];
const timeoutSeconds = 60; // use an appropriate value
const { timeUtils } = require('openhab_rules_tools');

rules.JSRule({
  name: 'update BG sockets Online/Offline status',
  description: 'monitor BG MQTT updates',
  triggers: [triggers.GroupStateUpdateTrigger('gBG_socket_maxworktime_updates')],
  execute: (event) => {
    // console.warn(`update BG sockets Online/Offline status, triggering item name: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
    // myutils.showGroupMembers('gBG_socket_maxworktime_updates');

    const stub = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    const itemNameReachable = `${stub}_reachable`;
    // console.warn(`get id part of item reachable: ${stub} `);

    items.getItem(itemNameReachable).postUpdate('Online');
    // console.warn(`--- BG sockets Online/Offline status marked  Online : ${itemNameReachable} `);

    if (timers.hasOwnProperty(itemNameReachable)) {
      // console.warn(`***--- itemNameReachable FOUND property/key in timers array: ${itemNameReachable} `);
      // console.warn(`**--- FOUND property/key in timers array, RESTART THE TIMER: ${itemNameReachable} `, timers[itemNameReachable]);

      if (timers[itemNameReachable].hasTerminated()) { // RESTART timer
        // console.warn(`!!!!!!!---timer has terminated, Lets recreate it: ${itemNameReachable} `, timers[itemNameReachable]);
      }
      // NOT YET terminated STILL RUNNING...
      timers[itemNameReachable].reschedule(timeUtils.toDateTime((timeoutSeconds * 1000)), // , () => {
      );
    } else { // dosent exists so create a new one  actions.ScriptExecution.createTimer
      timers[itemNameReachable] = actions.ScriptExecution.createTimer(timeUtils.toDateTime((timeoutSeconds * 1000)), () => {
        items.getItem(itemNameReachable).postUpdate('Offline');
        // console.warn(`!! TIMER HAS ENDED,POSTED OFFLINE: ${itemNameReachable} `, timers[itemNameReachable]);
      });
      // console.warn(`**--- timer started CREATED NEW: ${itemNameReachable} `, timers[itemNameReachable]);
    }
  },
});
