const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { alerting } = require('openhab-my-utils');

var ruleUID = "tvs-on-off";

const logger = log(ruleUID);


let tStartup;

scriptLoaded = function scriptLoaded() {
  logger.info('scriptLoaded - System started - set all rooms TV startup settings');

  logger.info('startup- set Kodi_CT_Online_Status status ');
  const thingStatusInfo = actions.Things.getThingStatusInfo('kodi:kodi:4cc97fc0-c074-917d-e452-aed8219168eb');
  logger.info('Thing Kodi_CT_Online_Status status', thingStatusInfo.getStatus());

  if (thingStatusInfo.getStatus().toString() == 'ONLINE') {
    items.getItem('Kodi_CT_Online_Status').postUpdate('ONLINE');
  } else {
    items.getItem('Kodi_CT_Online_Status').postUpdate('OFFLINE');
  }

  if (!tStartup) {
    tStartup = actions.ScriptExecution.createTimer(time.toZDT((5 * 1000)), () => {
      tv_startup_tbody();
    });
  }
  actions.Voice.say('tvs now available');
};


// ==================Conservatory TV ON
let CT_TV_off_timer;

rules.JSRule({
  name: 'turn ON conservatory TV',
  description: 'turn ON conservatory TV',
  triggers: [
    triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers', 'OFF', 'ON'),
    triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers2', 'OFF', 'ON')
  ],
  execute: () => {
    // check if stereo already on - some stuff already on!
    // items.getItem('vCT_stereo').postUpdate('OFF'); // turn off stereo virt trigger button
    turnOnTV('bg_wifisocket_1_1_power', 'bg_wifisocket_1_2_power', 'Turning on conservatory TV'); // turn off power
    logger.info('Turning on CT - TV - kodi, amp, ir bridge');
    items.getItem('bg_wifisocket_1_2_power').sendCommand('ON'); // tv
    items.getItem('bg_wifisocket_1_1_power').sendCommand('ON'); // kodi pi,amp ir bridge hdmi audio extractor
    alerting.flashItemAlert('KT_light_1_Power',4,500);

    // if there is a request to turn off the tv in progress cancel it as we want it on!
    if (CT_TV_off_timer && CT_TV_off_timer.isActive()) {
      CT_TV_off_timer.cancel();
    }

    // Turn amp on from standby
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(20), () => {
      items.getItem('amplifier_IR_PowerOn').sendCommand('ON'); // IR code
      logger.info('STEREO - IR turn on amp from standby');
    });
    // turn to audio source Video1
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(30), () => {
      items.getItem('amplifier_IR_Video1').sendCommand('ON'); // IR code
      logger.info('STEREO - IR amp switch to amplifier_IR_Video1 source');
    });
  },
});
// ==================Conservatory TV OFF
rules.JSRule({
  name: 'turn OFF conservatory tv',
  description: 'turn OFF conservatory tv',
  triggers: [
    triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers', 'ON', 'OFF'),
    triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers2', 'ON', 'OFF')
  ],
  execute: () => {
    // actions.Voice.say('Turning OFF tv - kodi, amp, and bridges');
    turnOffTV('vCT_stereo', 'bg_wifisocket_1_1_power', 'Turning OFF conservatory TV');

    // myutils.toggleItem('KT_light_1_Power', 5, 1000, logger);

    logger.info('Turning OFF tv - kodi, amp, and bridges');
    items.getItem('Kodi_CT_systemcommand').sendCommand('Shutdown'); // shutdown CT Pi
    logger.info('sent command - shutdown kodi');
    items.getItem('amplifier_IR_PowerOff').sendCommand('ON');
    items.getItem('bg_wifisocket_1_2_power').sendCommand('OFF'); // tv
    alerting.flashItemAlert('KT_light_1_Power',4,500);

    logger.info('tv - turned OFF amp, and bridges');
    // if stereo off timer is not defined or completed, restart the stereo off timer
    if (!CT_TV_off_timer || !CT_TV_off_timer.isActive()) {
      CT_TV_off_timer = actions.ScriptExecution.createTimer(
        time.ZonedDateTime.now().plusSeconds(25),
        () => {
          items.getItem('bg_wifisocket_1_1_power').sendCommand('OFF'); // CT kodi, amp, ir bridge, hdmi audio extractor
          // items.getItem('bg_wifisocket_1_2_power').sendCommand('OFF'); //tv

          items.getItem('vCT_TVKodiSpeakers').postUpdate('OFF'); // turn off virt trigger
          logger.info('turned off kodi power');
        },
      );
    }
  },
});


function tv_startup_tbody() {
  // logger.error('tv_startup_tbody()');

  if (items.getItem('vFR_TVKodi').state === 'NULL') {
    items.getItem('vFR_TVKodi').postUpdate('OFF');
  }
  if (items.getItem('vBR_TVKodi').state === 'NULL') {
    items.getItem('vBR_TVKodi').postUpdate('OFF');
  }
  if (items.getItem('vCT_TVKodiSpeakers').state === 'NULL') {
    items.getItem('vCT_TVKodiSpeakers').postUpdate('OFF');
  }
  if (items.getItem('vAT_TVKodi').state === 'NULL') {
    items.getItem('vAT_TVKodi').postUpdate('OFF');
  }
}

