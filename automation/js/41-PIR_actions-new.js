/**
 * @file This script manages PIR sensor-based lighting automation in openHAB.
 * It reads sensor and light configurations from a JSON file, and creates rules
 * to turn lights on when motion is detected and off after a delay when motion stops  .
 */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable max-len */
const {
  log, items, rules, triggers, actions,
} = require('openhab');

const { TimerMgr } = require('openhab_rules_tools');
// const { configClasses } = require('openhab-my-utils');

const ruleUID = 'pir_testing';
const logger = log(ruleUID);

// log:set warn org.openhab.automation.openhab-js.pir_action
// log:set DEBUG org.openhab.automation.openhab-js.pir_testing

// Initialize a timer manager from the cache or create a new one.
const timerMgr = cache.private.get('timerMgr', () => new TimerMgr());

// note: using relative path from automation/js folder, but requires two dots to go up one level to automation folder. should really be just one dot?
// const sensorData = require('../41-pir_sensor_light_setup_data.json');

const { lightConfigs: lightConfigsData, pirSensorConfigs: pirSensorConfigsData } = require('../41-pir_sensor_light_setup_data.js');

// Import configuration classes .
logger.debug('Importing LightConfig and PirSensorConfig from 41-PIR-sensor-light-classes.js');
const { LightConfig, PirSensorConfig } = require('../41-PIR-sensor-light-classes.js');

// Create instances of light configurations from the loaded sensor data.
const lightConfigs = lightConfigsData.map(
  (lcData) => new LightConfig(
    lcData.name,
    lcData.location,
    lcData.lightControlItemName,
    lcData.lightOffDelayTimerDurationItemName,
    lcData.defaultLightOffDelayTimerDurationSecs,
  ),
);

// Create a map for efficient lookup of light configurations by name.
const lightConfigsMap = new Map(lightConfigs.map((config) => [config.name, config]));

// Create instances of PIR sensor configurations from the loaded sensor data.
const PirSensorConfigs = pirSensorConfigsData.map(
  (data) => new PirSensorConfig(
    data.name,
    data.location,
    data.friendlyName,
    data.occupancySensorItemName,
    data.lightLevelActiveThresholdItemName,
    data.lightLevelSensorItemName,
    data.phrases,
    data.lightConfigNames,
  ),
);

/**
 * Function executed when the script is loaded.
 */
scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
  // eslint-disable-next-line no-use-before-define
  logger.debug('>scriptLoaded PirSensorConfigs: {}', JSON.stringify(PirSensorConfigs));

  logger.debug('>scriptLoaded lightConfigs: {}', JSON.stringify(lightConfigs));
};

/**
 * Generates a unique timer key for a light associated with a PIR sensor.
 * @param {string} triggeringItemName - The name of the occupancy sensor item that triggered the event.
 * @param {string} lightConfigName - The name of the light configuration.
 * @param {number} index - The index of the light configuration in the sensor's array.
 * @returns {string} A unique key for the timer.
 */
function genTimerKey(triggeringItemName, lightConfigName, index) {
  return `${triggeringItemName}_${lightConfigName}_light_${index}`;
}

// --- Rule Logic ---

/**
 * A factory function that creates a rule handler for occupancy events.
 * This abstracts the common logic of identifying the triggering sensor.
 * @param {function} ruleLogic - The specific logic to execute for the rule (e.g., handleOccupancyOn or handleOccupancyOnToOff).
 * @returns {function} An event handler function for a JSRule.
 */
const createOccupancyRuleHandler = (ruleLogic) => (event) => {
  try {
    const triggeringItemName = event.itemName.toString();
    const item = items.getItem(triggeringItemName);
    if (!item) {
      logger.warn(`Item ${triggeringItemName} not found!`);
      return;
    }

    const activePirSensorConfig = PirSensorConfigs.find(
      (sensorConfig) => sensorConfig.occupancySensorItemName === triggeringItemName,
    );

    if (!activePirSensorConfig) {
      logger.warn(`No PirSensorConfig found for item: ${triggeringItemName}`);
      return;
    }

    // Call the specific logic for the rule
    ruleLogic(event, activePirSensorConfig, triggeringItemName);
  } catch (e) {
    logger.error(`Error in occupancy rule handler: ${e.message}\n${e.stack}`);
  }
};

/**
 * Handles the logic when an occupancy sensor state updates as 'ON'.
 * @param {object} event - The event object from the rule trigger.
 * @param {PirSensorConfig} activePirSensorConfig - The configuration for the triggered sensor.
 * @param {string} triggeringItemName - The name of the item that triggered the rule.
 */
