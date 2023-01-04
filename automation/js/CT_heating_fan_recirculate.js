const {
  log, items, rules, actions, triggers, time,
} = require('openhab');
// const { myutils } = require('personal');

const logger = log('CT_heating_fan_recirculate.js');
// const { timeUtils } = require('openhab_rules_tools');
// const { toToday } = require('openhab_rules_tools/timeUtils');

scriptLoaded = function () {
  logger.warn('scriptLoaded fan.js');
};

rules.JSRule({
  name: 'conservatory fan circulate heat Cron',
  description: 'conservatory fan circulate heat Cron',
  triggers: [triggers.GenericCronTrigger('0 0/5 * * * ?')],
  execute: () => {
    logger.debug('ZZZZZ  conservatory fan circulate heat Cron   ZZZZZ');
    const fanOnSecs = 120;
    const setPoint = items.getItem('CT_TemperatureSetpoint').state;
    const temp = items.getItem('CT_Temperature').state;
    // and heater on
    if (((setPoint >= 18 && temp < setPoint) || items.getItem('CT_Heater').state.toString() === 'ON') && items.getItem('CT_Fan_Heating_circulate_enable').state.toString() === 'ON') {
      logger.error('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFfff  conservatory fan circulate heat rulel turn FAN ON NOW   ZZZZZ');
      items.getItem('CT_fan_power').sendCommand('ON');

      actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(fanOnSecs), () => {
        items.getItem('CT_fan_power').sendCommand('OFF');
        // items.getItem("FanPulseSwitch").sendCommand("OFF");
        logger.error('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFfff  conservatory_fan recic heat turn FAN OFF NOW   ');
      });
    }
  },
});

rules.JSRule({
  name: 'Fan heat recirc ENABLE turned ON',
  description: 'Fan heat recirc ENABLE turned ON',
  triggers: [triggers.ItemStateChangeTrigger('CT_Fan_Heating_circulate_enable', 'OFF', 'ON')],
  execute: (data) => {
    logger.debug('conservatory_fan_heat_recirc_on - no action required');
  },
});

rules.JSRule({
  name: 'Fan heat recirc ENABLE turned off',
  description: 'Fan heat recirc ENABLE turned off',
  triggers: [triggers.ItemStateChangeTrigger('CT_Fan_Heating_circulate_enable', 'ON', 'OFF')],
  execute: (data) => {
    logger.debug('conservatory_fan_heat_recirc_off - CT_fan_power OFF');
    items.getItem('CT_fan_power').sendCommand('OFF');
  },
});
