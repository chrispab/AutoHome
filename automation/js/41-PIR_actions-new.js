/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable max-len */
const {

  log, items, rules, triggers, actions,

} = require('openhab');

// Log versions
const { TimerMgr } = require('openhab_rules_tools');
const { helpers } = require('openhab_rules_tools');

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
const { PirLightConfig, PirSensorConfig } = require('../lib/configClasses');

// Example of reading a local file in openHAB JS
// https://community.openhab.org/t/can-i-read-a-local-file-in-an-openhab-js-rule/165449/5
// var authInfo = require('/openhab/conf/other/asus.json');
// var asusLogin = `${authInfo.user}:${authInfo.password}`;

const PirSensorConfigs = sensorData.map((data) => new PirSensorConfig(
  data.friendlyName,
  data.occupancySensorItemName,
  data.offTimerDurationItemName,
  data.lightLevelActiveThresholdItemName,
  data.defaultOffTimerDuration,
  data.phrases,
  ...data.lightConfigs,
));

scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
  logger.info('>utils.OPENHAB_JS_VERSION: {}', utils.OPENHAB_JS_VERSION);
  logger.info('>helpers.OHRT_VERSION: {}', helpers.OHRT_VERSION);
  // eslint-disable-next-line no-use-before-define
  PirSensorConfigs.forEach((config) => config.setItemLabel());

  logger.warn('>scriptLoaded PirSensorConfigs: {}', JSON.stringify(PirSensorConfigs));
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects

// /**
//  *
//  * @param {*} ASensorLight
//  * @returns
//  */
// const occupancyOffTimerFunction = (ASensorLight) => () => {
//   logger.warn(
//     'OFF Timer expired, location: {}, sensor: {} lights: {}',
//     ASensorLight.friendlyName,
//     JSON.stringify(ASensorLight.occupancySensorItemName),
//     JSON.stringify(ASensorLight.lightConfigs),
//   );
//   // lightsControl(ASensorLight.lightItemNames, 'OFF');
//   ASensorLight.sensorLightControl('OFF');
// };

/**
 *
 * @param {*} Light
 * @returns
 */
const occupancyOnOffTimerFunctionTurnOffLight = (lightConfig) => () => {
  // logger.warn(
  //   'OFF Timer expired, location: {}, sensor: {} lights: {}',
  //   lightConfig.friendlyName,
  //   JSON.stringify(ASensorLight.occupancySensorItemName),
  //   JSON.stringify(ASensorLight.lightConfigs),
  // );
  //   this.lightControlItemName = lightControlItemName;
  // this.lightOnOffTimerDurationItemName = lightOnOffTimerDurationItemName;
  // this.defaultLightOnOffTimerDurationSecs = defaultLightOnOffTimerDurationSecs;

  const offTimerDurationItem = items.getItem(lightConfig.lightOnOffTimerDurationItemName, true);
  logger.warn(`lightConfig.offTimerDurationItem: ${this.offTimerDurationItem}`);
  const timerDurationSecs = offTimerDurationItem ? offTimerDurationItem.rawState : undefined;

  logger.warn(
    'on-OFF Timer expired, lightControlItemName: {}, lightOnOffTimerDurationItemName: {} timerDuration:{}, defaultLightOnOffTimerDurationSecs: {}',
    lightConfig.lightControlItemName,
    lightConfig.lightOnOffTimerDurationItemName,
    timerDurationSecs,
    lightConfig.defaultLightOnOffTimerDurationSecs,
  );
  // lightsControl(ASensorLight.lightItemNames, 'OFF');
  lightConfig.lightControl('OFF');
};

