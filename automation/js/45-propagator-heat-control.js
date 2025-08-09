const {
    log, items, rules, triggers,
  } = require('openhab');
  const { utils } = require('openhab-my-utils');
  
  var ruleUID = "propagator-heat-control";
  
  const logger = log(ruleUID);
  // log:set DEBUG org.openhab.automation.openhab-js.propagator-heat-control
  // log:set INFO org.openhab.automation.openhab-js.propagator-heat-control
  
  rules.JSRule({
    name: 'Check if prop needs on or off',
    description: 'Check if prop needs on or off',
    triggers: [
    //   triggers.GroupStateUpdateTrigger('gHeatingModes'),
      triggers.ItemStateUpdateTrigger('propagator_TemperatureSetpoint'),
      triggers.ItemStateUpdateTrigger('propagator_TemperatureAmbient')
    ],
    execute: (event) => {
  
      logger.debug('>--------------------------------------------------------------------');
      logger.debug('>Propagator setpoint or temp changed. Does Heater need changing?');
      logger.debug(`>item: ${event.itemName} triggered event`);
  
      // get prefix eg FR, CT etc.
      // const roomPrefix = event.itemName.toString().substr(0, event.itemName.indexOf('_'));
    //   const roomPrefix = utils.getLocationPrefix(event.itemName, logger);
      // logger.debug(`>roomPrefix: ${roomPrefix}`);
  
    //   const heatingModeItem = items.getItem(`${roomPrefix}_Heater_Mode`);
    //   logger.debug(`>heatingModeItem: ${heatingModeItem.name}, state: ${heatingModeItem.state}`);
  
    //   const setpointItem = items.getItem(`${roomPrefix}_ThermostatTemperatureSetpoint`);
      const setpointItem = items.getItem(`propagator_TemperatureSetpoint`);
      logger.debug(`>setpointItem: ${setpointItem.name}, state: ${setpointItem.state}`);
  
    //   const TemperatureItem = items.getItem(`${roomPrefix}_ThermostatTemperatureAmbient`);
      const TemperatureItem = items.getItem(`propagator_TemperatureAmbient`);
      logger.debug(`>TemperatureItem: ${TemperatureItem.name}, state: ${TemperatureItem.state}`);
  
    //   const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);
      const HeaterItem = items.getItem(`propagator_HeaterControl`);
      logger.debug(`>HeaterItem: ${HeaterItem.name}, state: ${HeaterItem.state}`);
  
    //   const ReachableItem = items.getItem(`${roomPrefix}_Heater_Reachable`);
      const ReachableItem = items.getItem(`propagator_HeaterReachable`);
      logger.debug(`>ReachableItem: ${ReachableItem.name}, state: ${ReachableItem.state}`);
  
      // !handle an offline TRV - return
      // !if ANY trvs are unreachable - turn off heater to prevent false demand
      // not just the calling device - which cant call anyway as its offline
      // dont continue on and update the bolier control if this RTV is Offline
      // reachableItemOnlineStatus = ReachableItem.state.toString();
      // if ((reachableItemOnlineStatus !== 'ON') && (reachableItemOnlineStatus !== 'Online')) {
      //   logger.debug(`>ReachableItem-Offline - sending OFF, leaving!: ReachableItem.state: ${ReachableItem.state}`);
      //   // turn it off
      //   HeaterItem.sendCommand('OFF');
      //   // dont continue on and update the bolier control if this RTV is Offline
      //   return;
      // }
  
    //   logger.debug(`>masterHeatingMode.state : ${items.getItem('masterHeatingMode').state.toString()}`);
  
      // if this heater is currently in being boosted, then just l;eave it alone and move on
    //   const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// get boost item for this heater, return null if missing
    //   if (BoostItem && BoostItem.state.toString() === 'ON') {
        // logger.info('>Boosting item: {} == ON. dont process boiler ON/OFF', BoostItem.name);
        // return;
    //   }
      // logger.debug('>no boost item defined for this heater, process as normal');
      // if HEATER alowed to be on, check if need to turn on heater
    //   if (((heatingModeItem.state.toString() === 'auto')) || ((heatingModeItem.state.toString() === 'manual'))) {
        // logger.debug(`>Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()}`);
        const setpoint = setpointItem.rawState;
        const turnOnTemp = setpoint; // # - 0.2// calculate the turn on/off temperatures
        const turnOffTemp = setpoint; //  # + 0.1
        const temp = TemperatureItem.rawState; //  # get the current temperature
  
        if (temp >= turnOffTemp && HeaterItem.state.toString() === 'ON') {
          //if heater on and and temp > sp turn local heater off
          logger.info(`>Heating change. -> SendCommand to: ${HeaterItem}, Heater OFF`);
          HeaterItem.sendCommand('OFF');
        } else if (temp < turnOnTemp && HeaterItem.state.toString() == 'OFF') {
          //if heater off and and temp < sp turn local heater on
          logger.info(`>Heating change...  -> SendCommand to: ${HeaterItem}, Heater ON`);
          HeaterItem.sendCommand('ON');
        } else {
          logger.debug('>no change to local heater reqd - do nothing');
        }
    //   } else if ((heatingModeItem.state.toString() === 'off') || (items.getItem('masterHeatingMode').state.toString() === 'off')) {
    //     //if local heating mode is off or master is off then turn local heater off
    //     if ((items.getItem('masterHeatingMode').state.toString() === 'off')) {
    //       logger.info('>Master Heating Mode is OFF!');
    //     }
    //     logger.info(`>Heating change...Turn ${roomPrefix} heater OFF, :. its Heating Mode is  ${heatingModeItem.state}`);
    //     HeaterItem.sendCommand('OFF');
    //   }
    },
  });
  