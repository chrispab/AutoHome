const email = 'cbattisson@gmail.com';

const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { alerting } = require('openhab-my-utils');
var ruleUID = "startup-jobs";
const logger = log(ruleUID);

setZonesReachableOff = function () {
  logger.info('setZonesReachableOff');
  items.getItem('Zone1Reachable').postUpdate('OFF');
  items.getItem('Zone3Reachable').postUpdate('OFF');
};

scriptLoaded = function () {
  logger.info('script loaded - startup jobs');
  // actions.Audio.playSound('regeneration_cycle_complete_normalised.mp3');
  actions.Audio.playSound('now_disconnected.mp3');
  // alerting.sendInfo('startup xscript loaded zzz_startup_jobs');
  alerting.sendEmail('openhab startup', 'startup xscript loaded zzz_startup_jobs',logger);

  logger.info('startup xscript loaded zzz_startup_jobs- now_disconnected.mp3');
  setZonesReachableOff();
};


rules.JSRule({
  name: 'SystemStartlevelTrigger_70',
  description: 'SystemStartlevelTrigger(70)',
  // triggers: [triggers.SystemStartlevelTrigger(100)],
  triggers: [triggers.SystemStartlevelTrigger(50)],
  execute: () => {
    // actions.Audio.playSound('0600_hours_regeneration_cycle_complete_normalised.mp3');
    actions.Audio.playSound('barking.mp3');
    // alerting.sendInfo('triggers.SystemStartlevelTrigger(70)');
    alerting.sendEmail('openhab startup 70', 'triggers.SystemStartlevelTrigger(70)',logger);

    logger.info('triggers.SystemStartlevelTrigger(70) barking.mp3');
  },
});

rules.JSRule({
  name: 'SystemStartlevelTrigger_100',
  description: 'SystemStartlevelTrigger(100)',
  // triggers: [triggers.SystemStartlevelTrigger(100)],
  triggers: [triggers.SystemStartlevelTrigger(100)],
  execute: () => {
    // actions.Audio.playSound('0600_hours_regeneration_cycle_complete_normalised.mp3');
    actions.Audio.playSound('61 Transporter Materialization.mp3');
    // alerting.sendInfo('triggers.SystemStartlevelTrigger(100)');
    alerting.sendEmail('openhab startup 100', 'triggers.SystemStartlevelTrigger(100)',logger);

    logger.info('triggers.SystemStartlevelTrigger(100) 61 Transporter Materialization.mp3');
  },
});
