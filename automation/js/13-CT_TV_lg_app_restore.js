const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { alerting, utils } = require('openhab-my-utils');

const ruleUID = 'lg_tv';
const logger = log(ruleUID);

// Logging configuration (use in openHAB console if needed)
// log:set DEBUG org.openhab.automation.openhab-js.lg_tv
// log:set INFO org.openhab.automation.openhab-js.lg-tv
// log:set debug org.openhab.binding.lgwebos
// log:set INFO org.openhab.binding.lgwebos

// Function executed when the script is loaded
scriptLoaded = function scriptLoaded() {
  logger.info('LG TV App Restore script loaded - System started.');
  // actions.Voice.say('TV'); // Example of an action you could uncomment
};

// Rule 1: Track App Changes
rules.JSRule({
  name: 'TV: Keep track of app changes',
  description: 'Tracks the currently running app on the LG TV and stores it as the last used app.',
  triggers: [triggers.GroupStateChangeTrigger('gTVApplication')],
  execute: (event) => {
    try {
      // Ensure the required items are available
      if (!items.getItem('CT_TV_Application') || !items.getItem('CT_TV_Power') || !items.getItem('CT_TV_LastApp')) {
        const errorMessage = 'Rule \'TV: Keep track of app changes\' could not run. Missing openHAB items. Check the logs for details.';
        logger.error(errorMessage);
        alerting.sendEmail('OpenHAB Error', errorMessage); // Send email alert
        return; // Exit the rule if items are missing
      }

      logger.debug(
        `1. App Change Detected: Current CT_TV_Application state: ${items.getItem('CT_TV_Application').state}`,
      );
      utils.showEvent(event, logger); // Log details about the triggering event

      // Only track app changes if the TV is ON
      if (items.getItem('CT_TV_Power').state === 'ON') {
        const appName = event.newState;
        logger.debug(`2. New appName detected: ${appName}`);

        // Ignore undefined or HDMI2 as these are not considered valid 'last apps'
        if (appName === undefined) {
          logger.debug('3. App change ignored: appName is undefined.');
        } else if (appName === 'com.webos.app.hdmi2') {
          logger.debug('3. App change ignored: appName is HDMI2 input.');
        } else if (items.getItem('CT_TV_LastApp').state !== appName) {
          // Send command only if the state has changed
          items.getItem('CT_TV_LastApp').sendCommand(appName);
          logger.info(`4. Stored new last app: ${appName}`);
        } else {
          logger.debug('4. App not stored. App is the same as the current value.');
        }
      } else {
        logger.debug('App change ignored: TV is OFF.');
      }
    } catch (err) {
      const errorMessage = `Error in 'TV: Keep track of app changes': ${err}`;
      logger.error(errorMessage);
      alerting.sendEmail('OpenHAB Error', errorMessage); // Send email alert
    }
  },
});

const restoreTimer = 20; // Seconds to wait before restoring the app

// Rule 2: Restore Last App
rules.JSRule({
  name: 'TV: Restore Last App',
  description: 'Restores the last used app on the LG TV when it powers on.',
  triggers: [triggers.ItemStateChangeTrigger('CT_TV_Power', 'OFF', 'ON')],
  execute: (event) => {
    try {
      // Ensure the required items are available
      if (!items.getItem('CT_TV_Application') || !items.getItem('CT_TV_Power') || !items.getItem('CT_TV_LastApp')) {
        const errorMessage = 'Rule \'TV: Restore Last App\' could not run. Missing openHAB items. Check the logs for details.';
        logger.error(errorMessage);
        alerting.sendEmail('OpenHAB Error', errorMessage); // Send email alert
        return; // Exit the rule if items are missing
      }

      logger.info('0--TV-Restore Triggered: TV power changed from OFF to ON.');
      utils.showEvent(event, logger);
      logger.debug(`1--TV-Restore: Triggering item: ${event.itemName}`);

      const appName = items.getItem('CT_TV_LastApp').state;
      logger.debug(`2--TV-Restore: Last app retrieved from CT_TV_LastApp: ${appName}`);

      // Wait for the TV to fully boot before attempting to launch an app
      logger.info(`2--TV-Restore: Starting timer, waiting ${restoreTimer} seconds...`);
      actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(restoreTimer), () => {
        logger.debug(`3--TV-Restore: Timer elapsed. Attempting to restore app: ${appName}`);

        // Determine which app to launch
        let appToLaunch;
        if (appName === undefined) {
          appToLaunch = 'com.webos.app.home'; // Default to home screen if no last app
          logger.info('4--TV-Restore: No last app stored. Setting default app: TV Home.');
        } else {
          appToLaunch = appName;
          logger.info(`4--TV-Restore: Restoring last app: ${appToLaunch}`);
        }
        // Send command only if the state has changed
        if (items.getItem('CT_TV_Application').state !== appToLaunch) {
          // const commandResult = items.getItem('CT_TV_Application').sendCommand(appToLaunch);
          items.getItem('CT_TV_Application').sendCommand(appToLaunch);
          // if (commandResult) {
          //   logger.info('5--TV-Restore: App Launched.');
          // } else {
          //   const errorMessage = `5--TV-Restore: App Launch failed for: ${appToLaunch}`;
          //   logger.error(errorMessage);
          //   alerting.sendEmail('OpenHAB Error', errorMessage); // Send email alert
          // }
        } else {
          logger.info('5--TV-Restore: No app launched. App is the same as the current value.');
        }
      });
    } catch (err) {
      const errorMessage = `Error in 'TV: Restore Last App': ${err}`;
      logger.error(errorMessage);
      alerting.sendEmail('OpenHAB Error', errorMessage); // Send email alert
    }
  },
});
