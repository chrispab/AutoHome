const {
  log, items, rules, actions, triggers,
} = require('openhab');

var ruleUID = "ct-lighting-timeline-actions";
const logger = log(ruleUID);

const { alerting } = require('openhab-my-utils');

// - turn CT lights ON if it is currently dark - REPLACE PREVIOUS 6.30 CRON JOB
rules.JSRule({
  name: 'when CT lights TIMELINE COMES ON(timeline OFF->ON), lights on if dark',
  description: 'when CT lights TIMELINE allow(timeline OFF->ON), lights on if dark',
  triggers: [triggers.ItemStateChangeTrigger('v_CT_MorningLighting_update_by_timeline', 'OFF', 'ON')],
  execute: () => {
    // logger.info('__');
    logger.error(`VVVVVVVVV  v_CT_MorningLighting_update_by_timeline: ${items.getItem('v_CT_MorningLighting_update_by_timeline').state}`);

    // items.getItem('gConservatoryLights').sendCommand('ON');
    // alerting.sendEmail('openhab email','CT timeline auto lights allow(timeline OFF->ON) - turn On conservatory lights if DARK');

    if (items.getItem('CT_LightDark_State').state === 'OFF') {
      items.getItem('gConservatoryLights').sendCommand('ON');
      alerting.sendEmail('openhab email','CT timeline auto lights allow(timeline OFF->ON) - turn On conservatory lights if DARK');
    }
  },
});
