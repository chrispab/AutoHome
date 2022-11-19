const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

const logger = log('TVs on off.js');

let tStartup;

// function tv_startup_tbody() {
//   // logger.error('tv_startup_tbody()');

//   if (items.getItem('vFR_TVKodi').state === 'NULL') {
//     items.getItem('vFR_TVKodi').postUpdate('OFF');
//   }
//   if (items.getItem('vBR_TVKodi').state === 'NULL') {
//     items.getItem('vBR_TVKodi').postUpdate('OFF');
//   }
//   if (items.getItem('vCT_TVKodiSpeakers').state === 'NULL') {
//     items.getItem('vCT_TVKodiSpeakers').postUpdate('OFF');
//   }
//   if (items.getItem('vAT_TVKodi').state === 'NULL') {
//     items.getItem('vAT_TVKodi').postUpdate('OFF');
//   }
// }

// scriptLoaded = function scriptLoaded() {
//   logger.warn('scriptLoaded - System started - set all rooms TV startup settings');

//   logger.warn('startup- set Kodi_CT_Online_Status status ');
//   const thingStatusInfo = actions.Things.getThingStatusInfo('kodi:kodi:4cc97fc0-c074-917d-e452-aed8219168eb');
//   logger.warn('Thing Kodi_CT_Online_Status status', thingStatusInfo.getStatus());

//   if (thingStatusInfo.getStatus().toString() == 'ONLINE') {
//     items.getItem('Kodi_CT_Online_Status').postUpdate('ONLINE');
//   } else {
//     items.getItem('Kodi_CT_Online_Status').postUpdate('OFFLINE');
//   }

//   if (!tStartup) {
//     tStartup = actions.ScriptExecution.createTimer(timeUtils.toDateTime((5 * 1000)), () => {
//       tv_startup_tbody();
//     });
//   }
// };

// let tvPowerOffTimer;

// function turnOnTV(onOffProxyItem, powerControlItem, message) {
//   logger.warn(`Turning on Pi Kodi and TV:${message}`);
//   actions.Voice.say(message);

//   // if off timer defined (someone tried to turn tv off), stop it so it dosent prevent powering ON
//   if (!(tvPowerOffTimer === undefined)) {
//     tvPowerOffTimer.cancel();// = undefined;
//   }
//   items.getItem(onOffProxyItem).postUpdate('ON');
//   items.getItem(powerControlItem).sendCommand('ON');
// }

// function turnOffTV(onOffProxyItem, powerControlItem, message) {
//   logger.warn(`Turning off Pi Kodi and TV:${message}`);
//   actions.Voice.say(message);

//   items.getItem(onOffProxyItem).postUpdate('OFF');

//   // if off timer undefined start for pi shutdown
//   // if (!(tvPowerOffTimer === undefined)) {
//   tvPowerOffTimer = actions.ScriptExecution.createTimer(
//     time.ZonedDateTime.now().plusSeconds(30),
//     () => {
//       items.getItem(powerControlItem).sendCommand('OFF');
//       //     t_brtvPowerOff = None
//       // undefine the off timer
//       // tvPowerOffTimer = undefined;
//     },
//   );
//   // }
// }
// ==================== contact01
// let t_brtvPowerOff;
rules.JSRule({
  name: 'CT contact01 went true',
  description: 'CT contact01 went true',
  triggers: [triggers.ItemStateChangeTrigger('zb_contact_01_contact', 'false', 'true')],
  execute: () => {
    logger.warn('CT contact01 went true');
    const message = 'Thanks else';
    actions.Voice.say(message);
    // turnOnTV('shutdownKodiBedroomProxy', 'wifi_socket_3_power', message);
  },
});
rules.JSRule({
  name: 'CT contact01 went fasle',
  description: 'CT contact01 went false',
  triggers: [triggers.ItemStateChangeTrigger('zb_contact_01_contact', 'true', 'false')],
  execute: () => {
    logger.warn('CT contact01 went false');
    const message = 'Hey Elsie, youve left the back door open. Please close it, or get a cuffing';
    actions.Voice.say(message);
    // turnOnTV('shutdownKodiBedroomProxy', 'wifi_socket_3_power', message);
  },
});
// ==============Turn OFF bedroom Kodi-Pi, TV
// rules.JSRule({
//   name: 'Turn OFF bedroom Kodi-Pi, TV',
//   description: 'Turn OFF bedroom Kodi-Pi, TV',
//   triggers: [triggers.ItemStateUpdateTrigger('vBR_TVKodi', 'OFF')],
//   execute: () => {
//     logger.warn('Turning off bedroom Pi Kodi and TV');
//     turnOffTV('shutdownKodiBedroomProxy', 'wifi_socket_3_power', 'Turning off Bedroom TV');
//   },
// });

// // ==================Conservatory TV ON
// let CT_TV_off_timer;

