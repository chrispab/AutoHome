/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable max-len */
const {
  log, items, rules, triggers, actions,
} = require('openhab');

// Log versions
const { TimerMgr } = require('openhab_rules_tools');
const { helpers } = require('openhab_rules_tools');
// const { configClasses } = require('openhab-my-utils');

const ruleUID = 'pir_testing';
const logger = log(ruleUID);
// log:set warn org.openhab.automation.openhab-js.pir_action
// log:set DEBUG org.openhab.automation.openhab-js.pir_testing

let timerMgr = cache.private.get('timerMgr', () => TimerMgr());

// Load sensor configurations from JSON file
// const JSON5 = require('json5');

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

logger.debug('Importing PirLightConfig and PirSensorConfig from 41-PIR-sensor-light-classes.js');
const { PirLightConfig, PirSensorConfig } = require('../41-PIR-sensor-light-classes.js');

// create instances of light configurations
const lightConfigs = sensorData.lightConfigs.map(
  (lcData) => new PirLightConfig(
    lcData.name,
    lcData.lightControlItemName,
    lcData.lightOffDelayTimerDurationItemName,
    lcData.defaultLightOffDelayTimerDurationSecs,
  ),
);

// Create a map of light configurations
const lightConfigsMap = new Map();
sensorData.lightConfigs.forEach((lcData) => {
  lightConfigsMap.set(
    lcData.name,
    new PirLightConfig(
      lcData.name,
      lcData.lightControlItemName,
      lcData.lightOffDelayTimerDurationItemName,
      lcData.defaultLightOffDelayTimerDurationSecs,
    ),
  );
});

// Create sensor configurations, passing the map of light configs
const PirSensorConfigs = sensorData.pirSensorConfigs.map(
  (data) => new PirSensorConfig(
    data.friendlyName,
    data.occupancySensorItemName,
    data.offTimerDurationItemName,
    data.lightLevelActiveThresholdItemName,
    data.defaultOffTimerDuration,
    data.phrases,
    data.lightConfigNames,
    lightConfigsMap,
  ),
);

// Script loaded function
scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
  logger.info('>utils.OPENHAB_JS_VERSION: {}', utils.OPENHAB_JS_VERSION);
  logger.info('>helpers.OHRT_VERSION: {}', helpers.OHRT_VERSION);
  // eslint-disable-next-line no-use-before-define
  PirSensorConfigs.forEach((config) => config.setItemLabel());
  logger.debug('>scriptLoaded PirSensorConfigs: {}', JSON.stringify(PirSensorConfigs));
  logger.debug('>scriptLoaded lightConfigs: {}', JSON.stringify(lightConfigs));
};

