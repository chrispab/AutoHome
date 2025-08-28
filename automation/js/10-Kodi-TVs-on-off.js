/* eslint-disable no-use-before-define */
const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { alerting } = require('openhab-my-utils');

const ruleUID = 'tvs-on-off';

const logger = log(ruleUID);

// --- Centralized TV Configuration ---
const tvConfig = {
  conservatory: {
    name: 'Conservatory',
    tvSwitch: 'vCT_TVKodiSpeakers',
    tvSwitch2: 'vCT_TVKodiSpeakers2',
    tvSwitch_ikea_remote: 'zb_remote01_action',
    kodiPower: 'bg_wifisocket_1_1_power',
    tvPower: 'bg_wifisocket_1_2_power',
    ampPowerOn: 'amplifier_IR_PowerOn',
    ampPowerOff: 'amplifier_IR_PowerOff',
    ampInputVideo1: 'amplifier_IR_Video1',
    kodiSystemCommand: 'Kodi_CT_systemcommand',
    kodiOnlineStatus: 'Kodi_CT_Online_Status',
    tvStandby: 'CT_LGWebOS_TV_Power',
    flashItem: 'KT_light_1_Power',
    flashCount: 2,
  },
  bedroom: {
    name: 'Bedroom',
    tvSwitch: 'vBR_TVKodi',
    kodiPower: 'wifi_socket_3_power',
    tvPower: 'wifi_socket_3_power',
    kodiShutdownProxy: 'shutdownKodiBedroomProxy',
    flashItem: 'KT_light_1_Power',
    flashCount: 2,
  },
  frontroom: {
    name: 'Front Room',
    tvSwitch: 'vFR_TVKodi',
    kodiPower: 'wifi_socket_2_power',
    tvPower: 'wifi_socket_2_power',
    kodiShutdownProxy: 'shutdownKodiFrontRoomProxy',
    flashItem: 'KT_light_1_Power',
    flashCount: 2,
  },
  attic: {
    name: 'Attic',
    tvSwitch: 'vAT_TVKodi',
    tvPower: 'wifi_socket_4_power',
    kodiShutdownProxy: 'shutdownKodiAtticProxy',
    flashItem: 'KT_light_1_Power',
    flashCount: 2,
  },
};

let tStartup;

scriptLoaded = function scriptLoaded() {
  logger.info('scriptLoaded - System started - set all rooms TV startup settings');

  logger.info('startup- set Kodi_CT_Online_Status status ');
  const thingStatusInfo = actions.Things.getThingStatusInfo('kodi:kodi:4cc97fc0-c074-917d-e452-aed8219168eb');
  logger.info('Thing Kodi_CT_Online_Status status', thingStatusInfo.getStatus());

  if (thingStatusInfo.getStatus().toString() === 'ONLINE') {
    items.getItem(tvConfig.conservatory.kodiOnlineStatus).postUpdate('ONLINE');
  } else {
    items.getItem(tvConfig.conservatory.kodiOnlineStatus).postUpdate('OFFLINE');
  }

  if (!tStartup) {
    tStartup = actions.ScriptExecution.createTimer(time.toZDT(5 * 1000), () => {
      tv_startup_tbody();
    });
  }
  // actions.Voice.say('tvs now available');
};

function tv_startup_tbody() {
  Object.keys(tvConfig).forEach((roomName) => {
    const room = tvConfig[roomName];
    if (room.tvSwitch) {
      if (items.getItem(room.tvSwitch).state === 'NULL') {
        items.getItem(room.tvSwitch).postUpdate('OFF');
      }
    }
  });
}

let tvPowerOffTimer;

/**
 * Turns on the TV and associated devices based on the configuration.
 *
 * @param {string} roomName - The name of the room (key in tvConfig).
 * @param {string} message - The message to be logged.
 */
