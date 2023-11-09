const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
var ruleUID = "fan_heater";
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.fan_heater
// log:set INFO org.openhab.automation.openhab-js.fan_heater

scriptLoaded = function () {
  logger.info('scriptLoaded - init ft ct sp link');
  const tracking_offset = items.getItem('FH_Link_TrackingOffset').state;
  if (tracking_offset === 'NULL') {
    items.getItem('FH_Link_TrackingOffset').sendCommand(2.0);
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
    logger.debug('Link fan heater setpoint to CT setpoint triggered');
    if (items.getItem('FH_LinkSetpointToCTSetpoint').state === 'ON') {

      logger.debug('tracking to CT setpoint');
      // get ct setpoint and copy to fh setpoint - tracking_offset
      var CT_ThermostatTemperatureSetpoint_raw = items.getItem('CT_ThermostatTemperatureSetpoint').rawState;
      var FH_ThermostatTemperatureSetpoint_item = items.getItem('FH_ThermostatTemperatureSetpoint');

      // add offest
      var tracking_offset = items.getItem('FH_Link_TrackingOffset').rawState;
      var new_FH_ThermostatTemperatureSetpoint = CT_ThermostatTemperatureSetpoint_raw - tracking_offset;
      // copy/track
      FH_ThermostatTemperatureSetpoint_item.sendCommand(new_FH_ThermostatTemperatureSetpoint);
    }
  },
});

rules.JSRule({
  name: 'check for fan heater demand',
  description: 'If fan heater demand turn on fan heater',
  triggers: [
    triggers.ItemStateChangeTrigger('FH_ThermostatTemperatureAmbient'),
    // triggers.ItemStateChangeTrigger('fan_heater_ON_Setpoint'),
    triggers.ItemStateChangeTrigger('FH_ThermostatTemperatureSetpoint'),
    triggers.ItemStateChangeTrigger('FH_Heater_Enable'),
    triggers.ItemStateChangeTrigger('FH_outside_temperature_enable'),
  ],
  execute: (data) => {
    logger.debug('If fan heater demand turn on fan heater');

    FH_Heater_Enable_Item_State =items.getItem('FH_Heater_Enable').state.toString();

    //dont process further if fan heater disabled
    if (FH_Heater_Enable_Item_State === 'OFF') {
      logger.debug('FH_Heater_Enable_Item_State === {}', FH_Heater_Enable_Item_State);
      items.getItem('FH_Heater_Control').sendCommand('OFF');
      logger.debug('FH_Heater_Control.sendCommand(OFF), and exit from - If fan heater demand turn on fan heater');
      return;
    }

    //if fan heater enable = ON, process
    if (FH_Heater_Enable_Item_State === 'ON') {
      logger.debug('FH_Heater_Enable_Item_State === {}', FH_Heater_Enable_Item_State);

      //if outside current_room_temp < fan heater outside temp enable - go
      var Outside_Temperature_raw =items.getItem('Outside_Temperature').rawState;
      var FH_outside_temperature_enable_raw= items.getItem('FH_outside_temperature_enable').rawState

      if ((Outside_Temperature_raw <= FH_outside_temperature_enable_raw)) {
        var FH_Thermostat_SetPoint = items.getItem('FH_ThermostatTemperatureSetpoint').rawState;
        logger.debug('FH_ThermostatTemperatureSetpoint: {}', FH_Thermostat_SetPoint);
        var current_room_temp = items.getItem('FH_ThermostatTemperatureAmbient').rawState;
        logger.debug('current_room_temp: {},', FH_Thermostat_SetPoint);

        if (current_room_temp < FH_Thermostat_SetPoint) {
          items.getItem('FH_Heater_Control').sendCommand('ON');
          logger.debug('current_room_temp < FH_Thermostat_SetPoint turning heater ON');
        } else if (current_room_temp >= (FH_Thermostat_SetPoint)) {
          items.getItem('FH_Heater_Control').sendCommand('OFF');
          logger.debug('current_room_temp > (FH_Thermostat_SetPoint) turning heater OFF');
        }
      } else {
        items.getItem('FH_Heater_Control').sendCommand('OFF');
        logger.debug('Outside_Temperature_raw:{} > FH_outside_temperature_enable:{}: {}', Outside_Temperature_raw, FH_outside_temperature_enable_raw);
        logger.debug('FH_Heater_Control.sendCommand:{}', 'OFF');
      }
    }
  },
});
