// const {
//   log, items, rules, actions, triggers,
// } = require('openhab');

// const logger = log('logreader:reader:bbbopenhabcloud:newCustomEvent');
// // const { timeUtils } = require('openhab_rules_tools');


// const previousLightSensorLevel = null;
// const Cloud_Test_Timer = null;

// scriptLoaded = function () {
//   logger.error('scriptLoaded - logreadernewCustomEvent');
//   alerting.sendInfo('scriptLoadedx;;.........');
// };

// rules.JSRule({
//   name: 'logreader:reader:openhabcloud:newCustomEvent',
//   description: 'logreader:reader:openhabcloud:newCustomEvent',
//   triggers: [triggers.ChannelEventTrigger('logreader:reader:openhabcloud:newCustomEvent')],
//   execute: () => {
//     logger.error('triggered   logreader:reader:openhabcloud:newCustomEventt');

//     alerting.sendInfo('logreader:reader============,,,======');

//     // Cancel any running timers. This is in case you have multiple disconnections/reconnections in a short time frame.

//     if (Cloud_Test_Timer && Cloud_Test_Timer.isActive()) {
//       Cloud_Test_Timer.cancel();
//     }

//     alerting.sendInfo('myopenHAB_Connection reconnected');

//     items.getItem('myopenHAB_Connection_Success').postUpdate(items.getItem('myopenHAB_Connection_Success').rawState + 1);

//   },
// });
