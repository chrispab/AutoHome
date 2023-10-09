const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
// var  utils  = require('./utils.js');
// const { showItem } = require('./utils.js');
const logger = log('fan_heater');

scriptLoaded = function () {
  logger.info('scriptLoaded - init ft ct sp link');
  const offset = items.getItem('FH_Link_TrackingOffset').state;
  if (offset === 'NULL') {
    items.getItem('FH_Link_TrackingOffset').sendCommand(1.0);
  }
};

rules.JSRule({
  name: 'Link fan heater setpoint to CT setpoint',
  description: 'Link fan heater setpoint to CT setpoint',
  triggers: [
    triggers.ItemStateChangeTrigger('CT_ThermostatTemperatureSetpoint'),
    triggers.ItemStateChangeTrigger('CT_ThermostatTemperatureAmbient'),
    triggers.ItemStateChangeTrigger('FH_LinkSetpointToCTSetpoint'),
    triggers.ItemStateChangeTrigger('FH_Link_TrackingOffset'),

  ],
  execute: (data) => {
    logger.debug('________Link fan heater setpoint to CT setpoint triggered');
    if (items.getItem('FH_LinkSetpointToCTSetpoint').state === 'ON') {
      // track
      logger.debug('________tracking to CT setpoint');
      // get ct sp and copy to fh sp - offset
      let CT_SP = items.getItem('CT_ThermostatTemperatureSetpoint').rawState;
      const FH_ThermostatTemperatureSetpoint_item = items.getItem('FH_ThermostatTemperatureSetpoint');

      // add offest
      const offset = items.getItem('FH_Link_TrackingOffset').rawState;
      CT_SP -= offset;
      // copy/track
      FH_ThermostatTemperatureSetpoint_item.sendCommand(CT_SP);
    }
  },
});

rules.JSRule({
  name: 'fan heater check',
  description: 'If fan heater demand turn on fan heater',
  triggers: [
    // triggers.ItemStateChangeTrigger('fan_heater_temperature_sensor'),
    triggers.ItemStateChangeTrigger('FH_ThermostatTemperatureAmbient'),
    // triggers.ItemStateChangeTrigger('CT_Temperature'),
    // triggers.ItemStateChangeTrigger('fan_heater_ON_Setpoint'),
    // triggers.ItemStateChangeTrigger('FH_enable'),
    triggers.ItemStateChangeTrigger('FH_ThermostatTemperatureSetpoint'),
    triggers.ItemStateChangeTrigger('FH_enable'),
    triggers.ItemStateChangeTrigger('FH_outside_temperature_enable'),

  ],
  execute: (data) => {
    logger.debug('________If fan heater demand turn on fan heater');

    if (items.getItem('FH_enable').state.toString() === 'OFF') {
      logger.debug('________items.getItem(FH_enable).state == OFF');
      items.getItem('fan_heater').sendCommand('OFF');
      return;
    }

    if (items.getItem('FH_enable').state.toString() === 'ON') {
      // console.error('######################################################_____mvm___PAST THE GATE');
      if ((items.getItem('Outside_Temperature').rawState <= items.getItem('FH_outside_temperature_enable').rawState)) {
        const setPoint = items.getItem('FH_ThermostatTemperatureSetpoint').rawState;
        logger.debug(`________FH_ThermostatTemperatureSetpoint: ${setPoint}`);
        const temp = items.getItem('FH_ThermostatTemperatureAmbient').rawState;

        if (temp < setPoint) {
          items.getItem('FH_Heater_Control').sendCommand('ON');
          logger.debug('>>>>- temp < setPoint turning heater ON');
        } else if (temp >= (setPoint)) { // (items.getItem('CT_Heater_Control').state == 'OFF') && (
          items.getItem('FH_Heater_Control').sendCommand('OFF');
          logger.debug('<<<< -. temp > (setPoint) turning heater OFF');
        } else {
          // console.warn('==== -. temp none of on or off');
        }
      } else {
        items.getItem('FH_Heater_Control').sendCommand('OFF');
      }
    } else {
      logger.debug('NOT_____mvm___PAST THE GATE');
    }
  },
});
