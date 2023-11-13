const {
  log, items, rules, actions, triggers, time,
} = require('openhab');
const { utils } = require('openhab-my-utils');

var ruleUID = "heating-fan-reciculate";
const logger = log(ruleUID);


scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
};
const fanOnSecs = 240;
// rules.JSRule({
//   name: 'conservatory fan circulate heat Cron',
//   description: 'conservatory fan circulate heat Cron',
//   triggers: [triggers.GenericCronTrigger('0 0/5 * * * ?')],
//   execute: () => {
//     logger.debug('conservatory fan circulate heat Cron   ZZZZZ');

//     const setPoint = items.getItem('CT_ThermostatTemperatureSetpoint').state;
//     const temp = items.getItem('CT_ThermostatTemperatureAmbient').state;
//     // and heater onBoiler_Control
//     // if (((setPoint >= 18 && temp < setPoint) || items.getItem('CT_Heater_Control').state.toString() === 'ON') && items.getItem('CT_Fan_Heating_circulate_enable').state.toString() === 'ON') {
//     // if (((setPoint >= 18) || items.getItem('CT_Heater_Control').state.toString() === 'ON') && items.getItem('CT_Fan_Heating_circulate_enable').state.toString() === 'ON') {
//     if ((items.getItem('Boiler_Control').state.toString() === 'ON') && items.getItem('CT_Fan_Heating_circulate_enable').state.toString() === 'ON') {
//       // logger.error('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFfff  conservatory fan circulate heat rulel turn FAN ON NOW   ZZZZZ');
//       // items.getItem('CT_fan_power').sendCommand('ON');
//       items.getItem('CT_Fan_Heating_circulate_power').sendCommand('ON');

//       actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(fanOnSecs), () => {
//         // items.getItem('CT_fan_power').sendCommand('OFF');
//         items.getItem('CT_Fan_Heating_circulate_power').sendCommand('OFF');
//         // logger.error('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFfff  conservatory_fan recic heat turn FAN OFF NOW   ');
//       });
//     }
//   },
// });


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

    // if (roomPrefix == "CT") {
    // if (items.getItem('Boiler_Control').state.toString() == "ON") {

      // if (roomPrefix == "CT") {
      // logger.debug(`>Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()}`);
      // const setpoint = setpointItem.rawState;
      // const turnOnTemp = setpoint; // # - 0.2// calculate the turn on/off temperatures
      // const turnOffTemp = setpoint; //  # + 0.1
      // const temp = TemperatureItem.rawState; //  # get the current temperature

      if (items.getItem('Boiler_Control').state.toString() == 'OFF') {
        logger.info(`>recirc fan: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()} -> SendCommand to: ${roomPrefix}, recirc fan OFF`);
        items.getItem('CT_Fan_Heating_circulate_power').sendCommand('OFF');
      } else {
        logger.info(`>recirc fan...Turn ${roomPrefix} FAN ON`);
        items.getItem('CT_Fan_Heating_circulate_power').sendCommand('ON');
      }
      // }
    // }
  }
});