function turnOnTV(roomName, message) {
  logger.info(`Turn on ${roomName} TV: ${message}`);
  const room = tvConfig[roomName];

  if (!room) {
    logger.error(`Room configuration not found: ${roomName}`);
    return;
  }
  // if off timer defined (someone tried to turn tv off), stop it so it dosent prevent powering ON
  if (!(tvPowerOffTimer === undefined)) {
    tvPowerOffTimer.cancel(); // = undefined;
  }
  if (room.kodiPower) {
    items.getItem(room.kodiPower).sendCommand('ON');
  }
  if (room.tvPower) {
    items.getItem(room.tvPower).sendCommand('ON');
  }

  if (room.flashItem) {
    alerting.flashItemAlert(room.flashItem, room.flashCount, 500);
  }

  // if (room.tv)

  // Conservatory-specific actions

  if (roomName === 'conservatory') {
  // Turn amp on from standby, once ir device is on
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(15), () => {
      items.getItem(room.ampPowerOn).sendCommand('ON');
      logger.info('STEREO - IR turn on amp from standby');
      items.getItem(room.tvStandby).sendCommand('ON');
      logger.info('CT_LGWebOS_TV_Power turn on tv from standby');
    });

    // turn to amp audio source Video1
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(30), () => {
      items.getItem(room.ampInputVideo1).sendCommand('ON');
      logger.info('STEREO - IR amp switch to amplifier_IR_Video1 source');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(10), () => {
      items.getItem(room.kodiPower).sendCommand('ON');
      logger.info('STEREO - on');
    });
  }
  // }
  // actions.Voice.say(roomName + ' tv on');
  // actions.Voice.say(`turning ${roomName} tv on`);
  actions.Voice.say(`${message}`);

  // `${roomName} tv on`
}

/**
 * Turns off the Pi Kodi and TV based on the configuration.
 *
 * @param {string} roomName - The name of the room (key in tvConfig).
 * @param {string} message - The message to be logged.
 */
function turnOffTV(roomName, message) {
  logger.info(`Turning off ${roomName} TV and associated kit: ${message}`);
  const room = tvConfig[roomName];
  if (!room) {
    logger.error(`Room configuration not found: ${roomName}`);
    return;
  }
  if (roomName === 'conservatory') {
    // items.getItem(room.kodiSystemCommand).sendCommand('Shutdown'); // shutdown CT Pi
    // logger.info('sent command - shutdown kodi');
    // items.getItem(room.ampPowerOff).sendCommand('ON');
    if (items.getItem(room.tvPower).state === 'OFF') {
      actions.Voice.say('The TV is already off. you knob');
      return;
    }

    items.getItem(room.tvStandby).sendCommand('OFF');
    logger.info('CT_LGWebOS_TV_Power turn off tv to standby');

    // check if the tv is already off and say so

    if (room.flashItem) {
      alerting.flashItemAlert(room.flashItem, room.flashCount, 500);
    }

    // if stereo off timer is not defined or completed, restart the stereo off timer
    if (!CT_TV_off_timer || !CT_TV_off_timer.isActive()) {
      CT_TV_off_timer = actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(25), () => {
        items.getItem(room.kodiPower).sendCommand('OFF'); // CT kodi, amp, ir bridge
        items.getItem(room.tvPower).sendCommand('OFF'); // tv, hdmi audio extractor

        items.getItem(room.tvSwitch).postUpdate('OFF'); // turn off virt trigger
        logger.info('turned off kodi power');
      });
    }
  } else {
    if (room.flashItem) {
      alerting.flashItemAlert(room.flashItem, room.flashCount, 500);
    }
    items.getItem(room.kodiShutdownProxy).sendCommand('OFF');
    // if off timer undefined start for pi shutdown
    tvPowerOffTimer = actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(10), () => {
      if (room.kodiPower) {
        items.getItem(room.kodiPower).sendCommand('OFF');
      }
      if (room.tvPower) {
        items.getItem(room.tvPower).sendCommand('OFF');
      }
    });
  }
  // actions.Voice.say(`turning ${roomName} tv off`);
  // actions.Voice.say(`turning ${roomName} tv off`);
  actions.Voice.say(`${message}`);
}

// ==================Conservatory TV ON
let CT_TV_off_timer;

