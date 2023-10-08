const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { myutils } = require('personal');

var ruleUID = "heating_change";

const logger = log(ruleUID);
const { CountdownTimer, timeUtils, TimerMgr } = require('openhab_rules_tools');
// openhab> log:set DEBUG org.openhab.automation.openhab-js.zb1_pir

// if gHeatingModes, gTemperatureSetpoints ,gThermostatTemperatureAmbients are updated
// figure out if a room heater needs turning on
rules.JSRule({
  name: 'Check if Heaters need changing etc',
  description: 'Check if Heaters need changing etc',
  triggers: [
    triggers.GroupStateUpdateTrigger('gHeatingModes'),
    triggers.GroupStateUpdateTrigger('gThermostatTemperatureSetpoints'),
    triggers.GroupStateUpdateTrigger('gThermostatTemperatureAmbients'),
    // triggers.GroupStateUpdateTrigger('gThermostatModes'),
    // triggers.GroupStateChangeTrigger('gHeaterBoosters', 'OFF', 'ON'), // on edges only
    // triggers.GroupStateChangeTrigger('gHeaterBoosters', 'ON', 'OFF'),
  ],
  execute: (event) => {
    // console.log(event);
    logger.debug('>Mode, setpoint or temp changed. Do any Heaters need . changing etc?');
    // const action = 'default';
    // get prefix eg FR, CT etc
    const roomPrefix = event.itemName.toString().substr(0, event.itemName.indexOf('_'));
    logger.debug(`>roomPrefix: ${roomPrefix}`);

    const heatingModeItem = items.getItem(`${roomPrefix}_Heater_Mode`);
    logger.debug(`>heatingModeItem: ${heatingModeItem.name}, state: ${heatingModeItem.state}`);

    const setpointItem = items.getItem(`${roomPrefix}_ThermostatTemperatureSetpoint`);
    logger.debug(`>setpointItem: ${setpointItem.name}, state: ${setpointItem.state}`);

    const TemperatureItem = items.getItem(`${roomPrefix}_ThermostatTemperatureAmbient`);
    logger.debug(`>TemperatureItem: ${TemperatureItem.name}, state: ${TemperatureItem.state}`);

    const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);
    logger.debug(`>HeaterItem: ${HeaterItem.name}, state: ${HeaterItem.state}`);

    const ReachableItem = items.getItem(`${roomPrefix}_Heater_Reachable`);
    logger.debug(`>ReachableItem: ${ReachableItem.name}, state: ${ReachableItem.state}`);

    // !handle an offline TRV - return
    // !if ANY trvs are unreachable - turn off heater to prevent false demand
    // not just the calling device - which cant call anyway as its offline
    // dont continue on and update the bolier control if this RTV is Offline
    if (ReachableItem.state.toString() !== 'Online') {
      logger.info(`>>ZZZZ ReachableItem-Offline - sending OFF, leaving!!!!! : ${roomPrefix} : ,  ReachableItem.state: ${ReachableItem.state}`);
      // turn it off
      HeaterItem.sendCommand('OFF');
      //===============================================
      // items.getItem('HL_Heater_Control').sendCommand('OFF');//!
      //=================================================
      // dont continue on and update the bolier control if this RTV is Offline
      return;
    }
    //-------------------------------------------------------
    // items.getItem('HL_Heater_Control').sendCommand('OFF');//!
    //-----------------------------------------------------------
    logger.debug(`>masterHeatingMode.state.toString() : ${items.getItem('masterHeatingMode').state.toString()}`);

    // if this heater is currently in being boosted, then just l;eave it alone and move on
    const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// get boost item for this heater, return null if missing
    if (BoostItem && BoostItem.state.toString() === 'ON') {
      logger.info(`>>>>Boosting item == 'ON'-->> BoostItem.name, return from heater routine: ${BoostItem.name}`);
      // if (BoostItem.state === 'ON') { // in a boost period
        return;
      // }
    }
    // logger.debug('>>>>no boost item defined for this heater, process as normal');
    // if HEATER alowed to be on, check if need to turn on heater
    if (((heatingModeItem.state.toString() === 'auto')) || ((heatingModeItem.state.toString() === 'manual'))) {
      logger.debug(`>>Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()}`);
      const setpoint = setpointItem.rawState;
      const turnOnTemp = setpoint; // # - 0.2// calculate the turn on/off temperatures
      const turnOffTemp = setpoint; //  # + 0.1
      const temp = TemperatureItem.rawState; //  # get the current temperature
      if (temp >= turnOffTemp  && HeaterItem.state.toString()=='ON') {
        logger.info(`Heating change... Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()} -> SendCommand to: ${roomPrefix}, Heater OFF`);
        HeaterItem.sendCommand('OFF');
      } else if (temp < turnOnTemp && HeaterItem.state.toString()=='OFF') {
        logger.info(`Heating change... Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()} -> SendCommand to: ${roomPrefix}, Heater ON`);
        HeaterItem.sendCommand('ON');
      }
    } else if ((heatingModeItem.state.toString() === 'off') || (items.getItem('masterHeatingMode').state.toString() === 'off')) {
      if ((items.getItem('masterHeatingMode').state.toString() === 'off')) {
        logger.info('Heating change... Master Heating Mode is OFF!');
      }
      logger.info(`Heating change...Turn ${roomPrefix} heater OFF, :. its Heating Mode is  ${heatingModeItem.state}`);
      HeaterItem.sendCommand('OFF');
    }
  },
});
