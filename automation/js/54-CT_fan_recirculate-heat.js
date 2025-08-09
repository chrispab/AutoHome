const {
  log, items, rules, actions, triggers, time,
} = require('openhab');
const { utils } = require('openhab-my-utils');

var ruleUID = "heating-fan-reciculate";
const logger = log(ruleUID);


scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
};

// if gHeatingModes, gTemperatureSetpoints ,gThermostatTemperatureAmbients are updated
// figure out if a room heater needs turning on..
rules.JSRule({
  name: 'Check if heat recirc fan should be on',
  description: 'Check if heat recirc fan should be on',
  triggers: [
    triggers.GroupStateUpdateTrigger('gHeatingModes'),
    triggers.GroupStateUpdateTrigger('gThermostatTemperatureSetpoints'),
    triggers.GroupStateUpdateTrigger('gThermostatTemperatureAmbients')
  ],
  execute: (event) => {

    logger.debug('>--------------------------------------------------------------------');
    logger.debug('>Mode, setpoint or temp changed. Do Check if heat recirc fan should be on?');
    logger.debug(`>item: ${event.itemName} triggered event, in group : ${event.groupName}`);

    // get prefix eg FR, CT etc.
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

    logger.debug(`>masterHeatingMode.state : ${items.getItem('masterHeatingMode').state.toString()}`);

      if (items.getItem('Boiler_Control').state.toString() == 'OFF') {
        logger.debug(`>recirc fan: CT_Fan_Heating_circulate_power, > SendCommand to:  recirc fan OFF`);
        items.getItem('CT_Fan_Heating_circulate_power').sendCommand('OFF');
      } else {
        logger.debug(`>recirc fan...Turn CT_Fan_Heating_circulate_power FAN ON`);
        items.getItem('CT_Fan_Heating_circulate_power').sendCommand('ON');
      }
  }
});