const handleOccupancyOn = (event, activePirSensorConfig, triggeringItemName) => {
  logger.debug('1 PIR ON ..activePirSensorConfig is: {} - {}', activePirSensorConfig.friendlyName, activePirSensorConfig.occupancySensorItemName);
  // log event details
  logger.debug('2 PIR ON Event details: {}', JSON.stringify(event));

  // logger.debug('----dumpObject({}', utils.dumpObject(event));
  // if its a change type event, it must be initial off->on, so we can say the phrase, else its an update type event
  if (event.eventType === 'change') {
    logger.debug('3 PIR ON - detected OFF->ON transition for item: {}', triggeringItemName);
    // announce phrase if any are configured
    if (activePirSensorConfig.phrases.length > 0) {
      const phrase = activePirSensorConfig.phrases[Math.floor(Math.random() * activePirSensorConfig.phrases.length)];
      logger.debug('4 PIR ON - saying phrase: {}', phrase);
      actions.Voice.say(phrase);
    }
  } else {
    logger.debug('5 PIR ON - detected ON update for item: {}, not announcing phrase', triggeringItemName);
  }

  // get timerMgr from cache and cancel any existing off-delay timers for lights associated with this sensor
  activePirSensorConfig.lightConfigNames.forEach((lightConfigName, index) => {
    const lightConfig = lightConfigsMap.get(lightConfigName);
    if (lightConfig) {
      const lightTimerKey = genTimerKey(triggeringItemName, lightConfigName, index);
      if (timerMgr.hasTimer(lightTimerKey)) {
        logger.debug('6 PIR ON - found existing timer for key: {}, cancelling it', lightTimerKey);
        timerMgr.cancel(lightTimerKey);
        logger.debug('7 PIR ON - cancelling timer with lightTimerKey:{}', lightTimerKey);
      } else {
        logger.debug('8 PIR ON - no existing timer found for key: {}', lightTimerKey);
      }
    } else {
      logger.warn('LightConfig: {} not found in lightConfigs array!', lightConfigName);
    }
  });

  // use the activePirSensorConfig.lightConfigNames to turn lights ON
  activePirSensorConfig.lightConfigNames.forEach((lightConfigName) => {
    const lightConfig = lightConfigsMap.get(lightConfigName);
    if (lightConfig) {
      if (activePirSensorConfig.isLightLevelActive()) {
        logger.debug(`9 PIR ON - Light level below threshold, turning light on : ${activePirSensorConfig.friendlyName}, for item: ${triggeringItemName}`);
        lightConfig.lightControl('ON');
      } else {
        logger.warn(`10 PIR ON - Light level above threshold, NOT turning light on : ${activePirSensorConfig.friendlyName}, for item: ${triggeringItemName}`);
      }
    } else {
      logger.warn('LightConfig: {} not found in lightConfigs array!', lightConfigName);
    }
  });
};

/**
 * Handles the logic when an occupancy sensor state changes from 'ON' to 'OFF'.
 * @param {object} event - The event object from the rule trigger.
 * @param {PirSensorConfig} activePirSensorConfig - The configuration for the triggered sensor.
 * @param {string} triggeringItemName - The name of the item that triggered the rule.
 */
const handleOccupancyOnToOff = (event, activePirSensorConfig, triggeringItemName) => {
  logger.debug('1 PIR ON->OFF..activePirSensorConfig is: {} - {}', activePirSensorConfig.friendlyName, activePirSensorConfig.occupancySensorItemName);

  // re/start the timers for each light associated with this sensor
  const timerName = `${ruleUID}_${triggeringItemName}`;
  activePirSensorConfig.lightConfigNames.forEach((lightConfigName, index) => {
    const lightConfig = lightConfigsMap.get(lightConfigName);

    if (lightConfig) {
      const lightTimerKey = genTimerKey(triggeringItemName, lightConfig.name, index);
      const lightTimerName = `${timerName}_light${index}`;
      const lightTimerDurationMs = lightConfig.getLightOffDelayTimerDurationMs();

      timerMgr.cancel(lightTimerKey);
      logger.debug('2 PIR ON->OFF - createtimer off light: {} for PIR sensor: {}', lightConfig.lightControlItemName, activePirSensorConfig.friendlyName);

      timerMgr.check(lightTimerKey, lightTimerDurationMs, lightConfig.getLightOffDelayTimerFunction(), true, null, lightTimerName);
      logger.debug(
        '3 PIR ON->OFF - timerMgr.check - timerKey:{}, duration-ms:{}, lightConfig:{}, timerName:{}',
        lightTimerKey,
        lightTimerDurationMs,
        lightConfig.lightControlItemName,
        lightTimerName,
      );
    } else {
      logger.error('LightConfig: {} not found in sensorconfig!', lightConfigName);
    }
  });
};

// --- Rules ---

/**
 * Rule to handle PIR occupancy updates as ON.
 * Turns on associated lights if conditions are met.
 */
rules.JSRule({
  name: 'PIR - occupancy ON',
  description: 'PIR occupancy ON - Turn OFF-ON or re-trigger ON light',
  triggers: [
    triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON'),
    triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON'),
  ],
  execute: createOccupancyRuleHandler(handleOccupancyOn),
});
/**
 * Rule to handle PIR occupancy changing from ON to OFF.
 * Starts timers to turn off associated lights.
 */
rules.JSRule({
  name: 'PIR - ON to OFF',
  description: 'PIR off, start OFF delay lights timer',
  triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'ON', 'OFF')],
  execute: createOccupancyRuleHandler(handleOccupancyOnToOff),
});