rules.JSRule({
  name: 'turn ON conservatory TV',
  description: 'turn ON conservatory TV',
  triggers: [
    triggers.ItemStateChangeTrigger(tvConfig.conservatory.tvSwitch, 'OFF', 'ON'),
    triggers.ItemStateChangeTrigger(tvConfig.conservatory.tvSwitch2, 'OFF', 'ON'),
    // triggers.ItemStateUpdateTrigger(tvConfig.conservatory.tvSwitch, 'ON'),
    // triggers.ItemStateChangeTrigger(tvConfig.conservatory.tvSwitch_ikea_remote, 'toggle_hold', 'toggle'),
    triggers.ItemStateUpdateTrigger(tvConfig.conservatory.tvSwitch_ikea_remote, 'brightness_up_click'),
  ],
  execute: () => {
    turnOnTV('conservatory', 'Turning on conservatory TV');
  },
});

// ==================Conservatory TV OFF
rules.JSRule({
  name: 'turn OFF conservatory tv',
  description: 'turn OFF conservatory tv',
  triggers: [
    triggers.ItemStateChangeTrigger(tvConfig.conservatory.tvSwitch, 'ON', 'OFF'),
    triggers.ItemStateChangeTrigger(tvConfig.conservatory.tvSwitch2, 'ON', 'OFF'),
    // triggers.ItemStateUpdateTrigger(tvConfig.conservatory.tvSwitch, 'OFF'),
    triggers.ItemStateUpdateTrigger(tvConfig.conservatory.tvSwitch_ikea_remote, 'brightness_down_click'),
    triggers.ItemStateUpdateTrigger(tvConfig.conservatory.tvSwitch_ikea_remote, 'toggle_hold'),
  ],
  execute: () => {
    turnOffTV('conservatory', 'Turning OFF conservatory TV');
  },
});

// ==================== turn ON bedroom Pi Kodi and TV
rules.JSRule({
  name: 'turn ON bedroom Pi Kodi and TV',
  description: 'turn ON bedroom Pi Kodi and TV',
  triggers: [triggers.ItemStateUpdateTrigger(tvConfig.bedroom.tvSwitch, 'ON')],
  execute: () => {
    turnOnTV('bedroom', 'Turning on Bedroom TV');
  },
});

// ==============Turn OFF bedroom Kodi-Pi, TV
rules.JSRule({
  name: 'Turn OFF bedroom Kodi-Pi, TV',
  description: 'Turn OFF bedroom Kodi-Pi, TV',
  triggers: [triggers.ItemStateUpdateTrigger(tvConfig.bedroom.tvSwitch, 'OFF')],
  execute: () => {
    turnOffTV('bedroom', 'Turning off Bedroom TV');
  },
});

// ==================

rules.JSRule({
  name: 'Turn ON FrontRoom Kodi-Pi, TV',
  description: 'Turn ON FrontRoom Kodi-Pi, TV',
  triggers: [triggers.ItemStateUpdateTrigger(tvConfig.frontroom.tvSwitch, 'ON')],
  execute: () => {
    turnOnTV('frontroom', 'Turning on FrontRoom TV');
  },
});

rules.JSRule({
  name: 'Turn OFF FrontRoom Kodi-Pi, TV',
  description: 'Turn OFF FrontRoom Kodi-Pi, TV',
  triggers: [triggers.ItemStateUpdateTrigger(tvConfig.frontroom.tvSwitch, 'OFF')],
  execute: () => {
    turnOffTV('frontroom', 'Turning off FrontRoom TV');
  },
});

rules.JSRule({
  name: 'Turn ON Attic Kodi-Pi, TV',
  description: 'Turn ON Attic Kodi-Pi, TV',
  triggers: [triggers.ItemStateUpdateTrigger(tvConfig.attic.tvSwitch, 'ON')],
  execute: () => {
    turnOnTV('attic', 'Turning on Attic TV');
  },
});

rules.JSRule({
  name: 'Turn OFF Attic Kodi-Pi, TV',
  description: 'Turn OFF Attic Kodi-Pi, TV',
  triggers: [triggers.ItemStateUpdateTrigger(tvConfig.attic.tvSwitch, 'OFF')],
  execute: () => {
    turnOffTV('attic', 'Turning off Attic TV');
  },
});
