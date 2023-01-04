const {
  log, items, rules, actions, triggers, time,
} = require('openhab');
// const { myutils } = require('personal');

const logger = log('CT_heating_fan_cooling.js');
// const { timeUtils } = require('openhab_rules_tools');
// const { toToday } = require('openhab_rules_tools/timeUtils');

scriptLoaded = function () {
  logger.warn('scriptLoaded fCT_heating_fan_cooling.js');
  // let loadedDate = Date.now();
};

rules.JSRule({
  name: 'conservatory fan_cool rule',
  description: 'check if cooling fan is required to go ON',
  triggers: [
    triggers.ItemStateChangeTrigger('CT_Temperature'),
    triggers.ItemStateChangeTrigger('Conservatory_Fan_ON_Setpoint'),
    triggers.ItemStateChangeTrigger('CT_Fan_Cooling_enable'),
  ],

  execute: (data) => {
    logger.debug('conservatory_fan_ cool rulel - check if cooling fan reqd');

    // var { alerting } = require('personal');
    // alerting.sendInfo('FROM fan OPENHABvv');
    // alerting.sendAlert('The following Chromecast devices are now in use');

    if (items.getItem('CT_Fan_Cooling_enable').state.toString() === 'ON') {
      logger.debug('conservatory_fan_ cool rulel - detected CT_Fan_Cooling_enable   ON');
      const setPoint = items.getItem('Conservatory_Fan_ON_Setpoint').state;
      const temp = items.getItem('CT_Temperature').state;
      if (items.getItem('CT_Heater') != 'ON') {
        if (temp >= setPoint) {
          items.getItem('CT_fan_power').sendCommand('ON');
          logger.debug('>>>> Conservatory_fan_ cool rulel turning fan ON');
        }
        if (temp < setPoint) {
          items.getItem('CT_fan_power').sendCommand('OFF');
          logger.debug('>>>> Conservatory_fan_ cool rulel turning fan off');
        }
      }
    }
  },
});

rules.JSRule({
  name: 'Fan cooling  ENABLE turned ON',
  description: 'Fan cooling  ENABLE turned ON',
  triggers: [triggers.ItemStateChangeTrigger('CT_Fan_Cooling_enable', 'OFF', 'ON')],
  execute: (data) => {
    logger.debug('conservatory_fan_cool_recirc_on - no action required');
  },
});

rules.JSRule({
  name: 'Fan cooling  ENABLE turned OFF',
  description: 'Fan cooling  ENABLE turned OFF',
  triggers: [triggers.ItemStateChangeTrigger('CT_Fan_Cooling_enable', 'ON', 'OFF')],
  execute: (data) => {
    logger.debug('conservatory_fan_cool_recirc_off - - CT_fan_power OFF');
    items.getItem('CT_fan_power').sendCommand('OFF');
  },
});

rules.JSRule({
  name: 'Fan Pulse (FanPulseSwitch) off to on',
  description: 'Fan Pulse (FanPulseSwitch) change/update',
  triggers: [triggers.ItemStateChangeTrigger('FanPulseSwitch', 'OFF', 'ON')],
  execute: (data) => {
    logger.error('fan pulse CT_fan_power ON');
    items.getItem('CT_fan_power').sendCommand('ON');
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(10), () => {
      items.getItem('CT_fan_power').sendCommand('OFF');
      items.getItem('FanPulseSwitch').sendCommand('OFF');
      logger.debug('fan pulse CT_fan_power OFF');
    });
  },
});
