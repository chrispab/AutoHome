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

const ruleUID = 'pir_action_new';
const logger = log(ruleUID);
// log:set warn org.openhab.automation.openhab-js.pir_action
// log:set INFO org.openhab.automation.openhab-js.pir_action

let timerMgr = cache.private.get('timerMgr', () => TimerMgr());

// Load sensor configurations from JSON file
// const JSON5 = require('json5');

const configPath = '/etc/openhab/automation/js/conf/pir_config.json';
let sensorData;
let rawConfig;
try {
  const Files = Java.type('java.nio.file.Files');
  const Paths = Java.type('java.nio.file.Paths');
  rawConfig = Files.readString(Paths.get(configPath));
  // sensorData = JSON.parse(rawConfig);
  logger.warn('rawConfig: {}', JSON.stringify(rawConfig));

  sensorData = JSON.parse(rawConfig);
} catch (e) {
  logger.error(`Error reading or parsing config file: ${e}`);
}

// sensorData = JSON5.parse(cleanedConfig);
logger.info('sensorData: {}', JSON.stringify(sensorData));
// const { PirLightConfig, PirSensorConfig } = require('./lib/configClasses');
// const { PirLightConfig, PirSensorConfig } = require('../lib/configClasses');
// const { PirLightConfig, PirSensorConfig } = require('configClasses');
// const { PirLightConfig, PirSensorConfig } = require('configClasses');
const { PirLightConfig, PirSensorConfig } = require('../41-configClasses.js');

