const { myutils } = require('personal');
// var  utils  = require('./utils.js');
// const { showItem } = require('./utils.js');
const logger = log('fan_heater.js');

scriptLoaded = function () {
  logger.warn('scriptLoaded - init ft ct sp link');
  const offset = items.getItem('FH_Link_TrackingOffset').state;
  if (offset === 'NULL') {
    items.getItem('FH_Link_TrackingOffset').sendCommand(0.3);
  }
};

rules.JSRule({
  name: 'Link fan heater setpoint to CT setpoint',
  description: 'Link fan heater setpoint to CT setpoint',
  triggers: [
    triggers.ItemStateChangeTrigger('CT_TemperatureSetpoint'),
    triggers.ItemStateChangeTrigger('CT_Temperature'),
    triggers.ItemStateChangeTrigger('FH_LinkSetpointToCTSetpoint'),
    triggers.ItemStateChangeTrigger('FH_Link_TrackingOffset'),

  ],
  execute: (data) => {
    logger.warn('________Link fan heater setpoint to CT setpoint triggered');
    if (items.getItem('FH_LinkSetpointToCTSetpoint').state === 'ON') {
      // track
      logger.warn('________tracking to CT setpoint');
      // get ct sp and copy to fh sp - offset
      let CT_SP = items.getItem('CT_TemperatureSetpoint').rawState;
      const FH_item = items.getItem('FH_TemperatureSetpoint');

      // add offest
      const offset = items.getItem('FH_Link_TrackingOffset').rawState;
      CT_SP -= offset;
      // copy/track
      FH_item.sendCommand(CT_SP);
    }
  },
});

rules.JSRule({
  name: 'fan heater check',
  description: 'If fan heater check demand turn on fan heater check',
  triggers: [
    // triggers.GroupStateUpdateTrigger('gRoomHeaterStates', 'OFF', 'ON'),
    // triggers.ItemStateChangeTrigger('fan_heater_temperature_sensor'),
    triggers.ItemStateChangeTrigger('FH_Temperature'),
    // triggers.ItemStateChangeTrigger('CT_Temperature'),
    // triggers.ItemStateChangeTrigger('fan_heater_ON_Setpoint'),
    // triggers.ItemStateChangeTrigger('fan_heater_enable'),
    triggers.ItemStateChangeTrigger('FH_TemperatureSetpoint'),
    triggers.ItemStateChangeTrigger('fan_heater_enable'),
  ],
  execute: (data) => {
    const setPoint = items.getItem('FH_TemperatureSetpoint').rawState;
    // console.warn(`________fan_heater_ON_Setpoint: ${setPoint}`);
    const temp = items.getItem('FH_Temperature').rawState;

    if (items.getItem('fan_heater_enable').state === 'ON') {
      // console.warn('_____mvm___PAST THE GATE');
      if (temp < setPoint) {
        items.getItem('FH_Heater').sendCommand('ON');
        // console.warn('>>>>- temp < setPoint turning heater ON');
      } else if (temp >= (setPoint)) { // (items.getItem('CT_Heater').state == 'OFF') && (
        items.getItem('FH_Heater').sendCommand('OFF');
        // console.warn('<<<< -. temp > (setPoint) turning heater OFF');
      } else {
        // console.warn('==== -. temp none of on or off');
      }
    }

    if (items.getItem('fan_heater_enable').state === 'OFF') {
      // console.warn('________items.getItem(fan_heater_enable).state == OFF');
      items.getItem('fan_heater').sendCommand('OFF');
    }
  },
});
