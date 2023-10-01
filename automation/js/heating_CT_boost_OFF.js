const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { CountdownTimer, timeUtils, TimerMgr } = require('openhab_rules_tools');

const logger = log('boost ct');

// eslint-disable-next-line no-var
var CT_boost_timer;

rules.JSRule({
  name: 'Check if v_CT_Boost button clicked ON->OFF',
  description: 'Check if v_CT_Boost button clicked ON->OFF',
  triggers: [
    // triggers.ItemStateChangeTrigger('v_CT_Boost', 'OFF', 'ON'), // on edges only
    triggers.ItemStateChangeTrigger('v_CT_Boost', 'ON', 'OFF'),
    // todo handle manual boost(cancel) off button clicked - not doen by end of timer

  ],
  execute: (event) => {
    logger.debug('>CT_Boost changed');
    console.log(event);

    // get prefix eg FR, CT etc
    // const heaterPrefix = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    const heaterPrefixPartial = event.itemName.toString().substr(event.itemName.indexOf('_') + 1);
    const heaterPrefix = heaterPrefixPartial.substr(0, event.itemName.indexOf('_') + 1);
    logger.debug(`-- ->>> heaterPrefix : ${heaterPrefix}`);
    logger.debug(`>..heaterPrefix: ${heaterPrefix}`);

    const ReachableItem = items.getItem(`${heaterPrefix}_Heater_Reachable`);
    logger.debug(`>ReachableItem.name: ${ReachableItem.name} : ,  ReachableItem.state: ${ReachableItem.state}`);
    const HeaterItem = items.getItem(`${heaterPrefix}_Heater_Control`);
    logger.debug(`>HeaterItem.name: ${HeaterItem.name} : ,  HeaterItem.state: ${HeaterItem.state}`);
    // !handle an offline TRV - return
    if (ReachableItem.state.toString() !== 'Online') {
      logger.debug(`>>ZZZZ ReachableItem-Offline - sending OFF, leaving!!!!! : ${heaterPrefix} : ,  ReachableItem.state: ${ReachableItem.state}`);
      // turn it off
      HeaterItem.sendCommand('OFF');
      return;// dont continue on if this RTV is Offline
    }

    const BoostItem = items.getItem(`${heaterPrefix}_Boost`, true);// return null if missing
    if (BoostItem) {
      logger.debug(`>>>>BoostItem.name: ${BoostItem.name ? BoostItem.name : 'undefined for heater'} : ,  BoostItem.state: ${BoostItem.state ? BoostItem.state : 'Nopt defined'}`);
      // if (event.itemName === BoostItem.name) {
      // if (event.newState === 'ON') { // gone Off->ON
      //   logger.debug('>v_CT_Boost changed off->on');
      //   actions.Voice.say('turning ct boost on');
      //   logger.debug(`ct BOOST ON, sending ON command to HeaterItem.name: ${HeaterItem.name}`);
      //   HeaterItem.sendCommand('ON');
      //   logger.debug('>ct BOOSTING');
      //   CT_boost_timer = new countdownTimer.CountdownTimer(boost_time, (() => { stopBoost(); }), 'CT_Boost_Countdown');
      // }
      if (event.newState === 'OFF') { // gone ON->OFF
        logger.debug('>v_CT_Boost changed on->off');
        actions.Voice.say('Stopping conservatory BOOST');
        // if  here then its by clicking the boost off button so
        // cancel timer   // and turn stuff off
        logger.debug('manual....BOOST OFF ');
        // if (!CT_boost_timer.isRunning()) {
        //   CT_boost_timer.cancel();
        // }
        items.getItem('CT_Boost').sendCommand('OFF'); // tv
        HeaterItem.sendCommand('OFF');
      } else {
        logger.debug('(v_ct OFF. timer does NOT exist');
      }
    }
  },
});
