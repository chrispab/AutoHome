/* eslint-disable no-use-before-define */
const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { CountdownTimer } = require('openhab_rules_tools');
const { utils } = require('openhab-my-utils');

const ruleUID = 'boost-heating';
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.boost-heating
// log:set INFO org.openhab.automation.openhab-js.boost-heating

// --- Room Configuration ---
const roomNamesObj = {
  CT: 'Conservatory',
  FH: 'Fan heater',
  DR: 'Dining room',
  FR: 'Front room',
  HL: 'Hall',
  OF: 'Office',
  BR: 'Bed rooom',
  ER: "Elsie's room",
  AT: 'Attic',
  TL: 'Toilets only',
};

// --- Helper Functions ---

/**
 * Converts boost time in minutes to milliseconds.
 * @param {object} boostTimeItem - The openHAB item representing the boost time.
 * @returns {number} - The boost time in milliseconds.
 */
function getBoostTimeMs(boostTimeItem) {
  return boostTimeItem.state * 1000 * 60; // Convert minutes to milliseconds
}

/**
 * Retrieves the room name from the room prefix.
 * @param {string} roomPrefix - The prefix for the room (e.g., "CT", "FR").
 * @returns {string} - The full room name (e.g., "Conservatory").
 */
function getRoomName(roomPrefix) {
  return roomNamesObj[`${roomPrefix}`];
}

/**
 * Stops the boost items for a given room.
 * @param {string} roomPrefix - The prefix for the room.
 */
function stopBoostItems(roomPrefix) {
  logger.debug('stopBoostItems');
  const itemSuffixes = ['_Heater_Boost', `v_${roomPrefix}_Boost`, `v_${roomPrefix}_Heater_Boost`, '_Heater_Control'];

  itemSuffixes.forEach((suffix) => {
    const itemName = suffix.startsWith('v_') ? suffix : `${roomPrefix}${suffix}`;
    const item = items.getItem(itemName);

    if (item) {
      item.sendCommand('OFF');
      logger.debug(`sendCommand('OFF') : ${itemName}`);
    } else {
      logger.warn(`cannot sendCommand('OFF') as item was NULL : ${itemName}`);
    }
  });
}

// --- RoomBoostTimer Class ---
class RoomBoostTimer {
  constructor(roomPrefix) {
    this.roomPrefix = roomPrefix;
    this.timer = null;
    this.is_active = false;
  }

  startTimer(boostTimeMs) {
    // stop any existing timer
    this.stopTimer();
    this.is_active = true;
    this.timer = new CountdownTimer(
      time.toZDT(boostTimeMs),
      () => {
        boostOffAction(this.roomPrefix);
      },
      `${this.roomPrefix}_Boost_Countdown`,
      `${this.roomPrefix}_boostCountdown`,
    );
    logger.debug(`started boost timer for room: ${this.roomPrefix}`);
  }

  stopTimer() {
    if (this.timer && this.is_active) {
      this.timer.cancel();
      logger.debug(`stopped boost timer for room: ${this.roomPrefix}`);
      this.is_active = false;
      this.timer = null;
    }
  }
}

// --- RoomBoostTimers Cache ---
const roomBoostTimers = cache.private.get('roomBoostTimers', () => ({
  // initialize all possible room timers
  CT: new RoomBoostTimer('CT'),
  FH: new RoomBoostTimer('FH'),
  DR: new RoomBoostTimer('DR'),
  FR: new RoomBoostTimer('FR'),
  HL: new RoomBoostTimer('HL'),
  OF: new RoomBoostTimer('OF'),
  BR: new RoomBoostTimer('BR'),
  ER: new RoomBoostTimer('ER'),
  AT: new RoomBoostTimer('AT'),
  TL: new RoomBoostTimer('TL'),
}));

// --- Boost Actions ---

/**
 * Executes the actions to turn on the boost for a specific room.
 * @param {string} roomPrefix - The prefix for the room (e.g., "CT", "FR").
 */
