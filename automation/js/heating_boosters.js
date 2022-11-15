const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

const logger = log('boost ct');

let tStartup;

let tvPowerOffTimer;

let CT_boost_timer;

// rules.JSRule({
//   name: 'boost ct',
//   description: 'boost ct',
//   triggers: [triggers.ItemStateChangeTrigger('CT_Boost', 'OFF', 'ON'),
//   ],
//   execute: () => {
//     actions.Voice.say('BOOST ON');
//     logger.warn('BOOST ON');
//     if (!CT_boost_timer || !CT_boost_timer.isActive()) {
//       CT_boost_timer = actions.ScriptExecution.createTimer(
//         time.ZonedDateTime.now().plusSeconds(5),
//         () => {
//           items.getItem('CT_Boost').sendCommand('OFF'); // tv
//           logger.warn('BOOST OFF');
//           actions.Voice.say('BOOST OFF');
//         },
//       );
//     }
//   },
// });
