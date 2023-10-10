const {
  log, items, rules, actions, triggers, time,
} = require('openhab');

var ruleUID = "heating-fan-reciculate";
const logger = log(ruleUID);


scriptLoaded = function () {
  logger.info('scriptLoaded fan.js');
};

rules.JSRule({
  name: 'conservatory fan circulate heat Cron',
  description: 'conservatory fan circulate heat Cron',
  triggers: [triggers.GenericCronTrigger('0 0/3 * * * ?')],
  execute: () => {
    logger.debug('conservatory fan circulate heat Cron   ZZZZZ');
    const fanOnSecs = 45;
    const setPoint = items.getItem('CT_ThermostatTemperatureSetpoint').state;
    const temp = items.getItem('CT_ThermostatTemperatureAmbient').state;
    // and heater onBoiler_Control
    // if (((setPoint >= 18 && temp < setPoint) || items.getItem('CT_Heater_Control').state.toString() === 'ON') && items.getItem('CT_Fan_Heating_circulate_enable').state.toString() === 'ON') {
    // if (((setPoint >= 18) || items.getItem('CT_Heater_Control').state.toString() === 'ON') && items.getItem('CT_Fan_Heating_circulate_enable').state.toString() === 'ON') {
    if ((items.getItem('Boiler_Control').state.toString() === 'ON') && items.getItem('CT_Fan_Heating_circulate_enable').state.toString() === 'ON') {
      // logger.error('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFfff  conservatory fan circulate heat rulel turn FAN ON NOW   ZZZZZ');
      // items.getItem('CT_fan_power').sendCommand('ON');
      items.getItem('wifi_socket_5_power').sendCommand('ON');

      actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(fanOnSecs), () => {
        // items.getItem('CT_fan_power').sendCommand('OFF');
        items.getItem('wifi_socket_5_power').sendCommand('OFF');
        // items.getItem("FanPulseSwitch").sendCommand("OFF");
        // logger.error('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFfff  conservatory_fan recic heat turn FAN OFF NOW   ');
      });
    }
  },
});