function boostOnAction(roomPrefix) {
  const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);
  if (!HeaterItem) {
    logger.error(`Heater Item not found: ${roomPrefix}_Heater_Control`);
    return;
  }

  const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`);
  if (!BoostItem) {
    logger.error(`Boost Item not found: ${roomPrefix}_Heater_Boost`);
    return;
  }

  const BoostTimeItem = items.getItem(`${roomPrefix}_Boost_Time`);
  if (!BoostTimeItem) {
    logger.error(`Boost Time Item not found: ${roomPrefix}_Boost_Time`);
    return;
  }

  logger.debug(`boostOnAction off->on : ${HeaterItem.name}`);
  const roomName = getRoomName(roomPrefix);
  actions.Voice.say(`${roomName} boost on`);

  logger.debug(`BOOST ON, sending ON command to HeaterItem.name: ${HeaterItem.name}`);
  HeaterItem.sendCommand('ON');

  BoostItem.sendCommand('ON');
  logger.debug(`BOOSTING BoostItem.sendCommand('ON'): ${BoostItem.name}`);

  const boost_time = getBoostTimeMs(BoostTimeItem);
  roomBoostTimers[roomPrefix].startTimer(boost_time);

  cache.private.put('roomBoostTimers', roomBoostTimers);
  logger.debug(`roomBoostTimers : ${JSON.stringify(roomBoostTimers)}`);
}

/**
 * Executes the actions to turn off the boost for a specific room.
 * @param {string} roomPrefix - The prefix for the room (e.g., "CT", "FR").
 */
function boostOffAction(roomPrefix) {
  logger.debug('boostOffAction on->off');
  roomBoostTimers[roomPrefix].stopTimer();
  stopBoostItems(roomPrefix);
  const roomName = getRoomName(roomPrefix);
  actions.Voice.say(`${roomName} boost off`);
  cache.private.put('roomBoostTimers', roomBoostTimers);
}

// --- Script Loading ---
scriptLoaded = function () {
  logger.debug('scriptLoaded -  boost-heating');

  // ensure all boost timers are initialised, when script starts
  roomBoostTimers.CT.stopTimer();
  roomBoostTimers.FH.stopTimer();
  roomBoostTimers.DR.stopTimer();
  roomBoostTimers.FR.stopTimer();
  roomBoostTimers.HL.stopTimer();
  roomBoostTimers.OF.stopTimer();
  roomBoostTimers.BR.stopTimer();
  roomBoostTimers.ER.stopTimer();
  roomBoostTimers.AT.stopTimer();
  roomBoostTimers.TL.stopTimer();
  cache.private.put('roomBoostTimers', roomBoostTimers);
  logger.debug(`roomBoostTimers : ${JSON.stringify(roomBoostTimers)}`);

  logger.debug('scriptLoaded - initialising XX_Boost_Time');
  items.getItem('gBoost_Time').members.forEach((item) => {
    // if XX_Boost_time is null then set to 15 mins..
    if (item.state === 'NULL') {
      item.postUpdate(15);
    }
  });
};

// --- Main Rule ---
rules.JSRule({
  name: 'Boost button on',
  description: 'action when Boost button clicked',
  triggers: [triggers.GroupStateChangeTrigger('gvHeaterBoosters')],
  execute: (event) => {
    logger.debug('>Heater_Boost button change');
    logger.debug(`event: ${JSON.stringify(event)}`);
    logger.debug(`event.itemName: ${event.itemName.toString()}`);

    // get prefix eg FR, CT etc
    // trim off initial'v_' if present, otherwise its the first 2 chars eg 'CT'
    const roomPrefix = utils.getLocationPrefix(event.itemName, logger);

    if (!roomPrefix) {
      logger.error('roomPrefix was null- cannot continue');
      return;
    }

    const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);
    if (!HeaterItem) {
      logger.error('HeaterItem was null- cannot continue');
      return;
    }
    logger.debug(`>HeaterItem.name: ${HeaterItem.name} : ,  HeaterItem.state: ${HeaterItem.state}`);

    // handle an offline TRV - return
    const ReachableItem = items.getItem(`${roomPrefix}_Heater_Reachable`);
    if (!ReachableItem) {
      logger.error('ReachableItem was null- cannot continue');
      return;
    }
    logger.debug(`>ReachableItem.name: ${ReachableItem.name} : ,  ReachableItem.state: ${ReachableItem.state}`);
    const reachableItemOnlineStatus = ReachableItem.state.toString();
    if (reachableItemOnlineStatus !== 'ON' && reachableItemOnlineStatus !== 'Online') {
      logger.debug(
        `ReachableItem-OFF - Offline : ${roomPrefix} : ,  ReachableItem.state: ${ReachableItem.state}, - sending OFF, leaving!! to heateritem`,
      );
      // turn it off
      HeaterItem.sendCommand('OFF');
      return; // dont continue on if this RTV is Offline
    }

    // get the boostItem - if it exists yet, else get null if not
    const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true); // return null if missing
    if (!BoostItem) {
      logger.error('BoostItem was null- cannot continue');
      return;
    }
    logger.debug(`>BoostItem.name: ${BoostItem.name} : ,  BoostItem.state: ${BoostItem.state}`);

    if (event.newState === 'ON') {
      // gone Off->ON
      boostOnAction(roomPrefix);
    } else if (event.newState === 'OFF') {
      // gone ON->OFF
      boostOffAction(roomPrefix);
    }
  },
});