// create instances of light configurations
const lightConfigs = sensorData.lightConfigs.map(
  (lcData) => new PirLightConfig(
    lcData.name,
    lcData.lightControlItemName,
    lcData.lightOnOffTimerDurationItemName,
    lcData.defaultLightOnOffTimerDurationSecs,
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
      lcData.lightOnOffTimerDurationItemName,
      lcData.defaultLightOnOffTimerDurationSecs,
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

scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
  logger.info('>utils.OPENHAB_JS_VERSION: {}', utils.OPENHAB_JS_VERSION);
  logger.info('>helpers.OHRT_VERSION: {}', helpers.OHRT_VERSION);
  // eslint-disable-next-line no-use-before-define
  PirSensorConfigs.forEach((config) => config.setItemLabel());

  logger.warn('>scriptLoaded PirSensorConfigs: {}', JSON.stringify(PirSensorConfigs));
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
// PIR occupancy ON - Turn ON light
rules.JSRule({
  name: 'PIR - new ON',
  description: 'PIR occupancy ON - Turn ON light',
  // triggers: [triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON')],
  // triggers: [triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON')],
  triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON')],

  execute: (event) => {
    const triggeringItemName = event.itemName.toString();
    const item = items.getItem(triggeringItemName);
    if (!item) {
      logger.warn(`Item ${triggeringItemName} not found!`);
      return;
    }

    logger.warn(`PIR - update   ON, Triggering item: ${triggeringItemName},state is: ${item.state}`);

    // find sensorlight that has occupancy triggered
    const activePirSensorConfig = PirSensorConfigs.find(
      (sensorConfig) => sensorConfig.occupancySensorItemName === triggeringItemName,
    );
    if (!activePirSensorConfig) {
      logger.warn(`No PirSensorConfig found for item: ${triggeringItemName}`);
      return;
    }
    logger.warn(
      'PIR OFF > ON ..activePirSensorConfig is: {} - {}',
      activePirSensorConfig.friendlyName,
      activePirSensorConfig.occupancySensorItemName,
    );

    // announce phrase if any are configured
    if (activePirSensorConfig.phrases.length > 0) {
      logger.warn('PIR ON - light level: {}', items.getItem('BridgeLightSensorLevel').rawState);

      const phrase = activePirSensorConfig.phrases[Math.floor(Math.floor(Math.random() * activePirSensorConfig.phrases.length))];
      logger.warn('PIR ON - saying phrase: {}', phrase);
      // actions.Audio.playSound('now_disconnected.mp3');
      actions.Voice.say(phrase);
      // Send a standard notification with icon, tag and title to two specific users
      // actions.notificationBuilder('Hello World!').addUserId('cbattisson@gmail.com').withIcon('f7:bell_fill').withTag('important')
      //   .withTitle('Important notification')
      //   .send();
    }

    timerMgr = cache.private.get('timerMgr');

    // if any running timers exists for any lightConfigs associated with the current sensorConfig, stop them, we are restarting the process for this light again
    // for each lightName in activePirSensorConfig.lightConfigNames, find the index in lightConfigs array
    activePirSensorConfig.lightConfigNames.forEach((lightConfigName, index) => {
      // get the lightConfig using the lightConfigName from the lightConfigs
      const lightConfig = lightConfigs[lightConfigName];
      const lightTimerKey = `${triggeringItemName}_light${index}`;
      logger.error('==calculated lightTimerKey: {}', lightTimerKey);

      if (lightConfig) {
        // cancel if present
        if (timerMgr.hasTimer(lightTimerKey)) {
          timerMgr.cancel(lightTimerKey);
          logger.error('cancelling timer with lightTimerKey:{}', lightTimerKey);
        }
      }
    });

    cache.private.put('timerMgr', timerMgr);

    // if (activePirSensorConfig.isLightLevelActive()) {
    //   activePirSensorConfig.sensorLightControl('ON');
    // } else {
    //   logger.warn(
    //     `Light level above threshold, NOT turning light on : ${activePirSensorConfig.friendlyName}, for item: ${triggeringItemName}`,
    //   );
    // }

    // use the activePirSensorConfig.lightConfigNames to log the light configs being controlled
    logger.warn('..Current PIR Sensor controlling lightConfigNames: {}', JSON.stringify(activePirSensorConfig.lightConfigNames));

    activePirSensorConfig.lightConfigNames.forEach((lightConfigName) => {
      const lightConfig = lightConfigs.find((config) => config.name === lightConfigName);
      if (lightConfig) {
        logger.error('vvvv==-Turning ON light: {} for PIR sensor: {}', lightConfig.lightControlItemName, activePirSensorConfig.friendlyName);
        lightConfig.lightControl('ON');
      } else {
        logger.error('==-LightConfig: {} not found in map!', lightConfigName);
      }
    });
  },
});

// PIR occupancy ON - Turn ON light
rules.JSRule({
  name: 'PIR - update   ON',
  description: 'PIR occupancy ON - Turn ON light',
  // triggers: [triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON')],
  // triggers: [triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON')],
  triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancyzzzzzzzzzzz', 'OFF', 'ON')],

  execute: (event) => {
    const triggeringItemName = event.itemName.toString();
    const item = items.getItem(triggeringItemName);
    if (!item) {
      logger.warn(`Item ${triggeringItemName} not found!`);
      return;
    }

    logger.warn(`PIR - update   ON, Triggering item: ${triggeringItemName},state is: ${item.state}`);
    // const timerKey = triggeringItemName;

    // find sensorlight that has occupancy triggered
    const activePirSensorConfig = PirSensorConfigs.find(
      (sensorConfig) => sensorConfig.occupancySensorItemName === triggeringItemName,
    );
    if (!activePirSensorConfig) {
      logger.warn(`No PirSensorConfig found for item: ${triggeringItemName}`);
      return;
    }
    logger.warn(
      'PIR OFF > ON ..activePirSensorConfig is: {} - {}',
      activePirSensorConfig.friendlyName,
      activePirSensorConfig.occupancySensorItemName,
    );

    if (activePirSensorConfig.phrases.length > 0) {
      logger.warn('PIR ON - light level: {}', items.getItem('BridgeLightSensorLevel').rawState);

      const phrase = activePirSensorConfig.phrases[Math.floor(Math.floor(Math.random() * activePirSensorConfig.phrases.length))];
      logger.warn('PIR ON - saying phrase: {}', phrase);
      // actions.Audio.playSound('now_disconnected.mp3');
      actions.Voice.say(phrase);
      // Send a standard notification with icon, tag and title to two specific users
      // actions.notificationBuilder('Hello World!').addUserId('cbattisson@gmail.com').withIcon('f7:bell_fill').withTag('important')
      //   .withTitle('Important notification')
      //   .send();
    }

    timerMgr = cache.private.get('timerMgr');
    // const timerKey = triggeringItemName;
    // const timerName = `${ruleUID}_${triggeringItemName}`;
    // if an old timer exists for any lights associated with the current sensor, stop it, we are restarting the process for this light again
    // if (timerMgr.hasTimer(timerKey)) {
    //   timerMgr.cancel(timerKey);
    //   logger.warn('timer with timerKey: {}, exists - cancelling it', timerKey);
    // }

    // if an old timer exists for any lights associated with the current sensor, stop it, we are restarting the process for this light again
    activePirSensorConfig.lightConfigs.forEach((lightConfig, index) => {
      const lightTimerKey = `${triggeringItemName}_light${index}`;
      // const lightTimerName = `${timerName}_light${index}`;
      // const lightTimerDuration = lightConfig.getLightOnOffTimerDurationMs();
      logger.error('== on calculated lightTimerKey: {}', lightTimerKey);

      if (timerMgr.hasTimer(lightTimerKey)) {
        timerMgr.cancel(lightTimerKey);
        logger.warn('cancelling timer with lightTimerKey:{}', lightTimerKey);
      }

      // timerMgr.check(
      //   lightTimerKey,
      //   lightTimerDuration,
      //   occupancyOnOffTimerFunctionTurnOffLight(lightConfig),
      //   true,
      //   null,
      //   lightTimerName,
      // );
      // logger.warn(
      //   'ON > OFF timerMgr.check - timerKey:{}, duration-ms:{}, lightConfig:{}, timerName:{}',
      //   lightTimerKey,
      //   lightTimerDuration,
      //   lightConfig.lightControlItemName,
      //   lightTimerName,
      // );
    });

    cache.private.put('timerMgr', timerMgr);

    if (activePirSensorConfig.isLightLevelActive()) {
      activePirSensorConfig.sensorLightControl('ON');
    } else {
      logger.warn(
        `Light level above threshold, NOT turning light on : ${activePirSensorConfig.friendlyName}, for item: ${triggeringItemName}`,
      );
    }

    // use the activePirSensorConfig.lightConfigNames to log the light configs being controlled
    logger.warn('..Current PIR Sensor controlling lightConfigNames: {}', JSON.stringify(activePirSensorConfig.lightConfigNames));
    // with each lightConfigNames, find the lightConfigs item that names match and set each light to ON state
    // lightConfigs.forEach((lconfig) => {
    //   const lightConfig = lightConfigs.find((config) => config.name === lconfig.name);
    //   if (lightConfig) {
    //     logger.error('--Turning ON light: {} for PIR sensor: {}', lightConfig.lightControlItemName, activePirSensorConfig.friendlyName);
    //     // lightConfig.lightControl('ON');
    //   } else {
    //     logger.error('LightConfig: {} not found in map!', lconfig.name);
    //   }
    // });

    // loop through activePirSensorConfig.lightConfigNames and log each lightConfigName
    activePirSensorConfig.lightConfigNames.forEach((lightConfigName) => {
      logger.warn('Controlling lightConfig: {} for PIR sensor: {}', lightConfigName, activePirSensorConfig.friendlyName);

      // loop through lightConfigs and find the one that matches the lightConfigName
      lightConfigs.forEach((lconfig, index) => {
        const lightTimerKey = `${triggeringItemName}_light${index}`;
        logger.error('==timer with lightTimerKey:{}', lightTimerKey);
        if (lconfig.name === lightConfigName) {
          logger.warn('Found matching lightConfig: {} for PIR sensor: {}', lconfig.name, activePirSensorConfig.friendlyName);
          logger.error('//Turning ON light: {} for PIR sensor: {}', lconfig.lightControlItemName, activePirSensorConfig.friendlyName);
          // lconfig.lightControl('ON');
        } else {
          logger.warn('No matching lightConfig: {} found for PIR sensor: {}', lightConfigName, activePirSensorConfig.friendlyName);
        }
      });
    });

    // activePirSensorConfig.lightConfigNames.forEach((lightConfigName) => {
    //   const lightConfig = lightConfigs.find((config) => config.name === lightConfigName);
    //   if (lightConfig) {
    //     logger.error('Turning ON light: {} for PIR sensor: {}', lightConfig.lightControlItemName, activePirSensorConfig.friendlyName);
    //     // lightConfig.lightControl('ON');
    //   } else {
    //     logger.error('LightConfig: {} not found in map!', lightConfigName);
    //   }
    // });
    // activePirSensorConfig.lightConfigNames.forEach((lightConfigName) => {
    //   const lightConfig = lightConfigsMap.get(lightConfigName);
    //   if (lightConfig) {
    //     logger.warn('Turning ON light: {} for PIR sensor: {}', lightConfig.lightControlItemName, activePirSensorConfig.friendlyName);
    //   } else {
    //     logger.warn('LightConfig: {} not found in map!', lightConfigName);
    //   }
    // });
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
      logger.warn(`Item ${triggeringItemName} not found!`);
      return;
    }
    logger.warn(`Triggering item: ${triggeringItemName} ON -> OFF,state: ${item.state}`);

    // find sensorlight that has occupancy triggered
    const activePirSensorConfig = PirSensorConfigs.find(
      (sensorConfig) => sensorConfig.occupancySensorItemName === triggeringItemName,
    );
    if (!activePirSensorConfig) {
      logger.warn(`No PirSensorConfig found for item: ${triggeringItemName}`);
      return;
    }
    logger.warn(
      'ON -> OFF..activePirSensorConfig is: {} - {}',
      activePirSensorConfig.friendlyName,
      activePirSensorConfig.occupancySensorItemName,
    );

    // re/start the timer
    // Get timer durations for all light configs in this sensor
    const allTimerDurationsMs = activePirSensorConfig.lightConfigs.map((lightConfig) => lightConfig.getLightOnOffTimerDurationMs());
    // print allTimerDurationsMs to logger warn message
    logger.warn('Timer durations for light configs ms: {}', JSON.stringify(allTimerDurationsMs));

    // Create an array of objects containing light control item names and their timer durations
    const lightControls = activePirSensorConfig.lightConfigs.map((lightConfig) => ({
      triggeringItemName: lightConfig.lightControlItemName,
      duration: lightConfig.getLightOnOffTimerDurationMs(),
    }));
    // Log the light controls for debugging
    logger.warn('Light controls and durations: {}', JSON.stringify(lightControls));

    //
    // Use the longest duration to ensure all lights complete their cycles
    const timerDurationMs = Math.max(...allTimerDurationsMs);
    logger.warn(
      'Using maximum timer duration: {} ms from light configs: {}',
      timerDurationMs,
      JSON.stringify(allTimerDurationsMs),
    );

    // get timerMgr from cache
    timerMgr = cache.private.get('timerMgr');
    const timerName = `${ruleUID}_${triggeringItemName}`;

    // Create timers for each light config for this sensor
    activePirSensorConfig.lightConfigs.forEach((lightConfig, index) => {
      const lightTimerKey = `${triggeringItemName}_light${index}`;
      const lightTimerName = `${timerName}_light${index}`;
      const lightTimerDuration = lightConfig.getLightOnOffTimerDurationMs();

      timerMgr.cancel(lightTimerKey);
      logger.error('!== on-off  lightTimerKey: {}', lightTimerKey);

      timerMgr.check(
        lightTimerKey,
        lightTimerDuration,
        lightConfig.getTurnOffTimerFunction(),
        true,
        null,
        lightTimerName,
      );

      logger.warn(
        'ON > OFF timerMgr.check - timerKey:{}, duration-ms:{}, lightConfig:{}, timerName:{}',
        lightTimerKey,
        lightTimerDuration,
        lightConfig.lightControlItemName,
        lightTimerName,
      );
    });

    // save timerMgr to cache
    cache.private.put('timerMgr', timerMgr);
  },
});