// PIR occupancy ON - Turn ON light
rules.JSRule({
  name: 'PIR - update   ON',
  description: 'PIR occupancy ON - Turn ON light',
  // triggers: [triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON')],
  // triggers: [triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON')],
  triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON')],

  execute: (event) => {
    const triggertItemName = event.itemName.toString();
    const item = items.getItem(triggertItemName);
    if (!item) {
      logger.warn(`Item ${triggertItemName} not found!`);
      return;
    }

    logger.warn(`PIR - update   ON, Triggering item: ${triggertItemName},state is: ${item.state}`);
    // const timerKey = triggertItemName;

    // find sensorlight that has occupancy triggered
    const currentPirSensorConfig = PirSensorConfigs.find((sensorConfig) => sensorConfig.occupancySensorItemName === triggertItemName);
    if (!currentPirSensorConfig) {
      logger.warn(`No PirSensorConfig found for item: ${triggertItemName}`);
      return;
    }
    logger.warn(
      'PIR OFF > ON ..currentPirSensorConfig is: {} - {}',
      currentPirSensorConfig.friendlyName,
      currentPirSensorConfig.occupancySensorItemName,
    );

    if (currentPirSensorConfig.phrases.length > 0) {
      logger.warn('PIR ON - light level: {}', items.getItem('BridgeLightSensorLevel').rawState);

      const phrase = currentPirSensorConfig.phrases[Math.floor(Math.floor(Math.random() * currentPirSensorConfig.phrases.length))];

      logger.warn('PIR ON - saying phrase: {}', phrase);
      // actions.Audio.playSound('now_disconnected.mp3');
      actions.Voice.say(phrase);
    }

    timerMgr = cache.private.get('timerMgr');
    const timerKey = triggertItemName;
    // const timerName = `${ruleUID}_${triggertItemName}`;
    // if an old timer exists for any lights associated with the current sensor, stop it, we are restarting the process for this light again
    // if (timerMgr.hasTimer(timerKey)) {
    //   timerMgr.cancel(timerKey);
    //   logger.warn('timer with timerKey: {}, exists - cancelling it', timerKey);
    // }

    // if an old timer exists for any lights associated with the current sensor, stop it, we are restarting the process for this light again
    currentPirSensorConfig.lightConfigs.forEach((lightConfig, index) => {
      const lightTimerKey = `${triggertItemName}_light${index}`;
      // const lightTimerName = `${timerName}_light${index}`;
      // const lightTimerDuration = lightConfig.getLightOnOffTimerDurationMs();

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

    if (currentPirSensorConfig.isLightLevelActive()) {
      currentPirSensorConfig.sensorLightControl('ON');
    } else {
      logger.warn(
        `Light level above threshold, NOT turning light on : ${currentPirSensorConfig.friendlyName}, for item: ${triggertItemName}`,
      );
    }
  },
});

// PIR sensor start OFF lights timer
rules.JSRule({
  name: 'PIR - ON to OFF',
  description: 'PIR sensor start OFF lights timer',
  triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'ON', 'OFF')],
  execute: (event) => {
    const triggertItemName = event.itemName.toString();
    const item = items.getItem(triggertItemName);
    if (!item) {
      logger.warn(`Item ${triggertItemName} not found!`);
      return;
    }
    logger.warn(`Triggering item: ${triggertItemName} ON -> OFF,state: ${item.state}`);

    // find sensorlight that has occupancy triggered
    const currentPirSensorConfig = PirSensorConfigs.find((sensorConfig) => sensorConfig.occupancySensorItemName === triggertItemName);
    if (!currentPirSensorConfig) {
      logger.warn(`No PirSensorConfig found for item: ${triggertItemName}`);
      return;
    }
    logger.warn(
      'ON -> OFF..currentPirSensorConfig is: {} - {}',
      currentPirSensorConfig.friendlyName,
      currentPirSensorConfig.occupancySensorItemName,
    );

    // re/start the timer
    // Get timer durations for all light configs in this sensor
    const allTimerDurationsMs = currentPirSensorConfig.lightConfigs.map((lightConfig) => lightConfig.getLightOnOffTimerDurationMs());
    // print allTimerDurationsMs to logger warn message
    logger.warn('Timer durations for light configs ms: {}', JSON.stringify(allTimerDurationsMs));

    // Create an array of objects containing light control item names and their timer durations
    const lightControls = currentPirSensorConfig.lightConfigs.map((lightConfig) => ({
      triggertItemName: lightConfig.lightControlItemName,
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
    const timerKey = triggertItemName;
    const timerName = `${ruleUID}_${triggertItemName}`;

    // Create timers for each light config for this sensor
    currentPirSensorConfig.lightConfigs.forEach((lightConfig, index) => {
      const lightTimerKey = `${timerKey}_light${index}`;
      const lightTimerName = `${timerName}_light${index}`;
      const lightTimerDuration = lightConfig.getLightOnOffTimerDurationMs();

      timerMgr.cancel(lightTimerKey);
      logger.warn('cancel timer with lightTimerKey:{}', lightTimerKey);

      timerMgr.check(
        lightTimerKey,
        lightTimerDuration,
        occupancyOnOffTimerFunctionTurnOffLight(lightConfig),
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
