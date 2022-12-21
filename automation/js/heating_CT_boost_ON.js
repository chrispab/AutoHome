const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { countdownTimer, timeUtils, timerMgr } = require('openhab_rules_tools');

const logger = log('boost ct');

// eslint-disable-next-line no-var
var CT_boost_timer;
// eslint-disable-next-line no-var
// var boost_time = '894s'; // 15m';
const boost_time = '15m';

// out by 6 secs in 15m  900s
// CT_Boost_Countdown

function stopBoost() {
  actions.Voice.say('timer over');
  // logger.warn(`timer over ... BOOST OFF, sending OFF command to HeaterItem.name: ${HeaterItem.name}`);
  logger.error('BOOST timer over');
  // if (CT_boost_timer) {
  // logger.error('stopBoost timer ');
  // CT_boost_timer.cancel();//will error cos of this
  items.getItem('CT_Boost').sendCommand('OFF'); // tv
  items.getItem('v_CT_Boost').sendCommand('OFF');
  items.getItem('CT_Heater').sendCommand('OFF'); // tv
  // HeaterItem.sendCommand('OFF');
  // HeaterItem.sendCommand('OFF');
  // } else {
  //   logger.error('stopBoost timer does NOT exist');
  // }
}

rules.JSRule({
  name: 'Check if v_CT_Boost button clicked OFF->ON',
  description: 'Check if v_CT_Boost button clicked OFF->ON',
  triggers: [
    triggers.ItemStateChangeTrigger('v_CT_Boost', 'OFF', 'ON'), // on edges only
    // triggers.ItemStateChangeTrigger('v_CT_Boost', 'ON', 'OFF'),
    // todo handle manual boost(cancel) off button clicked - not doen by end of timer

  ],
  execute: (event) => {
    logger.error('>CT_Boost changed');
    console.log(event);

    // get prefix eg FR, CT etc
    // const heaterPrefix = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    const heaterPrefixPartial = event.itemName.toString().substr(event.itemName.indexOf('_') + 1);
    const heaterPrefix = heaterPrefixPartial.substr(0, event.itemName.indexOf('_') + 1);
    logger.error(`-- ->>> heaterPrefix : ${heaterPrefix}`);
    logger.error(`>..heaterPrefix: ${heaterPrefix}`);

    const ReachableItem = items.getItem(`${heaterPrefix}_RTVReachable`);
    logger.error(`>ReachableItem.name: ${ReachableItem.name} : ,  ReachableItem.state: ${ReachableItem.state}`);
    const HeaterItem = items.getItem(`${heaterPrefix}_Heater`);
    logger.error(`>HeaterItem.name: ${HeaterItem.name} : ,  HeaterItem.state: ${HeaterItem.state}`);
    // !handle an offline TRV - return
    if (ReachableItem.state.toString() !== 'Online') {
      logger.error(`>>ZZZZ ReachableItem-Offline - sending OFF, leaving!!!!! : ${heaterPrefix} : ,  ReachableItem.state: ${ReachableItem.state}`);
      // turn it off
      HeaterItem.sendCommand('OFF');
      return;// dont continue on if this RTV is Offline
    }

    const BoostItem = items.getItem(`${heaterPrefix}_Boost`, true);// return null if missing
    if (BoostItem) {
      logger.error(`>>>>BoostItem.name: ${BoostItem.name ? BoostItem.name : 'undefined for heater'} : ,  BoostItem.state: ${BoostItem.state ? BoostItem.state : 'Nopt defined'}`);
      // if (event.itemName === BoostItem.name) {
      if (event.newState === 'ON') { // gone Off->ON
        logger.error('>v_CT_Boost changed off->on');
        actions.Voice.say('conservatory boost on');
        logger.error(`ct BOOST ON, sending ON command to HeaterItem.name: ${HeaterItem.name}`);
        HeaterItem.sendCommand('ON');
        items.getItem('CT_Boost').sendCommand('ON');
        logger.error('>ct BOOSTING');
        CT_boost_timer = new countdownTimer.CountdownTimer(boost_time, (() => { stopBoost(); }), 'CT_Boost_Countdown');
      } else if (event.newState === 'OFF') { // gone ON->OFF
        logger.error('>v_CT_Boost changed on->off');
        // actions.Voice.say('manually   Stopping BOOST');
        // if  here then its by clicking the boost off button so
        // cancel timer   // and turn stuff off
        // logger.error('manual....BOOST OFF ');
        // if (!CT_boost_timer.isRunning()) {
        //   CT_boost_timer.cancel();
        // }
      } else {
        logger.error('(v_ct OFF. timer does NOT exist');
      }
    }
  },
});
