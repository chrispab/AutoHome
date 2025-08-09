/**
 * This script handles tasks that need to be performed on OpenHAB startup.
 *
 * It sets the reachability status of certain zones to OFF, plays a voice message,
 * and sends an email notification indicating the script has loaded.
 */
const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { alerting } = require('openhab-my-utils');

const ruleUID = 'startup-jobs';
const logger = log(ruleUID);

/**
 * Sets the 'Reachable' status of Zone1 and Zone3 items to OFF.
 * This is likely used to indicate that these zones are initially unavailable
 * when OpenHAB starts.
 */
const setZonesReachableOff = function () {
  logger.info('setZonesReachableOff');
  items.getItem('Zone1Reachable').postUpdate('OFF');
  items.getItem('Zone3Reachable').postUpdate('OFF');
};

/**
 * This function is executed when the script is loaded.
 * It performs the following actions:
 * 1. Logs that the script has loaded.
 * 2. Plays a voice message "re starting".
 * 3. Sends an email notification confirming the script's loading.
 * 4. Logs an informational message indicating the script has loaded.
 * 5. Calls the `setZonesReachableOff` function to set the zone reachability statuses.
 */
scriptLoaded = function () {
  logger.info('script loaded - startup jobs');
  actions.Voice.say('re starting');

  alerting.sendEmail('openhab startup', 'startup loaded startup_jobs', logger);

  logger.info('startup loaded startup_jobs - now_disconnected.mp3');

  setZonesReachableOff();
};
