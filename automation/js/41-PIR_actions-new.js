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
const { helpers } = require('openhab_rules_tools');
// const { configClasses } = require('openhab-my-utils');

const ruleUID = 'pir_testing';
const logger = log(ruleUID);
// log:set warn org.openhab.automation.openhab-js.pir_action
// log:set DEBUG org.openhab.automation.openhab-js.pir_testing

// Initialize a timer manager from the cache or create a new one.
let timerMgr = cache.private.get('timerMgr', () => TimerMgr());

// --- Configuration Loading ---
const configPath = '/etc/openhab/automation/js/conf/pir_sensor_light_setup_data.json';

let sensorData;

let rawConfig;

try {
  const Files = Java.type('java.nio.file.Files');
  const Paths = Java.type('java.nio.file.Paths');
  logger.debug(`Reading PIR sensor/light config from: ${configPath}`);
  rawConfig = Files.readString(Paths.get(configPath));
  // sensorData = JSON.parse(rawConfig);
  // logger.warn('rawConfig: {}', JSON.stringify(rawConfig));
  sensorData = JSON.parse(rawConfig);
} catch (e) {
  logger.error(`Error reading or parsing config file: ${e}`);
}

// Import configuration classes .
logger.debug('Importing LightConfig and PirSensorConfig from 41-PIR-sensor-light-classes.js');
const { LightConfig, PirSensorConfig } = require('../41-PIR-sensor-light-classes.js');

// Create instances of light configurations from the loaded sensor data.
const lightConfigs = sensorData.lightConfigs.map(
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
const PirSensorConfigs = sensorData.pirSensorConfigs.map(
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
  logger.info('>utils.OPENHAB_JS_VERSION: {}', utils.OPENHAB_JS_VERSION);
  logger.info('>helpers.OHRT_VERSION: {}', helpers.OHRT_VERSION);
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
};

/**
 * Handles the logic when an occupancy sensor state updates as 'ON'.
 * @param {object} event - The event object from the rule trigger.
 * @param {PirSensorConfig} activePirSensorConfig - The configuration for the triggered sensor.
 * @param {string} triggeringItemName - The name of the item that triggered the rule.
 */
const handleOccupancyOn = (event, activePirSensorConfig, triggeringItemName) => {
  logger.debug('PIR ON ..activePirSensorConfig is: {} - {}', activePirSensorConfig.friendlyName, activePirSensorConfig.occupancySensorItemName);
  // log event details
  logger.debug('PIR ON Event details: {}', JSON.stringify(event));

  // announce phrase if any are configured
  if (activePirSensorConfig.phrases.length > 0) {
    logger.debug('PIR ON - light level: {}', items.getItem('BridgeLightSensorLevel').rawState);

    const phrase = activePirSensorConfig.phrases[Math.floor(Math.random() * activePirSensorConfig.phrases.length)];
    logger.debug('PIR ON - saying phrase: {}', phrase);
    actions.Voice.say(phrase);
  }

  // get timerMgr from cache and cancel any existing off-timers for lights associated with this sensor
  timerMgr = cache.private.get('timerMgr');
  activePirSensorConfig.lightConfigNames.forEach((lightConfigName, index) => {
    const lightConfig = lightConfigsMap.get(lightConfigName);
    if (lightConfig) {
      // logger.debug('PIR ON - cancelling any existing off-timer for light: {}', lightConfig.lightControlItemName);
      const lightTimerKey = genTimerKey(triggeringItemName, lightConfigName, index);
      if (timerMgr.hasTimer(lightTimerKey)) {
        logger.debug('PIR ON - found existing timer for key: {}, cancelling it', lightTimerKey);
        timerMgr.cancel(lightTimerKey);
        logger.debug('cancelling timer with lightTimerKey:{}', lightTimerKey);
      } else {
        logger.debug('PIR ON - no existing timer found for key: {}', lightTimerKey);
      }
    } else {
      logger.warn('LightConfig: {} not found in lightConfigs array!', lightConfigName);
    }
  });
  cache.private.put('timerMgr', timerMgr);

  // use the activePirSensorConfig.lightConfigNames to turn lights ON
  activePirSensorConfig.lightConfigNames.forEach((lightConfigName) => {
    const lightConfig = lightConfigsMap.get(lightConfigName);
    if (lightConfig) {
      if (activePirSensorConfig.isLightLevelActive()) {
        logger.debug(`Light level below threshold, turning light on : ${activePirSensorConfig.friendlyName}, for item: ${triggeringItemName}`);
        lightConfig.lightControl('ON');
      } else {
        logger.warn(`Light level above threshold, NOT turning light on : ${activePirSensorConfig.friendlyName}, for item: ${triggeringItemName}`);
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
  logger.debug('ON -> OFF..activePirSensorConfig is: {} - {}', activePirSensorConfig.friendlyName, activePirSensorConfig.occupancySensorItemName);

  // re/start the timers for each light associated with this sensor
  timerMgr = cache.private.get('timerMgr');
  const timerName = `${ruleUID}_${triggeringItemName}`;
  activePirSensorConfig.lightConfigNames.forEach((lightConfigName, index) => {
    const lightConfig = lightConfigsMap.get(lightConfigName);
    if (lightConfig) {
      const lightTimerKey = genTimerKey(triggeringItemName, lightConfig.name, index);
      const lightTimerName = `${timerName}_light${index}`;
      const lightTimerDurationMs = lightConfig.getLightOnOffTimerDurationMs();

      timerMgr.cancel(lightTimerKey);
      logger.debug('createtimer off light: {} for PIR sensor: {}', lightConfig.lightControlItemName, activePirSensorConfig.friendlyName);

      timerMgr.check(lightTimerKey, lightTimerDurationMs, lightConfig.getLightTurnOffTimerFunction(), true, null, lightTimerName);
      logger.debug(
        'ON -> OFF timerMgr.check - timerKey:{}, duration-ms:{}, lightConfig:{}, timerName:{}',
        lightTimerKey,
        lightTimerDurationMs,
        lightConfig.lightControlItemName,
        lightTimerName,
      );
    } else {
      logger.error('LightConfig: {} not found in sensorconfig!', lightConfigName);
    }
  });
  cache.private.put('timerMgr', timerMgr);
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
  description: 'PIR sensor start OFF lights timer',
  triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'ON', 'OFF')],
  execute: createOccupancyRuleHandler(handleOccupancyOnToOff),
});
