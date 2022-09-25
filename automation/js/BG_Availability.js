// from core.rules import rule
// from core.triggers import when
// from core.actions import LogAction
// from core.actions import ScriptExecution
// from java.time import ZonedDateTime as DateTime

// # https://community.openhab.org/t/design-pattern-motion-sensor-timer/14954
// timers = {}
// timeoutSeconds = 31  # use an appropriate value

// @rule("init BG avail status", description="zb temp sensors init", tags=["heating"])
// @when("System started")
// def init_BG_status(event):
//     init_BG_status.log.debug("init_BG_status")
//     for item in ir.getItem("gBG_sockets_reachable").members:
//         events.postUpdate(item, "Offline")

// const { time, items } = require('openhab-js');
const {
  log, items, rules, actions,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('BG_Availability.js');

scriptLoaded = function () {
  // const { items } = require('@runtime');#
  console.log(items);
  logger.warn('scriptLoaded -   init   BG avail statusesss');
  myutils.showGroupMembers('gBG_sockets_reachable');

  items.getItem('gBG_sockets_reachable').members.forEach((item) => {
    // whatitis = `${whatitis + batt.label}: ${batt.state}\r\n`;
    item.postUpdate('Offline');
  });

  myutils.showGroupMembers('gBG_sockets_reachable');
};

// # when a BG socket MQTT 'maxworktime' update comes in from device - updates frequency determined by broadlink2mqtt
// # use maxworktime as the value to monitor as using a pwr state may also come from rule updates etc and be a false presence
// @rule("update BG sockets Online/Offline status", description="monitor BG MQTT updates", tags=["BG"])
// @when("Member of gBG_socket_maxworktime_updates received update")
// def bgAvail(event):
//    ## # LogAction.logDebug("gBG_socket_maxworktime_updates", "!!!! gBG_socket_maxworktime_updates  Item {} received  update: {}", event.itemName, event.itemState)

//     # bgAvail.log.debug("!!!!bbb gBG_socket_maxworktime_updates  Item " + event.itemName + "received  update: " + event.itemState.toString())
//     # create the 'reachable' item name e.g bg_wifisocket_4_maxworktime to bg_wifisocket_4_reachable
//     item_name_reachable = event.itemName[:event.itemName.rfind('_')+1] + "reachable"
//     events.postUpdate(item_name_reachable, "Online")  # use reachable not triggering event cos its temp
//     # bgAvail.log.debug("== BG sockets Online/Offline status marked  ONLINE::")

//     if event.itemName not in timers or timers[event.itemName].hasTerminated():
//         timers[event.itemName] = ScriptExecution.createTimer(DateTime.now().plusSeconds(timeoutSeconds), lambda: events.postUpdate(item_name_reachable, "Offline"))
//     else:
//         timers[event.itemName].reschedule(DateTime.now().plusSeconds(timeoutSeconds))
const timers = {};// [];
const timeoutSeconds = 60; // use an appropriate value
const { timeUtils } = require('openhab_rules_tools');

rules.JSRule({
  name: 'update BG sockets Online/Offline status',
  description: 'monitor BG MQTT updates',
  triggers: [triggers.GroupStateUpdateTrigger('gBG_socket_maxworktime_updates')],
  execute: (event) => {
    console.warn(`update BG sockets Online/Offline status, triggering item name: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
    myutils.showGroupMembers('gBG_socket_maxworktime_updates');

    //     # bgAvail.log.debug("!!!!bbb gBG_socket_maxworktime_updates  Item " + event.itemName + "received  update: " + event.itemState.toString())
    //     # create the 'reachable' item name e.g bg_wifisocket_4_maxworktime to bg_wifisocket_4_reachable
    //     item_name_reachable = event.itemName[:event.itemName.rfind('_')+1] + "reachable"
    const stub = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    const itemNameReachable = `${stub}_reachable`;
    console.warn(`get id part of item reachable: ${stub} `);

    items.getItem(itemNameReachable).postUpdate('Online');
    console.warn(`--- BG sockets Online/Offline status marked  Online : ${itemNameReachable} `);
    //     if event.itemName not in timers or timers[event.itemName].hasTerminated():
    // if (timers.some((obj) => itemNameReachable in obj)) {
    // if (timers.some((obj) => obj.itemNameReachable == itemNameReachable)) {
    if (timers.hasOwnProperty(itemNameReachable)) {
      // console.warn(`***--- itemNameReachable FOUND property/key in timers array: ${itemNameReachable} `);
      console.warn(`**--- FOUND property/key in timers array, RESTART THE TIMER: ${itemNameReachable} `, timers[itemNameReachable]);

      if (timers[itemNameReachable].hasTerminated()) { // RESTART timer
        console.warn(`!!!!!!!---timer has terminated, Lets recreate it: ${itemNameReachable} `, timers[itemNameReachable]);
        // timers[itemNameReachable] = setTimeout(() => { items.getItem(itemNameReachable).postUpdate('Offline'); }, (timeoutSeconds * 1000));
      }
      // NOT YET terminated STILL RUNNING...
      // timers[event.itemName].reschedule(DateTime.now().plusSeconds(timeoutSeconds))
      timers[itemNameReachable].reschedule(timeUtils.toDateTime((timeoutSeconds * 1000)), // , () => {
        // items.getItem(itemNameReachable).postUpdate('Offline');
        // console.warn(`!! TIMER HAS ENDED,POSTED OFFLINE: ${itemNameReachable} `, timers[itemNameReachable]);
        // }
      );
    } else { // dosent exists so create a new one  actions.ScriptExecution.createTimer
      // timers[itemNameReachable] = setTimeout(() => { items.getItem(itemNameReachable).postUpdate('Offline'); }, (timeoutSeconds * 1000));
      timers[itemNameReachable] = actions.ScriptExecution.createTimer(timeUtils.toDateTime((timeoutSeconds * 1000)), () => {
        items.getItem(itemNameReachable).postUpdate('Offline');
        console.warn(`!! TIMER HAS ENDED,POSTED OFFLINE: ${itemNameReachable} `, timers[itemNameReachable]);
      });
      console.warn(`**--- timer started CREATED NEW: ${itemNameReachable} `, timers[itemNameReachable]);
    }
  },
});