// Function to generate timer key
function genTimerKey(triggeringItemName, lightConfigName, index) {
  return `${triggeringItemName}_${lightConfigName}_light_${index}`;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
// PIR occupancy ON - Turn ON light
rules.JSRule({
  name: 'PIR - occupancy ON',
  description: 'PIR occupancy ON - Turn ON or re-trigger light',
  // triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON')],
  triggers: [triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON')],
  // triggers: [
  //   triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON'),
  //   triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON'),
  // ],

  execute: (event) => {
    // Get the triggering item name and item
    const triggeringItemName = event.itemName.toString();
    const { receivedState } = event;
    logger.debug(`PIR ON Event. Trigger: ${triggeringItemName}, event: ${JSON.stringify(event)}`);

    // logger.debug(`PIR ON Event. event: ${JSON.stringify(event)}`);
    const item = items.getItem(triggeringItemName);

    if (!item) {
      logger.warn(`P4-Item ${triggeringItemName} not found!`);
      return;
    }

    // find sensorConfig that has occupancy triggered
    const activePirSensorConfig = PirSensorConfigs.find(
      (sensorConfig) => sensorConfig.occupancySensorItemName === triggeringItemName,
    );
    if (!activePirSensorConfig) {
      logger.warn(`P5-No PirSensorConfig found for item: ${triggeringItemName}`);
      return;
    }
    logger.debug('P6-PIR ON ..activePirSensorConfig is: {} - {}', activePirSensorConfig.friendlyName, activePirSensorConfig.occupancySensorItemName);

    // announce phrase if any are configured
    if (activePirSensorConfig.phrases.length > 0) {
      logger.debug('P7-PIR ON - light level: {}', items.getItem('BridgeLightSensorLevel').rawState);

      const phrase = activePirSensorConfig.phrases[Math.floor(Math.floor(Math.random() * activePirSensorConfig.phrases.length))];
      logger.debug('P8-PIR ON - saying phrase: {}', phrase);
      // actions.Audio.playSound('now_disconnected.mp3');
      actions.Voice.say(phrase);
      // Send a standard notification with icon, tag and title to two specific users
      // actions.notificationBuilder('Hello World!').addUserId('cbattisson@gmail.com').withIcon('f7:bell_fill').withTag('important')
      //   .withTitle('Important notification')
      //   .send();
    }

    // get timerMgr from cache and cancel any existing off-timers for lights associated with this sensor
    timerMgr = cache.private.get('timerMgr');
    // if any running timers exists for any lightConfigs associated with the current sensorConfig, stop them, we are restarting the process for this light again
    // for each lightName in activePirSensorConfig.lightConfigNames, find the index in lightConfigs array
    activePirSensorConfig.lightConfigNames.forEach((lightConfigName, index) => {
      // get the lightConfig using the lightConfigName from the lightConfigs
      const lightConfig = lightConfigs.find((config) => config.name === lightConfigName);
      if (lightConfig) {
        // cancel if present
        const lightTimerKey = genTimerKey(triggeringItemName, lightConfigName, index);
        logger.debug('P9-==calculated lightTimerKey: {}', lightTimerKey);
        if (timerMgr.hasTimer(lightTimerKey)) {
          timerMgr.cancel(lightTimerKey);
          logger.debug('P10-cancelling timer with lightTimerKey:{}', lightTimerKey);
        }
      }
    });
    cache.private.put('timerMgr', timerMgr);

    // use the activePirSensorConfig.lightConfigNames to turn lights ON
    logger.debug('P11-..Current PIR Sensor lightConfigNames: {}', JSON.stringify(activePirSensorConfig.lightConfigNames));
    activePirSensorConfig.lightConfigNames.forEach((lightConfigName) => {
      const lightConfig = lightConfigs.find((config) => config.name === lightConfigName);
      if (lightConfig) {
        logger.debug('P12-Turning ON light: {} for PIR sensor: {}', lightConfig.lightControlItemName, activePirSensorConfig.friendlyName);
        // lightConfig.lightControl('ON');
        if (activePirSensorConfig.isLightLevelActive()) {
          lightConfig.lightControl('ON');
        } else {
          logger.debug(`P13-Light level above threshold, NOT turning light on : ${activePirSensorConfig.friendlyName}, for item: ${triggeringItemName}`);
        }
      } else {
        logger.warn('P14-LightConfig: {} not found in lightConfigs array!', lightConfigName);
      }
    });
  },
});

// PIR sensor start OFF lights timer
rules.JSRule({
  name: 'PIR - ON to OFF',
  description: 'PIR sensor start OFF lights timer',
  triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'ON', 'OFF')],
  execute: (event) => {
    const triggeringItemName = event.itemName.toString();
    const item = items.getItem(triggeringItemName);
    if (!item) {
      logger.warn(`o1-Item ${triggeringItemName} not found!`);
      return;
    }
    logger.debug(`o2-Triggering item: ${triggeringItemName} ON -> OFF,state: ${item.state}`);

    // find sensorlight that has occupancy triggered
    const activePirSensorConfig = PirSensorConfigs.find(
      (sensorConfig) => sensorConfig.occupancySensorItemName === triggeringItemName,
    );
    if (!activePirSensorConfig) {
      logger.warn(`o3-No PirSensorConfig found for item: ${triggeringItemName}`);
      return;
    }
    logger.debug('o4-ON -> OFF..activePirSensorConfig is: {} - {}', activePirSensorConfig.friendlyName, activePirSensorConfig.occupancySensorItemName);

    // re/start the timers for each light associated with this sensor
    // get timerMgr from cache
    timerMgr = cache.private.get('timerMgr');
    const timerName = `${ruleUID}_${triggeringItemName}`;
    // use the activePirSensorConfig.lightConfigNames to turn lights OFF
    logger.debug('o5-..Current PIR Sensor lightConfigNames: {}', JSON.stringify(activePirSensorConfig.lightConfigNames));
    activePirSensorConfig.lightConfigNames.forEach((lightConfigName, index) => {
      const lightConfig = lightConfigs.find((config) => config.name === lightConfigName);
      if (lightConfig) {
        const lightTimerKey = genTimerKey(triggeringItemName, lightConfig.name, index);
        const lightTimerName = `${timerName}_light${index}`;
        const lightTimerDurationMs = lightConfig.getLightOnOffTimerDurationMs();

        timerMgr.cancel(lightTimerKey);
        logger.debug('o6-createtimer off light: {} for PIR sensor: {}', lightConfig.lightControlItemName, activePirSensorConfig.friendlyName);

        timerMgr.check(lightTimerKey, lightTimerDurationMs, lightConfig.getLightTurnOffTimerFunction(), true, null, lightTimerName);
        logger.debug(
          'o7-ON -> OFF timerMgr.check - timerKey:{}, duration-ms:{}, lightConfig:{}, timerName:{}',
          lightTimerKey,
          lightTimerDurationMs,
          lightConfig.lightControlItemName,
          lightTimerName,
        );
      } else {
        logger.error('o8-LightConfig: {} not found in sensorconfig!', lightConfigName);
      }
    });
    // save timerMgr to cache
    cache.private.put('timerMgr', timerMgr);
  },
});
