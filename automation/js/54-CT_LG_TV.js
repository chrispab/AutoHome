const {
  log, items, rules, actions, triggers, time,
} = require('openhab');
const { utils } = require('openhab-my-utils');

const ruleUID = 'lg-tv';
const logger = log(ruleUID);

scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
};

// rule - when v_CT_TV_launchBrowser goes from off to on launch the lg tv browser
// when v_CT_TV_launchBrowser goes from on to off do nothing
rules.JSRule({
  name: 'Launch LG TV browser',
  description: 'Launch LG TV browser when v_CT_TV_launchBrowser is turned on',
  triggers: [
    triggers.ItemStateUpdateTrigger('v_CT_TV_launchBrowser', 'ON'),
  ],
  execute: (event) => {
    logger.error('>--------------------------------------------------------------------');
    logger.debug('>v_CT_TV_launchBrowser changed to ON - launch TV browser');
    logger.debug(`>item: ${event.itemName} triggered event, new state : ${event.newState}`);

    const lg_actions = actions.Things.getActions('lgwebos', 'lgwebos:WebOSTV:tv_conservatory');
    if (lg_actions === null) {
      logger.error('Actions not found, check thing ID');
      return;
    }

    // const tvItem = items.getItem('CT_LGWebOS_TV');
    // logger.debug(`>tvItem: ${tvItem.name}, state: ${tvItem.state}`);

    logger.debug('>Sending command LAUNCH_BROWSER to TV');
    // tvItem.sendCommand('LAUNCH_BROWSER');
    lg_actions.launchBrowser('http://192.168.0.101:8080/page/my_overview');

    // reset v_CT_TV_launchBrowser to OFF after launching browser
    time.setTimeout(() => {
      logger.debug('>Resetting v_CT_TV_launchBrowser to OFF');
      items.getItem('v_CT_TV_launchBrowser').sendCommand('OFF');
    }, 5000); // 5 second delay before resetting to OFF
  },
});

// old recirc fan rule kept for reference
// ``
// rules.JSRule({
//   name: 'Check if heat recirc fan should be on',
//   description: 'Check if heat recirc fan should be on',
//   triggers: [
//     triggers.GroupStateUpdateTrigger('gHeatingModes'),
//     triggers.GroupStateUpdateTrigger('gThermostatTemperatureSetpoints'),
//     triggers.GroupStateUpdateTrigger('gThermostatTemperatureAmbients')
//   ],
//   execute: (event) => {

//     logger.debug('>--------------------------------------------------------------------');
//     logger.debug('>Mode, setpoint or temp changed. Do Check if heat recirc fan should be on?');
//     logger.debug(`>item: ${event.itemName} triggered event, in group : ${event.groupName}`);

//     // get prefix eg FR, CT etc.
//     // const roomPrefix = event.itemName.toString().substr(0, event.itemName.indexOf('_'));
//     const roomPrefix = utils.getLocationPrefix(event.itemName, logger);
//     // logger.debug(`>roomPrefix: ${roomPrefix}`);

//     const heatingModeItem = items.getItem(`${roomPrefix}_Heater_Mode`);
//     logger.debug(`>heatingModeItem: ${heatingModeItem.name}, state: ${heatingModeItem.state}`);

//     const setpointItem = items.getItem(`${roomPrefix}_ThermostatTemperatureSetpoint`);
//     logger.debug(`>setpointItem: ${setpointItem.name}, state: ${setpointItem.state}`);

//     const TemperatureItem = items.getItem(`${roomPrefix}_ThermostatTemperatureAmbient`);
//     logger.debug(`>TemperatureItem: ${TemperatureItem.name}, state: ${TemperatureItem.state}`);

//     const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);
//     logger.debug(`>HeaterItem: ${HeaterItem.name}, state: ${HeaterItem.state}`);

//     const ReachableItem = items.getItem(`${roomPrefix}_Heater_Reachable`);
//     logger.debug(`>ReachableItem: ${ReachableItem.name}, state: ${ReachableItem.state}`);

//     logger.debug(`>masterHeatingMode.state : ${items.getItem('masterHeatingMode').state.toString()}`);

//       if (items.getItem('Boiler_Control').state.toString() == 'OFF') {
//         logger.debug(`>recirc fan: CT_Fan_Heating_circulate_power, > SendCommand to:  recirc fan OFF`);
//         items.getItem('CT_Fan_Heating_circulate_power').sendCommand('OFF');
//       } else {
//         logger.debug(`>recirc fan...Turn CT_Fan_Heating_circulate_power FAN ON`);
//         items.getItem('CT_Fan_Heating_circulate_power').sendCommand('ON');
//       }
//   }
// });
