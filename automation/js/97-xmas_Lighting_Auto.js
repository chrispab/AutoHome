const {
  log, items, rules, actions, triggers,
} = require('openhab');

const ruleUID = 'xmas-auto-lights';
const logger = log(ruleUID);

const { alerting } = require('openhab-my-utils');

let previousLightSensorLevel = null;
let currentLightSensorLevel = null;

// when script reloaded, set auto detection lighting to suitable defaults
scriptLoaded = function () {
  logger.debug('scriptLoaded - xmas auto lighting items');
  actions.Voice.say('Xmas auto lighting starting');

  previousLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;
  currentLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;
  items.getItem('BridgeLightSensorTrend').sendCommand('ON'); //
  items.getItem('outside_xmas_lights_tasmo_wifi_socket_9_power').sendCommand('OFF'); // its light in conservatory
};

// turn off outdoor xmas lights when it goes from dark to light
// rules.JSRule({
//   name: 'auto turn OFF outdoor lights when goes from dark to light',
//   description: 'turn OFF outdoor lights when ambient light level when goes from dark to light',
//   triggers: [triggers.ItemStateChangeTrigger('CT_LightDark_State', 'OFF', 'ON')],
//   execute: () => {
//     logger.debug('turn OFF outdoor xmas lights when ambient light level when goes from dark to light');
//     items.getItem('outside_xmas_lights_tasmo_wifi_socket_9_power').sendCommand('OFF');
//     // items.getItem('gColourBulbs').sendCommand('OFF');
//     alerting.sendEmail(
//       'Outdoor xmas lights auto turn OFF',
//       'turn OFF outdoor xmas lights when ambient light level when goes from dark to light',
//     );
//   },
// });

// turn ON outdoor xmas lights when it goes from light to dark if gAll_Christmas_Lights is ON
// rules.JSRule({
//   name: 'auto turn ON outdoor xmas lights when when goes from light to dark and gAll_Christmas_Lights is ON',
//   description: 'turn ON outdoor xmas lights when ambient light level goes from light to dark and gAll_Christmas_Lights is ON',
//   triggers: [triggers.ItemStateChangeTrigger('CT_LightDark_State', 'ON', 'OFF')],
//   execute: () => {
//     if (items.getItem('gAll_Christmas_Lights').state === 'ON') {
//       logger.debug('turn ON outdoor xmas lights when ambient light level goes from light to dark and gAll_Christmas_Lights is ON');
//       items.getItem('outside_xmas_lights_tasmo_wifi_socket_9_power').sendCommand('ON');
//       alerting.sendEmail(
//         'Outdoor xmas lights auto turn ON',
//         'auto turn ON outdoor xmas lights when ambient light level goes from light to dark and gAll_Christmas_Lights is ON',
//       );
//     } else {
//       logger.debug('NOT turning ON outdoor xmas lights as gAll_Christmas_Lights is OFF');
//     }
//   },
// });

// when gAll_Christmas_Lights is turned on, if dark then turn on outdoor xmas lights
// rules.JSRule({
//   name: 'auto turn ON outdoor xmas lights when gAll_Christmas_Lights turns ON and it is dark',
//   description: 'turn ON outdoor xmas lights when gAll_Christmas_Lights turns ON and it is dark',
//   triggers: [triggers.ItemStateChangeTrigger('gAll_Christmas_Lights', 'OFF', 'ON')],
//   execute: () => {
//     if (items.getItem('CT_LightDark_State').state === 'OFF') {
//       logger.debug('turn ON outdoor xmas lights when gAll_Christmas_Lights turns ON and it is dark');
//       items.getItem('outside_xmas_lights_tasmo_wifi_socket_9_power').sendCommand('ON');
//       alerting.sendEmail(
//         'Outdoor xmas lights auto turn ON',
//         'auto turn ON outdoor xmas lights when gAll_Christmas_Lights turns ON and it is dark',
//       );
//     }
//   },
// });

// while gAll_Christmas_Lights is ON, if dark then turn on outdoor xmas lights else turn off
// rules.JSRule({
//   name: 'monitor gAll_Christmas_Lights and CT_LightDark_State to control outdoor xmas lights',
//   description: 'while gAll_Christmas_Lights is ON, if dark then turn on outdoor xmas lights else turn off',
//   triggers: [
//     triggers.ItemStateChangeTrigger('gAll_Christmas_Lights', 'ON', 'OFF'),
//     triggers.ItemStateChangeTrigger('CT_LightDark_State', 'ON', 'OFF'),
//   ],
//   execute: () => {
//     if (items.getItem('gAll_Christmas_Lights').state === 'ON') {
//       if (items.getItem('CT_LightDark_State').state === 'OFF') {
//         logger.debug('turn ON outdoor xmas lights as gAll_Christmas_Lights is ON and it is dark');
//         items.getItem('outside_xmas_lights_tasmo_wifi_socket_9_power').sendCommand('ON');
//       } else {
//         logger.debug('turn OFF outdoor xmas lights as gAll_Christmas_Lights is ON and it is light');
//         items.getItem('outside_xmas_lights_tasmo_wifi_socket_9_power').sendCommand('OFF');
//       }
//     } else {
//       logger.debug('turn OFF outdoor xmas lights as gAll_Christmas_Lights is OFF');
//       items.getItem('outside_xmas_lights_tasmo_wifi_socket_9_power').sendCommand('OFF');
//     }
//   },
// });