// const alertTVItemName = 'KT_light_1_Power';
// const alertTVItemName = 'CT_FairyLights433Socket';


let tvPowerOffTimer;

function turnOnTV(onOffProxyItem, powerControlItem, message) {
  logger.info(`Turning on Pi Kodi and TV:${message}`);
  // actions.Voice.say(message);
  // alerting.flashItemAlert();
  // if off timer defined (someone tried to turn tv off), stop it so it dosent prevent powering ON
  if (!(tvPowerOffTimer === undefined)) {
    tvPowerOffTimer.cancel();// = undefined;
  }
  items.getItem(onOffProxyItem).postUpdate('ON');
  items.getItem(powerControlItem).sendCommand('ON');
}

function turnOffTV(onOffProxyItem, powerControlItem, message) {
  logger.info(`Turning off Pi Kodi and TV:${message}`);
  // actions.Voice.say(message);
  // alerting.flashItemAlert();

  items.getItem(onOffProxyItem).postUpdate('OFF');

  // if off timer undefined start for pi shutdown
  // if (!(tvPowerOffTimer === undefined)) {
  tvPowerOffTimer = actions.ScriptExecution.createTimer(
    time.ZonedDateTime.now().plusSeconds(30),
    () => {
      items.getItem(powerControlItem).sendCommand('OFF');
      //     t_brtvPowerOff = None
      // undefine the off timer
      // tvPowerOffTimer = undefined;
    },
  );
  // }
}
// ==================== turn ON bedroom Pi Kodi and TV
// let t_brtvPowerOff;
rules.JSRule({
  name: 'turn ON bedroom Pi Kodi and TV',
  description: 'turn ON bedroom Pi Kodi and TV',
  triggers: [triggers.ItemStateUpdateTrigger('vBR_TVKodi', 'ON')],
  execute: () => {
    logger.info('Turning on bedroom Pi Kodi and TV');
    const message = 'Turning on Bedroom TV';
    turnOnTV('shutdownKodiBedroomProxy', 'wifi_socket_3_power', message);
    alerting.flashItemAlert('KT_light_1_Power',4,500);

  },
});

// ==============Turn OFF bedroom Kodi-Pi, TV
rules.JSRule({
  name: 'Turn OFF bedroom Kodi-Pi, TV',
  description: 'Turn OFF bedroom Kodi-Pi, TV',
  triggers: [triggers.ItemStateUpdateTrigger('vBR_TVKodi', 'OFF')],
  execute: () => {
    logger.info('Turning off bedroom Pi Kodi and TV');
    turnOffTV('shutdownKodiBedroomProxy', 'wifi_socket_3_power', 'Turning off Bedroom TV');
    alerting.flashItemAlert('KT_light_1_Power',4,500);
  },
});


// ==================

rules.JSRule({
  name: 'Turn ON FrontRoom Kodi-Pi, TV',
  description: 'Turn ON FrontRoom Kodi-Pi, TV',
  triggers: [triggers.ItemStateUpdateTrigger('vFR_TVKodi', 'ON')],
  execute: () => {
    alerting.flashItemAlert('KT_light_1_Power',4,500);
    turnOnTV('shutdownKodiFrontRoomProxy', 'wifi_socket_2_power', 'Turning on FrontRoom TV');
  },
});

rules.JSRule({
  name: 'Turn OFF FrontRoom Kodi-Pi, TV',
  description: 'Turn OFF FrontRoom Kodi-Pi, TV',
  triggers: [triggers.ItemStateUpdateTrigger('vFR_TVKodi', 'OFF')],
  execute: () => {
    turnOffTV('shutdownKodiFrontRoomProxy', 'wifi_socket_2_power', 'Turning off FrontRoom TV');
    alerting.flashItemAlert('KT_light_1_Power',4,500);

  },
});

rules.JSRule({
  name: 'Turn ON Attic Kodi-Pi, TV',
  description: 'Turn ON Attic Kodi-Pi, TV',
  triggers: [triggers.ItemStateUpdateTrigger('vAT_TVKodi', 'ON')],
  execute: () => {
    turnOnTV('shutdownKodiAtticProxy', ' ', 'Turning on Attic TV');
    alerting.flashItemAlert('KT_light_1_Power',4,500);

  },
});

rules.JSRule({
  name: 'Turn OFF Attic Kodi-Pi, TV',
  description: 'Turn OFF Attic Kodi-Pi, TV',
  triggers: [triggers.ItemStateUpdateTrigger('vAT_TVKodi', 'OFF')],
  execute: () => {
    turnOffTV('shutdownKodiAtticProxy', ' ', 'Turning off Attic TV');
    alerting.flashItemAlert('KT_light_1_Power',4,500);

  },
});
