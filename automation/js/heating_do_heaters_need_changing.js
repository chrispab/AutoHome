const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('heater change?');
const { countdownTimer, timeUtils, timerMgr } = require('openhab_rules_tools');

let CT_boost_timer;
const boost_minutes = 30 * 60;

let timer;// = null;// = null;
// const tm = new timerMgr.TimerMgr();

function stopIt(HeaterItem) {
  // actions.Voice.say('hello');
  items.getItem('CT_Boost').sendCommand('OFF'); // tv
  logger.warn('....BOOST OFF');
  actions.Voice.say('BOOST OFF');
  HeaterItem.sendCommand('OFF');
  logger.warn(`timer over ... BOOST OFF, sending OFF command to HeaterItem.name: ${HeaterItem.name}`);
}

function boost(command, HeaterItem) {
  if (command === 'ON') {
    actions.Voice.say('....BOOST  ON');
    logger.warn(`BOOST ON, sending ON command to HeaterItem.name: ${HeaterItem.name}`);
    HeaterItem.sendCommand('ON');

    timer = new countdownTimer.CountdownTimer('30m', (() => { stopIt(HeaterItem); }), 'CT_Boost_Countdown');
  }
  if (command === 'OFF') {
    actions.Voice.say('Stopping BOOST');
    logger.warn(`stopping BOOST , sending OFF command to HeaterItem.name: ${HeaterItem.name}`);
    HeaterItem.sendCommand('OFF');
  }
}

// if gHeatingModes, gTemperatureSetpoints ,gRoomTemperatures are updated
// figure out if a room heater needs turning on
rules.JSRule({
  name: 'Check if Heaters need changing etc',
  description: 'Check if Heaters need changing etc',
  triggers: [
    triggers.GroupStateUpdateTrigger('gHeatingModes'),
    triggers.GroupStateUpdateTrigger('gTemperatureSetpoints'),
    triggers.GroupStateUpdateTrigger('gRoomTemperatures'),
    triggers.GroupStateChangeTrigger('gHeaterBoosters', 'OFF', 'ON'), // on edges only
    triggers.GroupStateChangeTrigger('gHeaterBoosters', 'ON', 'OFF'),
  ],
  execute: (event) => {
    console.log(event);
    logger.warn('>Mode, setpoint or temp changed. Do any Heaters need changing etc?');
    let action = 'default';
    // get prefix eg FR, CT etc
    const roomPrefix = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));

    const heatingModeItem = items.getItem(`${roomPrefix}_HeatingMode`);
    logger.warn(`>heatingModeItem.name: ${heatingModeItem.name} : ,  heatingModeItem.state: ${heatingModeItem.state}`);

    const SetpointItem = items.getItem(`${roomPrefix}_TemperatureSetpoint`);
    logger.warn(`>SetpointItem.name: ${SetpointItem.name} : ,  Setpoint.state: ${SetpointItem.state}`);

    const TemperatureItem = items.getItem(`${roomPrefix}_Temperature`);
    logger.warn(`>TemperatureItem.name: ${TemperatureItem.name} : ,  TemperatureItem.state: ${TemperatureItem.state}`);

    const HeaterItem = items.getItem(`${roomPrefix}_Heater`);
    logger.warn(`>HeaterItem.name: ${HeaterItem.name} : ,  HeaterItem.state: ${HeaterItem.state}`);

    const ReachableItem = items.getItem(`${roomPrefix}_RTVReachable`);
    logger.warn(`>ReachableItem.name: ${ReachableItem.name} : ,  ReachableItem.state: ${ReachableItem.state}`);

    // !handle an offline TRV - return
    // dont continue on and update the bolier control if this RTV is Offline
    if (ReachableItem.state.toString() !== 'Online') {
      logger.warn(`>>ZZZZ ReachableItem-Offline - sending OFF, leaving!!!!! : ${roomPrefix} : ,  ReachableItem.state: ${ReachableItem.state}`);
      // turn it off
      HeaterItem.sendCommand('OFF');
      // dont continue on and update the bolier control if this RTV is Offline
      return;
    }

    const BoostItem = items.getItem(`${roomPrefix}_Boost`, true);// return null if missing
    if (BoostItem && (event.itemName === BoostItem.name)) {
      logger.error(`>>>>BoostItem.name: ${BoostItem.name ? BoostItem.name : 'undefined for heater'} : ,  BoostItem.state: ${BoostItem.state ? BoostItem.state : 'Nopt defined'}`);
      if (event.itemName === BoostItem.name) {
        if (BoostItem.state === 'ON') {
          action = 'boostOn';
        } else if (BoostItem.state === 'OFF') {
          action = 'boostOff';
        }
      } else {
        logger.error('>BoostItem could not be found - ooooooppps not defined yet????');
      }
    }

    logger.warn(`>masterHeatingMode.state.toString() : ${items.getItem('masterHeatingMode').state.toString()}`);

    // check if booster has gone fron OFF to ON  or versa (defined by trigger
    // can be boost,
    switch (action) {
      case 'boostOn':
        logger.warn('>BBBBOOOOOOOOSTING');
        boost('ON', HeaterItem);
        return;
        break;

      case 'boostOff':
        logger.warn('>BBBBOOOOOOOOSTING  OFFFFFF');
        boost('OFF', HeaterItem);
        return;
        break;

      default:
        // if its not a boost button triggering rule
        // check if that rooms boost is active - if so leave alone to contin ue
        // boioitsting
        if (BoostItem && BoostItem.state === 'ON' && (event.itemName !== BoostItem.name)) { // if the boostitem exists for thisroom
          // leave well alone this room
          logger.warn('>>...........heater boosting so leave alone');
          return;
        }
        break;
    }

    // if HEATER alowed to be on, check if need to turn on heater
    if (((heatingModeItem.state.toString() === 'auto')) || ((heatingModeItem.state.toString() === 'manual'))) {
      logger.warn(`>>Heater mode is auto or manual : ${heatingModeItem.state.toString()}`);
      const setpoint = SetpointItem.state;
      const turnOnTemp = setpoint; // # - 0.2// calculate the turn on/off temperatures
      const turnOffTemp = setpoint; //  # + 0.1
      const temp = TemperatureItem.state; //  # get the current temperature
      if (temp >= turnOffTemp) {
        logger.warn(`>>>SendCommand to ${roomPrefix}_Heater, HeaterItem OFF`);
        HeaterItem.sendCommand('OFF');
      } else if (temp < turnOnTemp) {
        logger.warn(`>>>SendCommand to: ${roomPrefix}, HeaterItem On`);
        HeaterItem.sendCommand('ON');
      }
    } else if ((heatingModeItem.state.toString() === 'off') || (items.getItem('masterHeatingMode').state.toString() === 'off')) {
      if ((items.getItem('masterHeatingMode').state.toString() === 'off')) {
        logger.warn('>>>ZZZZ---ZZZZ HHH Master Heating Mode is OFF!!!!! :');
      }
      logger.warn(`>>>Turn heater OFF for  ${roomPrefix}  cos its Heating Mode is  ${heatingModeItem.state}`);
      HeaterItem.sendCommand('OFF');
    }
  },
});