// rules.JSRule({
//   name: 'turn ON conservatory TV',
//   description: 'turn ON conservatory TV',
//   triggers: [triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers', 'OFF', 'ON'),
//   triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers2', 'OFF', 'ON')],
//   execute: () => {
//     // check if stereo already on - some stuff already on!
//     // items.getItem('vCT_stereo').postUpdate('OFF'); // turn off stereo virt trigger button
//     turnOnTV('bg_wifisocket_1_1_power', 'bg_wifisocket_1_2_power', 'Turning on conservatory TV'); // turn off power
//     logger.warn('Turning on CT - TV - kodi, amp, ir bridge');
//     items.getItem('bg_wifisocket_1_2_power').sendCommand('ON'); // tv
//     items.getItem('bg_wifisocket_1_1_power').sendCommand('ON'); // kodi pi,amp ir bridge hdmi audio extractor

//     // if there is a request to turn off the tv in progress cancel it as we want it on!
//     if (CT_TV_off_timer && CT_TV_off_timer.isActive()) {
//       CT_TV_off_timer.cancel();
//     }

//     // Turn amp on from standby
//     actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(20), () => {
//       items.getItem('amplifier_IR_PowerOn').sendCommand('ON'); // IR code
//       logger.warn('STEREO - IR turn on amp from standby');
//     });
//     // turn to audio source Video1
//     actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(30), () => {
//       items.getItem('amplifier_IR_Video1').sendCommand('ON'); // IR code
//       logger.warn('STEREO - IR amp switch to amplifier_IR_Video1 source');
//     });
//   },
// });
// // ==================Conservatory TV OFF
// rules.JSRule({
//   name: 'turn OFF conservatory tv',
//   description: 'turn OFF conservatory tv',
//   triggers: [triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers', 'ON', 'OFF'),
//   triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers2', 'ON', 'OFF')],
//   execute: () => {
//     // actions.Voice.say('Turning OFF tv - kodi, amp, and bridges');
//     turnOffTV('vCT_stereo', 'bg_wifisocket_1_1_power', 'Turning OFF conservatory TV');

//     logger.warn('Turning OFF tv - kodi, amp, and bridges');
//     items.getItem('Kodi_CT_SendSystemCommand').sendCommand('Shutdown'); // shutdown CT Pi
//     logger.warn('sent command - shutdown kodi');
//     items.getItem('amplifier_IR_PowerOff').sendCommand('ON');
//     items.getItem('bg_wifisocket_1_2_power').sendCommand('OFF'); // tv

//     logger.warn('tv - turned OFF amp, and bridges');
//     // if stereo off timer is not defined or completed, restart the stereo off timer
//     if (!CT_TV_off_timer || !CT_TV_off_timer.isActive()) {
//       CT_TV_off_timer = actions.ScriptExecution.createTimer(
//         time.ZonedDateTime.now().plusSeconds(25),
//         () => {
//           items.getItem('bg_wifisocket_1_1_power').sendCommand('OFF'); // CT kodi, amp, ir bridge, hdmi audio extractor
//           // items.getItem('bg_wifisocket_1_2_power').sendCommand('OFF'); //tv

//           items.getItem('vCT_TVKodiSpeakers').postUpdate('OFF'); // turn off virt trigger
//           logger.warn('turned off kodi power');
//         },
//       );
//     }
//   },
// });

// let t_frtvPowerOff;
// // ==================

// rules.JSRule({
//   name: 'Turn ON FrontRoom Kodi-Pi, TV',
//   description: 'Turn ON FrontRoom Kodi-Pi, TV',
//   triggers: [triggers.ItemStateUpdateTrigger('vFR_TVKodi', 'ON')],
//   execute: () => {
//     turnOnTV('shutdownKodiFrontRoomProxy', 'wifi_socket_2_power', 'Turning on FrontRoom TV');
//   },
// });

// rules.JSRule({
//   name: 'Turn OFF FrontRoom Kodi-Pi, TV',
//   description: 'Turn OFF FrontRoom Kodi-Pi, TV',
//   triggers: [triggers.ItemStateUpdateTrigger('vFR_TVKodi', 'OFF')],
//   execute: () => {
//     turnOffTV('shutdownKodiFrontRoomProxy', 'wifi_socket_2_power', 'Turning off FrontRoom TV');
//   },
// });

// rules.JSRule({
//   name: 'Turn ON Attic Kodi-Pi, TV',
//   description: 'Turn ON Attic Kodi-Pi, TV',
//   triggers: [triggers.ItemStateUpdateTrigger('vAT_TVKodi', 'ON')],
//   execute: () => {
//     turnOnTV('shutdownKodiAtticProxy', ' ', 'Turning on Attic TV');
//   },
// });

// rules.JSRule({
//   name: 'Turn OFF Attic Kodi-Pi, TV',
//   description: 'Turn OFF Attic Kodi-Pi, TV',
//   triggers: [triggers.ItemStateUpdateTrigger('vAT_TVKodi', 'OFF')],
//   execute: () => {
//     turnOffTV('shutdownKodiAtticProxy', ' ', 'Turning off Attic TV');
//   },
// });