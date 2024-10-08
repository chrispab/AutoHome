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

// var boost_time = '894s'; // 15m';
// out by 6 secs in 15m  900s

let boost_time = 'PT1m';
// const boost_time = 'PT15m';

let boostTimers = cache.private.get('boostTimers', () => ({
  CT: 1,
  FH: 2,
  DR: 3,
  FR: 4,
  HL: 5,
  OF: 6,
  BR: 7,
  ER: 8,
  AT: 9,
  TL: 10,
}));
const roomNamesObj = {
  CT: 'Conservatory',
  FH: 'Fan heater',
  DR: 'Dining room',
  FR: 'Front room',
  HL: 'Hall',
  OF: 'Office',
  BR: 'Bed rooom',
  ER: 'Elsie\'s room',
  AT: 'Attic',
  TL: 'Toilets only',
};
let roomName = '';

scriptLoaded = function () {
  boostTimers = cache.private.get('boostTimers');

  logger.debug('scriptLoaded -  boost-heating');
  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);
  for (const timer in boostTimers) {
    logger.debug(`timer : ${JSON.stringify(timer)}, val: ${boostTimers[timer]}`);
  }
  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);

  logger.debug('scriptLoaded - initialising XX_Boost_Time');
  items.getItem('gBoost_Time').members.forEach((item) => {
    // if XX_Boost_time is null then set to 15 mins..
    if (item.state === 'NULL') {
      item.postUpdate(15);
    }
  });
  cache.private.put('boostTimers', boostTimers);
};

rules.JSRule({
  name: 'Boost button on',
  description: 'action when Boost button clicked',
  triggers: [
    triggers.GroupStateChangeTrigger('gvHeaterBoosters'),
  ],

  execute: (event) => {
    logger.debug('>Heater_Boost button change');
    logger.debug(`event: ${JSON.stringify(event)}`);
    logger.debug(`event.itemName: ${event.itemName.toString()}`);

    // get prefix eg FR, CT etc
    // trim off initial'v_' if present, otherwise its the first 2 chars eg 'CT'
    const roomPrefix = utils.getLocationPrefix(event.itemName, logger);
    // logger.debug(`roomPrefix: ${roomPrefix}`);

    const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);
    logger.debug(`>HeaterItem.name: ${HeaterItem.name} : ,  HeaterItem.state: ${HeaterItem.state}`);

    // handle an offline TRV - return
    const ReachableItem = items.getItem(`${roomPrefix}_Heater_Reachable`);
    logger.debug(`>ReachableItem.name: ${ReachableItem.name} : ,  ReachableItem.state: ${ReachableItem.state}`);
    const reachableItemOnlineStatus = ReachableItem.state.toString();
    if ((reachableItemOnlineStatus !== 'ON') && (reachableItemOnlineStatus !== 'Online')) {
      logger.debug(`ReachableItem-OFF - Offline : ${roomPrefix} : ,  ReachableItem.state: ${ReachableItem.state}, - sending OFF, leaving!! to heateritem`);
      // turn it off
      HeaterItem.sendCommand('OFF');
      return;// dont continue on if this RTV is Offline
    }

    // get the boostItem - if it exists yet, else get null if not
    const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// return null if missing
    logger.debug(`>BoostItem.name: ${BoostItem.name} : ,  BoostItem.state: ${BoostItem.state}`);

    if (BoostItem) {
      logger.debug(`BoostItem.name: ${BoostItem.name ? BoostItem.name : 'undefined for heater'} : ,  BoostItem.state: ${BoostItem.state ? BoostItem.state : 'Not defined'}`);

      if (event.newState === 'ON') { // gone Off->ON
        boostOnAction(roomPrefix);
      } else if (event.newState === 'OFF') { // gone ON->OFF
        boostOffAction(roomPrefix);
      }
    }
  },
});

