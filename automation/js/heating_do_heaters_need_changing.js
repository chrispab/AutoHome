const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('heater change?');
const { countdownTimer, timeUtils, timerMgr } = require('openhab_rules_tools');

// if gHeatingModes, gTemperatureSetpoints ,gRoomTemperatures are updated
// figure out if a room heater needs turning on
rules.JSRule({
  name: 'Check if Heaters need changing etc',
  description: 'Check if Heaters need changing etc',
  triggers: [
    triggers.GroupStateUpdateTrigger('gHeatingModes'),
    triggers.GroupStateUpdateTrigger('gTemperatureSetpoints'),
    triggers.GroupStateUpdateTrigger('gRoomTemperatures'),
    // triggers.GroupStateChangeTrigger('gHeaterBoosters', 'OFF', 'ON'), // on edges only
    // triggers.GroupStateChangeTrigger('gHeaterBoosters', 'ON', 'OFF'),
  ],
  execute: (event) => {
    // console.log(event);
    logger.warn('>Mode, setpoint or temp changed. Do any Heaters need changing etc?');
    const action = 'default';
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

    logger.warn(`>masterHeatingMode.state.toString() : ${items.getItem('masterHeatingMode').state.toString()}`);

    //! add if boost on - skip
    // if this heater is currently in being boosted, then just l;eave it alone and move on
    const BoostItem = items.getItem(`${roomPrefix}_Boost`, true);// get boost item for this heater, return null if missing
    if (BoostItem && BoostItem.state.toString() === 'ON') {
      logger.error(`...........................>>>>Boosting item -->> BoostItem.name, return from heater routine: ${BoostItem.name}`);
      if (BoostItem.state === 'ON') { // in a boost period
        return;
      }
    }
    logger.error('>>>>no boost item defined for this heater, process as normal');
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
