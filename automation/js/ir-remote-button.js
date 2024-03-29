const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

const logger = log('ir-button');

// scriptLoaded = function () {
//   logger.warn('scriptLoaded - pir1_2');
//   // loadedDate = Date.now();
// };

// function pir1_off_body() {
//   logger.warn('===The timer is over.pir1_off_body');
//   items.getItem('KT_light_1_Power').sendCommand('OFF');
// }
// function pir2_off_body() {
//   logger.warn('===The timer is over.pir2_off_body');
//   items.getItem('KT_light_2_Power').sendCommand('OFF');
//   items.getItem('KT_light_3_Power').sendCommand('OFF');
// }

let irBtn_off_timer = null;
// let pir02_off_timer = null;
rules.JSRule({
  name: 'IR button pressed - ON',
  description: 'IR button pressed - ON',
  triggers: [
    triggers.GroupStateChangeTrigger('gIRRemoteButtons', 'OFF', 'ON')
    // triggers.ItemStateUpdateTrigger('pir02_occupancy', 'ON'),
  ],
  execute: (event) => {
    // logger.debug(
    //   `-pir_occupancy received update itemName : ${data.itemName
    //   }, state: ${items.getItem(data.itemName).state
    //   }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
    // );
    // logger.debug(`IR button pressed - ON: ${items.getItem(data.).rawState}`);

    logger.error(`IR button pressed - ON: ${event.itemName}`);
    // logger.debug(
    //   `-ConservatoryLightTriggerLevel: ${items.getItem('ConservatoryLightTriggerLevel').rawState}`,
    // );
    // logger.debug(`-pir01_occupancy: ${items.getItem('pir01_occupancy').state}`);

    // if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
    //   logger.debug(`pir01_occupancy inner: ${items.getItem('pir01_occupancy').state}`);
    // if (items.getItem('pir01_occupancy').state === 'ON') {
    //   items.getItem('KT_light_1_Power').sendCommand('ON');
    //   logger.warn('-rxed pir01_occupancy KT_light_1_Power ON');
    //   // cancrl the off timer if running
    //   if (pir01_off_timer && pir01_off_timer.isActive()) {
    //     pir01_off_timer.cancel();
    //     logger.warn('-CANCEL STOP running pir01_off_timer');
    //   }

    // }

    // if (items.getItem('pir02_occupancy').state === 'ON') {
    //   items.getItem('KT_light_2_Power').sendCommand('ON');
    //   items.getItem('KT_light_3_Power').sendCommand('ON');
    //   logger.warn('-rxed pir02_occupancy KT_light_2 3_Power ON');
    //   if (pir02_off_timer && pir02_off_timer.isActive()) {
    //     pir02_off_timer.cancel();
    //     logger.warn('-CANCEL STOP running pir02_off_timer');
    //   }
    // }
    // }
    // logger.warn('pir01_occupancy: end');
  },
});

// rules.JSRule({
//   name: 'PIRsensor ON to OFF - start the lights off timer',
//   description: 'PIRsensor start OFF lights timer',
//   triggers: [
//     triggers.ItemStateChangeTrigger('pir01_occupancy', 'ON', 'OFF'),
//     triggers.ItemStateChangeTrigger('pir02_occupancy', 'ON', 'OFF'),
//   ],
//   execute: (data) => {
//     logger.debug(
//       `-pir_occupancy received update itemName : ${data.itemName
//       }, state: ${items.getItem(data.itemName).state
//       }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
//     );

//     logger.warn(
//       `${data.itemName}: STARTING off TIMER , off time is: ${items.getItem('KT_cupboard_lights_timeout').state.toString()}`,
//     );
//     if (data.itemName === 'pir01_occupancy') {
//       // logger.warn(
//       //   `-pir01_occupancy: STARTING TIMER KT_light_1_Power: OFF, off time is: ${items.getItem('KT_cupboard_lights_timeout').state.toString()}`,
//       // );
//       const now = time.ZonedDateTime.now();
//       pir01_off_timer = actions.ScriptExecution.createTimer(
//         now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
//         pir1_off_body,
//       );
//       // logger.warn('-pir01_occupancy: STARTING TIMER KT_light_1_Power: OFF END');
//     }
//     if (data.itemName === 'pir02_occupancy') {
//       // logger.warn(
//       //   `-STARTING TIMER KT_light_2&3_Power : OFF, off timer is: ${items.getItem('KT_cupboard_lights_timeout').state}`,
//       // );
//       const now = time.ZonedDateTime.now();
//       pir02_off_timer = actions.ScriptExecution.createTimer(
//         now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
//         pir2_off_body,
//       );
//       // logger.warn('-pir02_occupancy: STARTING TIMER KT_light_2&3_Power: OFF END');
//     }
//   },
// });
