const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('zb_PIR_SENSORS_Availability.js');
const { timeUtils } = require('openhab_rules_tools');

// # https://community.openhab.org/t/design-pattern-motion-sensor-timer/14954

const timeoutMinutes = 45;

scriptLoaded = function () {
  logger.warn('scriptLoaded -   zb_PIR_SENSORS_Availability');

  items.getItem('gZbPIRSensorsReachable').members.forEach((item) => {
    item.postUpdate('OFF');
  });

items.getItem('gBatteries').members.forEach((item) => {
  item.postUpdate(0);
});

};







// const timers = {};// [];
// const timeoutSeconds = 60; // use an appropriate value

// rules.JSRule({
//   name: 'monitor ZB  temp sensor availability update zb sockets Online/Offline status',
//   description: 'monitor ZB  temp sensor availability update zb sockets Online/Offline status',
//   triggers: [triggers.GroupStateUpdateTrigger('gTHSensorTemperatures')],
//   execute: (event) => {
//     logger.warn(`update gTHSensorTemperatures Online/Offline status, triggering item name: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
//     myutils.showGroupMembers('gTHSensorTemperatures');

//     const stub = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
//     const itemNameReachable = `${stub}_reachable`;
//     logger.warn(`get id part of item reachable: ${stub} `);

//     items.getItem(itemNameReachable).postUpdate('ON');
//     // console.warn(`--- BG sockets Online/Offline status marked  Online : ${itemNameReachable} `);

//     if (timers.hasOwnProperty(itemNameReachable)) {
//       // console.warn(`***--- itemNameReachable FOUND property/key in timers array: ${itemNameReachable} `);
//       // console.warn(`**--- FOUND property/key in timers array, RESTART THE TIMER: ${itemNameReachable} `, timers[itemNameReachable]);

//       if (timers[itemNameReachable].hasTerminated()) { // RESTART timer
//         // console.warn(`!!!!!!!---timer has terminated, Lets recreate it: ${itemNameReachable} `, timers[itemNameReachable]);
//       }
//       // NOT YET terminated STILL RUNNING...
//       timers[itemNameReachable].reschedule(time.toZDT((timeoutMinutes * 60 * 1000)), // , () => {
//       );
//     } else { // dosent exists so create a new one  actions.ScriptExecution.createTimer
//       timers[itemNameReachable] = actions.ScriptExecution.createTimer(time.toZDT((timeoutMinutes * 60 * 1000)), () => {
//         items.getItem(itemNameReachable).postUpdate('OFF');// ???OFF???
//         // console.warn(`!! TIMER HAS ENDED,POSTED OFFLINE: ${itemNameReachable} `, timers[itemNameReachable]);
//       });
//       // console.warn(`**--- timer started CREATED NEW: ${itemNameReachable} `, timers[itemNameReachable]);
//     }
//   },
// });
