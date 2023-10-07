const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { CountdownTimer, timeUtils } = require('openhab_rules_tools');

//timer mgr
// https://community.openhab.org/t/making-sure-that-only-one-timer-exists-per-itemname/149723/2
// var {TimerMgr} = require('openhab_rules_tools');

var boostTimers = cache.private.get('boostTimers', () => ({ 'CT': 0, 'DR': null }));

var ruleUID = "boost-heating";

const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.boost-heating

// var boost_time = '894s'; // 15m';
// out by 6 secs in 15m  900s
// const boost_time = 'PT15m';
const boost_time = 'PT1m';


scriptLoaded = function () {
  logger.debug('scriptLoaded -  boost-heating');
  // console.log(boostTimers);
  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);
  for (let timer in boostTimers) {
    logger.debug(`timer : ${JSON.stringify(timer)}`);
  }
  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);
};


rules.JSRule({
  name: 'Check if Boost button clicked OFF->ON',
  description: 'Check if Boost button clicked OFF->ON',
  triggers: [
    triggers.GroupStateChangeTrigger('gvHeaterBoosters')
  ],
  execute: (event) => {
    logger.debug('>Heater_Boost button change');
    // console.log(event);
    logger.debug(`event: ${JSON.stringify(event)}`);

    // get prefix eg FR, CT etc
    // const heaterPrefix = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    // const heaterPrefixPartial = event.itemName.toString().substr(event.itemName.indexOf('_') + 1);
    logger.debug(`event.itemName.toString() : ${event.itemName.toString()}`);

    //trim off initial'v_'
    const heaterPrefixPartial = event.itemName.toString().substr(event.itemName.indexOf('_') + 1);
    logger.debug(`heaterPrefixPartial : ${heaterPrefixPartial}`);

    //remove anything after and including the first'_', e.g leaving 'CT'
    const heaterPrefix = heaterPrefixPartial.substr(0, event.itemName.indexOf('_') + 1);
    logger.debug(`heaterPrefix: ${heaterPrefix}`);

    const HeaterItem = items.getItem(`${heaterPrefix}_Heater_Control`);
    logger.debug(`>HeaterItem.name: ${HeaterItem.name} : ,  HeaterItem.state: ${HeaterItem.state}`);

    // !handle an offline TRV - return
    const ReachableItem = items.getItem(`${heaterPrefix}_Heater_Reachable`);
    logger.debug(`>ReachableItem.name: ${ReachableItem.name} : ,  ReachableItem.state: ${ReachableItem.state}`);
    if (ReachableItem.state.toString() !== 'Online') {
      logger.debug(`ReachableItem-Offline - sending OFF, leaving!! : ${heaterPrefix} : ,  ReachableItem.state: ${ReachableItem.state}`);
      // turn it off
      HeaterItem.sendCommand('OFF');
      return;// dont continue on if this RTV is Offline
    }

    const BoostItem = items.getItem(`${heaterPrefix}_Heater_Boost`, true);// return null if missing
    logger.debug(`>BoostItem.name: ${BoostItem.name} : ,  BoostItem.state: ${BoostItem.state}`);

    if (BoostItem) {
      logger.debug(`BoostItem.name: ${BoostItem.name ? BoostItem.name : 'undefined for heater'} : ,  BoostItem.state: ${BoostItem.state ? BoostItem.state : 'Not defined'}`);

      if (event.newState === 'ON') { // gone Off->ON
        boostOnAction(heaterPrefix);
      } else if(event.newState === 'OFF') { // gone ON->OFF
        boostOffAction(heaterPrefix);
      }
    }
  },
});


function boostOnAction(heaterPrefix) {
  const HeaterItem = items.getItem(`${heaterPrefix}_Heater_Control`);

  logger.debug(`boostOnAction off->on : ${HeaterItem}`);
  actions.Voice.say('boost on');

  logger.debug(`BOOST ON, sending ON command to HeaterItem.name: ${HeaterItem.name}`);
  HeaterItem.sendCommand('ON');

  const BoostItem = items.getItem(`${heaterPrefix}_Heater_Boost`, true);// return null if missing
  BoostItem.sendCommand('ON');
  logger.debug(`BOOSTING : ${BoostItem}`);

  boostTimers[heaterPrefix] = CountdownTimer(time.toZDT(boost_time), (() => { stopBoost(heaterPrefix); }), `${heaterPrefix}_Boost_Countdown`, 'boostCountdown');
  logger.debug(`boostTimers : ${JSON.stringify(boostTimers)}`);
}


function boostOffAction(heaterPrefix) {
  const HeaterItem = items.getItem(`${heaterPrefix}_Heater_Control`);

  logger.debug('>v_CT_Boost changed on->off');
  actions.Voice.say('Stopping conservatory BOOST');
  // cancel timer   // and turn stuff off
  logger.debug('manual....BOOST OFF ');

  // cancel the boost timer
  if (boostTimers[heaterPrefix]) {
    boostTimers[heaterPrefix].cancel();
    logger.debug('cancelling boost timer ');
  }

  items.getItem(`${heaterPrefix}_Heater_Boost`).sendCommand('OFF');
  items.getItem(`v_${heaterPrefix}_Heater_Boost`).sendCommand('OFF');

  HeaterItem.sendCommand('OFF');
}


function stopBoost(heaterPrefix) {
  actions.Voice.say('timer over');
  logger.debug('stopBoost');

  // items.getItem('CT_Heater_Boost').sendCommand('OFF');
  items.getItem(heaterPrefix + '_Heater_Boost').sendCommand('OFF');

  // items.getItem('v_CT_Boost').sendCommand('OFF');
  items.getItem('v_' + heaterPrefix + '_Boost').sendCommand('OFF');

  // items.getItem('v_CT_Heater_Boost').sendCommand('OFF');
  items.getItem('v_' + heaterPrefix + '_Heater_Boost').sendCommand('OFF');

  // items.getItem('CT_Heater_Control').sendCommand('OFF');
  items.getItem(heaterPrefix + '_Heater_Control').sendCommand('OFF'); // tv
}
