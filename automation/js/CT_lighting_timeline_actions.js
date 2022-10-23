const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('master-mode-changed');
const { timeUtils } = require('openhab_rules_tools');
const { toToday } = require('openhab_rules_tools/timeUtils');
const { alerting } = require('personal');

// - turn CT lights ON if it is currently dark - REPLACE PREVIOUS 6.30 CRON JOB
rules.JSRule({
  name: 'when CT lights TIMELINE COMES ON(timeline OFF->ON), lights on if dark',
  description: 'when CT lights TIMELINE allow(timeline OFF->ON), lights on if dark',
  triggers: [triggers.ItemStateUpdateTrigger('v_CT_MorningLighting_update_by_timeline', 'OFF', 'ON')],
  execute: () => {
    // logger.warn('__');
    logger.error(`VVVVVVVVV  v_CT_MorningLighting_update_by_timeline: ${items.getItem('v_CT_MorningLighting_update_by_timeline').state}`);

    items.getItem('gConservatoryLights').sendCommand('ON');
    alerting.sendInfo('CT timeline auto lights allow(timeline OFF->ON) - turn On conservatory lights if DARK');

    if (items.getItem('CT_LightDark_State').state === 'OFF') {
      items.getItem('gConservatoryLights').sendCommand('ON');
      alerting.sendInfo('CT timeline auto lights allow(timeline OFF->ON) - turn On conservatory lights if DARK');
    }
  },
});
