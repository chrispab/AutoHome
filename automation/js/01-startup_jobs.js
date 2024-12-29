const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { alerting } = require('openhab-my-utils');

const ruleUID = 'startup-jobs';
const logger = log(ruleUID);

const setZonesReachableOff = function () {
  logger.info('setZonesReachableOff');
  items.getItem('Zone1Reachable').postUpdate('OFF');
  items.getItem('Zone3Reachable').postUpdate('OFF');
};
scriptLoaded = function () {
  logger.info('script loaded - startup jobs');
  // actions.Audio.playSound('regeneration_cycle_complete_normalised.mp3');
  // actions.Audio.playSound('now_disconnected.mp3');
  actions.Voice.say('restarting');

  alerting.sendEmail('openhab startup', 'startup loaded startup_jobs', logger);

  logger.info('startup loaded startup_jobs - now_disconnected.mp3');

  setZonesReachableOff();
};