function boostOnAction(roomPrefix) {
  const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);

  logger.debug(`boostOnAction off->on : ${HeaterItem}`);
  roomName = getRoomName(roomPrefix);
  actions.Voice.say(`${roomName} boost on`);

  logger.debug(`BOOST ON, sending ON command to HeaterItem.name: ${HeaterItem.name}`);
  HeaterItem.sendCommand('ON');

  const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// return null if missing
  BoostItem.sendCommand('ON');
  logger.debug(`BOOSTING BoostItem.sendCommand('ON'): ${BoostItem}`);

  boostTimers = cache.private.get('boostTimers');

  const BoostTimeItem = items.getItem(`${roomPrefix}_Boost_Time`);
  logger.debug(`BOOSTING BoostTimeItem.rawState: ${BoostTimeItem.rawState}`);
  boost_time = BoostTimeItem.state * 1000 * 60;// minutes to ms
  boostTimers[roomPrefix] = CountdownTimer(time.toZDT(boost_time), (() => { boostOffAction(roomPrefix); }), `${roomPrefix}_Boost_Countdown`, `${roomPrefix}_boostCountdown`);
  // boostTimers[roomPrefix] = CountdownTimer(time.toZDT(BoostTimeItem.rawState), (() => { boostOffAction(roomPrefix); }), `${roomPrefix}_Boost_Countdown`, `${roomPrefix}_boostCountdown`);
  // boostTimers[roomPrefix] = CountdownTimer(time.toZDT(BoostTimeItem.state), (() => { boostOffAction(roomPrefix); }), `${roomPrefix}_Boost_Countdown`, `${roomPrefix}_boostCountdown`);
  // boostTimers[roomPrefix] = CountdownTimer(time.toZDT(Quantity(BoostTimeItem.state)), (() => { boostOffAction(roomPrefix); }), `${roomPrefix}_Boost_Countdown`, `${roomPrefix}_boostCountdown`);
  // boostTimers[roomPrefix] = CountdownTimer(time.toZDT(Quantity(`${BoostTimeItem.state}`)), (() => { boostOffAction(roomPrefix); }), `${roomPrefix}_Boost_Countdown`, `${roomPrefix}_boostCountdown`);
  // boostTimers[roomPrefix] = CountdownTimer(time.toZDT(Quantity(`${BoostTimeItem.rawState}`)), (() => { boostOffAction(roomPrefix); }), `${roomPrefix}_Boost_Countdown`, `${roomPrefix}_boostCountdown`);
  // boostTimers[roomPrefix] = CountdownTimer(time.toZDT(BoostTimeItem.state), (() => { boostOffAction(roomPrefix); }), `${roomPrefix}_Boost_Countdown`, `${roomPrefix}_boostCountdown`);
  // boostTimers[roomPrefix] = CountdownTimer(time.toZDT(BoostTimeItem.state*1000*60), (() => { boostOffAction(roomPrefix); }), `${roomPrefix}_Boost_Countdown`, `${roomPrefix}_boostCountdown`);
  cache.private.put('boostTimers', boostTimers);
  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);
}

function boostOffAction(roomPrefix) {
  boostTimers = cache.private.get('boostTimers');

  logger.debug('boostOffAction on->off');
  // cancel timer   // and turn stuff off
  if (boostTimers[roomPrefix]) {
    boostTimers[roomPrefix].cancel();
    logger.debug('cancelling boost timer ');
  }
  stopBoostItems(roomPrefix);
  roomName = getRoomName(roomPrefix);
  actions.Voice.say(`${roomName} boost off`);
  // actions.Voice.say('boost off');

  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);

  cache.private.put('boostTimers', boostTimers);
}

function getRoomName(roomPrefix) {
  return roomNamesObj[`${roomPrefix}`];
}

function stopBoostItems(roomPrefix) {
  logger.debug('stopBoostItems');

  // ; e.g CT_Heater_Boost.sendCommand('OFF')
  items.getItem(`${roomPrefix}_Heater_Boost`).sendCommand('OFF');
  logger.debug(`sendCommand('OFF') : ${`${roomPrefix}_Heater_Boost`}`);

  // ; e.g CT_Boost.sendCommand('OFF')
  items.getItem(`v_${roomPrefix}_Boost`).sendCommand('OFF');
  logger.debug(`sendCommand('OFF') : ${`v_${roomPrefix}_Boost`}`);

  // ; e.g v_CT_Heater_Boost.sendCommand('OFF')
  items.getItem(`v_${roomPrefix}_Heater_Boost`).sendCommand('OFF');
  logger.debug(`sendCommand('OFF') : ${`v_${roomPrefix}_Heater_Boost`}`);

  // ; e.g CT_Heater_Control.sendCommand('OFF')
  items.getItem(`${roomPrefix}_Heater_Control`).sendCommand('OFF');
  logger.debug(`sendCommand('OFF') : ${`${roomPrefix}_Heater_Control`}`);
}
