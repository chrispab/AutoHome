// const {
//   log, items, rules, actions, time, triggers,
// } = require('openhab');

// const logger = log('pir04');

// scriptLoaded = function () {
//   logger.info('scriptLoaded - pir 04');
// };

// rules.JSRule({
//   name: 'sonoff PIR MONITOR',
//   description: 'monitor any sonoff PIR occupancy updates..v..',
//   triggers: [triggers.ItemStateUpdateTrigger('pir04_occupancy')],
//   execute: (data) => {
//     logger.debug(
//       `PIR sonoff MONITOR -  pir_occupancy04 received update itemName : ${data.itemName
//       }, state: ${items.getItem(data.itemName).state
//       }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
//     );
//   },
// });

// function pir04_off_body() {
//   logger.debug('===  pir04_off_body');
//   items.getItem('gDiningRoomAutoLights').sendCommand('OFF');
// }

// let pir04_off_timer = null;

// rules.JSRule({
//   name: 'pir04 updated with ON',
//   description: 'pir04  - Turn ON lights, cancel off timers  ',
//   triggers: [
//     triggers.ItemStateUpdateTrigger('pir04_occupancy', 'ON'),
//   ],
//   execute: (data) => {
//     logger.debug(
//       `-pir04_occupancy received update itemName : ${data.itemName
//       }, state: ${items.getItem(data.itemName).state
//       }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
//     );
//     logger.debug(`-BridgeLightSensorLevel: ${items.getItem('BridgeLightSensorLevel').rawState}`);
//     logger.debug(
//       `-ConservatoryLightTriggerLevel: ${items.getItem('ConservatoryLightTriggerLevel').rawState}`,
//     );
//     logger.debug(`-pir04_occupancy: ${items.getItem('pir04_occupancy').state}`);

//     if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('DR_Auto_Lighting_Trigger_SetPoint').rawState) {
//       logger.debug(`pir04_occupancy inner: ${items.getItem('pir04_occupancy').state}`);
//       if (items.getItem('pir04_occupancy').state === 'ON') {
//         items.getItem('gDiningRoomAutoLights').sendCommand('ON');

//         if (pir04_off_timer && pir04_off_timer.isActive()) {
//           pir04_off_timer.cancel();
//           logger.debug('-CANCEL STOP running pir04_off_timer');
//         }
//       }
//     }
//   },
// });

// rules.JSRule({
//   name: 'PIRsensor 04 ON to OFF - start the lights off timer',
//   description: 'PIRsensor start OFF lights timer',
//   triggers: [
//     triggers.ItemStateChangeTrigger('pir04_occupancy', 'ON', 'OFF'),
//   ],
//   execute: (data) => {
//     logger.debug(
//       `-pir04_occupancy received update itemName : ${data.itemName
//       }, state: ${items.getItem(data.itemName).state
//       }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
//     );
//     if (data.itemName === 'pir04_occupancy') {

//       const now = time.ZonedDateTime.now();
//       pir04_off_timer = actions.ScriptExecution.createTimer(
//         now.plusSeconds(items.getItem('KT_cupboard_lights_timeout').rawState),
//         pir04_off_body,
//       );
//       logger.debug('-pir04_occupancy: STARTING TIMER  OFF END');
//     }
//   },
// });
