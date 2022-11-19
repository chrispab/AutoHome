const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { countdownTimer, timeUtils, timerMgr } = require('openhab_rules_tools');

const logger = log('boost ct');

// eslint-disable-next-line no-var
var CT_boost_timer;

// function stopBoost(HeaterItem) {
//   logger.error('timer stopIt....hit');
//   CT_boost_timer.cancel();
//   if (CT_boost_timer.hasTerminated()) {
//     // actions.Voice.say('hello');
//     logger.error(`timer over ... BOOST OFF, sending OFF command to HeaterItem.name: ${HeaterItem.name}`);

//     items.getItem('CT_Boost').sendCommand('OFF'); // tv
//     logger.error('timer stopIt....BOOST OFF');
//     actions.Voice.say('timer BOOST OFF');
//     HeaterItem.sendCommand('OFF');
//   }
// }

rules.JSRule({
  name: 'Check if CT_Boost',
  description: 'Check if CT_Boost',
  triggers: [
    triggers.ItemStateChangeTrigger('CT_Boost', 'OFF', 'ON'), // on edges only
    // triggers.ItemStateChangeTrigger('CT_Boost', 'ON', 'OFF'),
    // todo handle manual boost(cancel) off button clicked - not doen by end of timer

  ],
  execute: (event) => {
    try {
      console.log(event);
      logger.error('>CT_Boost changed. Do any Heaters need changing etc?');
      const action = 'default';
      // get prefix eg FR, CT etc
      const heaterPrefix = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));

      const HeaterItem = items.getItem(`${heaterPrefix}_Heater`);
      logger.error(`>HeaterItem.name: ${HeaterItem.name} : ,  HeaterItem.state: ${HeaterItem.state}`);

      const ReachableItem = items.getItem(`${heaterPrefix}_RTVReachable`);
      logger.error(`>ReachableItem.name: ${ReachableItem.name} : ,  ReachableItem.state: ${ReachableItem.state}`);

      // !handle an offline TRV - return
      // dont continue  if this RTV is Offline
      if (ReachableItem.state.toString() !== 'Online') {
        logger.error(`>>ZZZZ ReachableItem-Offline - sending OFF, leaving!!!!! : ${heaterPrefix} : ,  ReachableItem.state: ${ReachableItem.state}`);
        // turn it off
        HeaterItem.sendCommand('OFF');
        // dont continue on and update the bolier control if this RTV is Offline
        return;
      }

      const BoostItem = items.getItem(`${heaterPrefix}_Boost`, true);// return null if missing
      if (BoostItem && (event.itemName === BoostItem.name)) {
        logger.error(`>>>>BoostItem.name: ${BoostItem.name ? BoostItem.name : 'undefined for heater'} : ,  BoostItem.state: ${BoostItem.state ? BoostItem.state : 'Nopt defined'}`);
        if (event.itemName === BoostItem.name) {
          if (event.newState === 'ON') { // gone Off->ON
            actions.Voice.say('turning ct boost on');
            logger.error(`ct BOOST ON, sending ON command to HeaterItem.name: ${HeaterItem.name}`);
            HeaterItem.sendCommand('ON');
            logger.error('>ct BBBBOOOOOOOOSTING');
            CT_boost_timer = new countdownTimer.CountdownTimer('30m', (() => { stopBoost(HeaterItem); }), 'CT_Boost_Countdown');
          } else if (event.newState === 'OFF') { // gone ON->OFF
            // if stppoed here then its by clicking the button so
            // cancel timer   // and turn stuff off
            CT_boost_timer.cancel();
            // items.getItem('CT_Boost').sendCommand('OFF'); // tv
            logger.error('manual....BOOST OFF');
            actions.Voice.say('manually   Stopping BOOST');
            logger.error(`manually stopping BOOST , sending OFF command to HeaterItem.name: ${HeaterItem.name}`);
            HeaterItem.sendCommand('OFF');
          }
        } else {
          logger.error('>BoostItem could not be found - ooooooppps not defined yet????');
        }
      }

      logger.error(`>masterHeatingMode.state.toString() : ${items.getItem('masterHeatingMode').state.toString()}`);
    } catch (e) {
      logger.error(e);
    }
  },
});
