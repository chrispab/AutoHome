const {
  log, items, rules, triggers,
} = require('openhab');
const { utils } = require('openhab-my-utils');

var ruleUID = "heating-heaters-boiler-control";

const logger = log(ruleUID);
// const { CountdownTimer, timeUtils, TimerMgr } = require('openhab_rules_tools');
// log:set DEBUG org.openhab.automation.openhab-js.heating-heaters-boiler-control

// if gHeatingModes, gTemperatureSetpoints ,gThermostatTemperatureAmbients are updated
// figure out if a room heater needs turning on
rules.JSRule({
  name: 'Check if Heaters need changing',
  description: 'Check if Heaters need changing',
  triggers: [
    triggers.GroupStateUpdateTrigger('gHeatingModes'),
    triggers.GroupStateUpdateTrigger('gThermostatTemperatureSetpoints'),
    triggers.GroupStateUpdateTrigger('gThermostatTemperatureAmbients')
  ],
  execute: (event) => {
    logger.debug('>--------------------------------------------------------------------');
    logger.debug('>Mode, setpoint or temp changed. Do any Heaters need . changing etc?');
    logger.debug(`>item: ${event.itemName} triggered event, in group : ${event.groupName}`);

    // get prefix eg FR, CT etc
    // const roomPrefix = event.itemName.toString().substr(0, event.itemName.indexOf('_'));
    const roomPrefix = utils.getLocationPrefix(event.itemName, logger);
    // logger.debug(`>roomPrefix: ${roomPrefix}`);

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
      logger.info(`>ReachableItem-Offline - sending OFF, leaving!!!!! : ${roomPrefix} : ,  ReachableItem.state: ${ReachableItem.state}`);
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
    logger.debug(`>masterHeatingMode.state : ${items.getItem('masterHeatingMode').state.toString()}`);

    // if this heater is currently in being boosted, then just l;eave it alone and move on
    const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// get boost item for this heater, return null if missing
    if (BoostItem && BoostItem.state.toString() === 'ON') {
      logger.info(`>Boosting item == 'ON'-->> BoostItem.name, return from heater routine: ${BoostItem.name}`);
      return;
    }
    logger.debug('>no boost item defined for this heater, process as normal');
    // if HEATER alowed to be on, check if need to turn on heater
    if (((heatingModeItem.state.toString() === 'auto')) || ((heatingModeItem.state.toString() === 'manual'))) {
      logger.debug(`>Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()}`);
      const setpoint = setpointItem.rawState;
      const turnOnTemp = setpoint; // # - 0.2// calculate the turn on/off temperatures
      const turnOffTemp = setpoint; //  # + 0.1
      const temp = TemperatureItem.rawState; //  # get the current temperature
      
      if (temp >= turnOffTemp  && HeaterItem.state.toString()=='ON') {
        //if heater on and and temp > sp turn local heater off
        logger.info(`>Heating change... Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()} -> SendCommand to: ${roomPrefix}, Heater OFF`);
        HeaterItem.sendCommand('OFF');
      } else if (temp < turnOnTemp && HeaterItem.state.toString()=='OFF') {
        //if heater off and and temp < sp turn local heater on
        logger.info(`>Heating change... Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()} -> SendCommand to: ${roomPrefix}, Heater ON`);
        HeaterItem.sendCommand('ON');
      }else{
        logger.debug('>no change to local heater reqd - do nothing');
      }
    } else if ((heatingModeItem.state.toString() === 'off') || (items.getItem('masterHeatingMode').state.toString() === 'off')) {
      //if local heating mode is off or master is off then turn local heater off
      if ((items.getItem('masterHeatingMode').state.toString() === 'off')) {
        logger.info('>Master Heating Mode is OFF!');
      }
      logger.info(`>Heating change...Turn ${roomPrefix} heater OFF, :. its Heating Mode is  ${heatingModeItem.state}`);
      HeaterItem.sendCommand('OFF');
    }
  },
});

rules.JSRule({
  name: 'when any heater states updated to ON, turn Boiler ON else OFF',
  description: 'when any heater states updated, turn Boiler ON else turn boiler OFF',
  triggers: [triggers.GroupStateUpdateTrigger('gHeaterControls')],
  execute: (event) => {
    // logger.warn('A heater state has been updated!, do we turn Boiler ON or turn boiler OFF?');
    // console.log(event);
    // myutils.showEvent(event);
    // logger.debug(`....triggering item : ${event.itemName}`);
    // logger.debug(`....item value : ${event.receivedState}`);
    // logger.debug(`...gAnyRoomHeaterOn: ${items.getItem('gAnyRoomHeaterOn').state}`);
    if (items.getItem('gAnyRoomHeaterOn').state === 'ON') {
      // if boiler off, send on command
      if (items.getItem('Boiler_Control').state.toString() === 'OFF') {
        logger.info(`Boiler -action: ${event.itemName}-(${event.receivedState}), at least 1 heater is ON -> boiler is OFF so sending boiler ON command`);
        items.getItem('Boiler_Control').sendCommand('ON');
      } else {
        logger.debug(`Boiler -no action: ${event.itemName}-(${event.receivedState}), at least 1 heater is ON -> boiler already ON so NOT sending ON command`);
      }
    } else if (items.getItem('Boiler_Control').state.toString() === 'ON') {
      logger.info(`Boiler -action: ${event.itemName}-(${event.receivedState}), all Heaters are OFF -> boiler is ON so sending boiler OFF command`);
      items.getItem('Boiler_Control').sendCommand('OFF');
    } else {
      logger.debug(`Boiler -no action: ${event.itemName}-(${event.receivedState}), all Heaters are OFF -> boiler already OFF so NOT sending OFF command`);
    }
  },
});