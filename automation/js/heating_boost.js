const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { CountdownTimer, timeUtils } = require('openhab_rules_tools');


var ruleUID = "boost-heating";

const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.boost-heating

// var boost_time = '894s'; // 15m';
// out by 6 secs in 15m  900s
// const boost_time = 'PT15m';
const boost_time = 'PT1m';
var boostTimers = cache.private.get('boostTimers', () => ({ 'CT': 1,
                                                            'FH': 2,
                                                            'DR': 3,
                                                            'FR': 4,
                                                            'HL': 5,
                                                            'OF': 6,
                                                            'BR': 7,
                                                            'ER': 8,
                                                            'AT': 9
                                                          }));


scriptLoaded = function () {
  logger.debug('scriptLoaded -  boost-heating');
  // console.log(boostTimers);
  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);
  for (let timer in boostTimers) {
    logger.debug(`timer : ${JSON.stringify(timer)}, val: ${boostTimers[timer]}`);
    // logger.debug(`val : ${boostTimers[timer]}`);

  }
  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);
};


rules.JSRule({
  name: 'Check if Boost button clicked',
  description: 'Check if Boost button clicked',
  triggers: [
    triggers.GroupStateChangeTrigger('gvHeaterBoosters')
  ],
  execute: (event) => {
    logger.debug('>Heater_Boost button change');
    // console.log(event);
    logger.debug(`event: ${JSON.stringify(event)}`);


    logger.debug(`event.itemName.toString() : ${event.itemName.toString()}`);

    // get prefix eg FR, CT etc
    //trim off initial'v_'
    const roomPrefixPartial = event.itemName.toString().substr(event.itemName.indexOf('_') + 1);
    logger.debug(`roomPrefixPartial : ${roomPrefixPartial}`);

    //remove anything after and including the first'_', e.g leaving 'CT'
    const roomPrefix = roomPrefixPartial.substr(0, event.itemName.indexOf('_') + 1);
    logger.debug(`roomPrefix: ${roomPrefix}`);

    const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);
    logger.debug(`>HeaterItem.name: ${HeaterItem.name} : ,  HeaterItem.state: ${HeaterItem.state}`);

    // !handle an offline TRV - return
    const ReachableItem = items.getItem(`${roomPrefix}_Heater_Reachable`);
    logger.debug(`>ReachableItem.name: ${ReachableItem.name} : ,  ReachableItem.state: ${ReachableItem.state}`);
    if (ReachableItem.state.toString() !== 'Online') {
      logger.debug(`ReachableItem-Offline - sending OFF, leaving!! : ${roomPrefix} : ,  ReachableItem.state: ${ReachableItem.state}`);
      // turn it off
      HeaterItem.sendCommand('OFF');
      return;// dont continue on if this RTV is Offline
    }

    //get the boostItem - if it exists yet, else get null if not
    const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// return null if missing
    logger.debug(`>BoostItem.name: ${BoostItem.name} : ,  BoostItem.state: ${BoostItem.state}`);

    if (BoostItem) {
      logger.debug(`BoostItem.name: ${BoostItem.name ? BoostItem.name : 'undefined for heater'} : ,  BoostItem.state: ${BoostItem.state ? BoostItem.state : 'Not defined'}`);

      if (event.newState === 'ON') { // gone Off->ON
        boostOnAction(roomPrefix);
      } else if(event.newState === 'OFF') { // gone ON->OFF
        boostOffAction(roomPrefix);
      }
    }
  },
});


function boostOnAction(roomPrefix) {
  const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);

  logger.debug(`boostOnAction off->on : ${HeaterItem}`);
  actions.Voice.say('boost on');

  logger.debug(`BOOST ON, sending ON command to HeaterItem.name: ${HeaterItem.name}`);
  HeaterItem.sendCommand('ON');

  const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// return null if missing
  BoostItem.sendCommand('ON');
  logger.debug(`BOOSTING BoostItem.sendCommand('ON'): ${BoostItem}`);

  boostTimers[roomPrefix] = CountdownTimer(time.toZDT(boost_time), (() => { stopBoost(roomPrefix); }), `${roomPrefix}_Boost_Countdown`, 'boostCountdown');
  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);
}


function boostOffAction(roomPrefix) {
  logger.debug('boostOffAction on->off');
  actions.Voice.say('boost off');
  // cancel timer   // and turn stuff off
  if (boostTimers[roomPrefix]) {
    boostTimers[roomPrefix].cancel();
    logger.debug('cancelling boost timer ');
  }
  stopBoostItems(roomPrefix);
  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);

}


function stopBoostItems(roomPrefix) {
  logger.debug('stopBoostItems');

  items.getItem(roomPrefix + '_Heater_Boost').sendCommand('OFF');
  logger.debug(`sendCommand('OFF') : ${roomPrefix + '_Heater_Boost'}`);

  items.getItem('v_' + roomPrefix + '_Boost').sendCommand('OFF');
  logger.debug(`sendCommand('OFF') : ${'v_' + roomPrefix + '_Boost'}`);

  items.getItem('v_' + roomPrefix + '_Heater_Boost').sendCommand('OFF');
  logger.debug(`sendCommand('OFF') : ${'v_' + roomPrefix + '_Heater_Boost'}`);

  items.getItem(roomPrefix + '_Heater_Control').sendCommand('OFF');
  logger.debug(`sendCommand('OFF') : ${roomPrefix + '_Heater_Control'}`);
}
