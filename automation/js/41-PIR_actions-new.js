/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable max-len */
const {
  log, items, rules, triggers, actions,
} = require('openhab');
// const fs = require('fs');
// const path = require('path');

// Log versions
const { helpers } = require('openhab_rules_tools');

// Assuming configClasses is in a 'lib' subdir relative to the current script
const { TimerMgr } = require('openhab_rules_tools');
// const { LightConfig, SensorConfig } = require('./lib/configClasses');

const ruleUID = 'pir_action_new';
const logger = log(ruleUID);
logger.info('Starting script evaluation...');

let timerMgr;
try {
  timerMgr = cache.private.get('timerMgr', () => new TimerMgr());
  logger.info('TimerMgr initialized successfully.');
} catch (e) {
  logger.error('Error initializing TimerMgr: {}', e);
}

// Load sensor configurations from JSON file
const configPath = '/etc/openhab/automation/js/conf/pir_config.json';

let rawConfig;

let sensorData;

let SensorConfigs;

try {
//   logger.info('Reading config file at {}...', configPath);
//   rawConfig = fs.readFileSync(configPath);
//   logger.info('Config file read successfully.');
//   sensorData = JSON.parse(rawConfig);
//   logger.info('Config file parsed successfully.');
  const Files = Java.type('java.nio.file.Files');
  const Paths = Java.type('java.nio.file.Paths');
  const Charset = Java.type('java.nio.charset.Charset');
  const rawConfig = new String(Files.readAllBytes(Paths.get(configPath)), Charset.forName('UTF-8'));
  const cleanedConfig = rawConfig.trim().replace(/^,/, '');
  logger.info('rawConfig: {}', rawConfig);
  logger.info('cleanedConfig: {}', cleanedConfig);
  sensorData = JSON.parse(cleanedConfig);

  SensorConfigs = sensorData.map((data) => new SensorConfig(
    data.friendlyName,
    data.occupancySensorItemName,
    data.offTimerDurationItemName,
    data.lightLevelActiveThresholdItemName,
    data.defaultOffTimerDuration,
    data.phrases,
    ...data.lightConfigs,
  ));
  logger.info('SensorConfigs created successfully.');
} catch (e) {
  logger.error('Error during config loading. Message: {}. Stack: {}', e.message, e.stack);
  SensorConfigs = []; // Prevent further errors
}

scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
  try {
    logger.info('> helpers object: {}', typeof helpers);
    if (helpers) {
      logger.info('> helpers.OHRT_VERSION: {}', helpers.OHRT_VERSION);
    }
    // utils is a global in openHAB JS, let's check it
    logger.info('> utils object: {}', typeof utils);
    if (typeof utils !== 'undefined' && utils !== null) {
      logger.info('> utils.OPENHAB_JS_VERSION: {}', utils.OPENHAB_JS_VERSION);
    } else {
      logger.warn('> `utils` is not available or is null.');
    }
  } catch (e) {
    logger.error('Error logging versions: {}', e);
  }

  try {
    logger.warn('> SensorConfigs (pre-stringify): {}', SensorConfigs);
    logger.warn('> SensorConfigs (stringified): {}', JSON.stringify(SensorConfigs));
  } catch (e) {
    logger.error('Error stringifying SensorConfigs: {}', e);
  }

  try {
    SensorConfigs.forEach((config) => config.setItemLabel());
    logger.info('SetItemLabel executed for all configs.');
  } catch (e) {
    logger.error('Error in SensorConfigs.forEach(setItemLabel): {}', e);
  }
};

const occupancyOnOffTimerFunctionTurnOffLight = (lightConfig) => () => {
  logger.info('Executing occupancyOnOffTimerFunctionTurnOffLight for {}', lightConfig.lightControlItemName);
  const offTimerDurationItem = items.getItem(lightConfig.lightOnOffTimerDurationItemName, true);
  // logger.warn(`lightConfig.offTimerDurationItem: ${this.offTimerDurationItem}`); // 'this' is likely incorrect here
  const timerDurationSecs = offTimerDurationItem ? offTimerDurationItem.rawState : undefined;

  logger.warn(
    'on-OFF Timer expired, lightControlItemName: {}, lightOnOffTimerDurationItemName: {} timerDuration:{}, defaultLightOnOffTimerDurationSecs: {}',
    lightConfig.lightControlItemName,
    lightConfig.lightOnOffTimerDurationItemName,
    timerDurationSecs,
    lightConfig.defaultLightOnOffTimerDurationSecs,
  );
  lightConfig.lightControl('OFF');
};

// PIR occupancy ON - Turn ON light
rules.JSRule({
  name: 'PIR - update    ON',
  description: 'PIR occupancy ON - Turn ON light',
  triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON')],

  execute: (event) => {
    logger.info('Rule "PIR - update ON" triggered by {}', event.itemName);
    const triggertItemName = event.itemName.toString();
    const item = items.getItem(triggertItemName);
    if (!item) {
      logger.warn(`Item ${triggertItemName} not found!`);
      return;
    }
    logger.warn(`PIR - update   ON, Triggering item: ${triggertItemName},state is: ${item.state}`);

    const currentSensorConfig = SensorConfigs.find((sensorLight) => sensorLight.occupancySensorItemName === triggertItemName);
    if (!currentSensorConfig) {
      logger.warn(`No SensorConfig found for item: ${triggertItemName}`);
      return;
    }
    logger.warn(
      'PIR OFF > ON ..currentSensorConfig is: {} - {}',
      currentSensorConfig.friendlyName,
      currentSensorConfig.occupancySensorItemName,
    );

    if (currentSensorConfig.phrases.length > 0) {
      try {
        const lightSensorItem = items.getItem('BridgeLightSensorLevel');
        if (lightSensorItem) {
          logger.warn('PIR ON - light level: {}', lightSensorItem.rawState);
        } else {
          logger.error('Item "BridgeLightSensorLevel" not found!');
        }
      } catch (e) {
        logger.error('Error getting light level: {}', e);
      }

      const phrase = currentSensorConfig.phrases[Math.floor(Math.floor(Math.random() * currentSensorConfig.phrases.length))];

      actions.Voice.say(phrase);
    }

    timerMgr = cache.private.get('timerMgr');
    const timerKey = triggertItemName;

    currentSensorConfig.lightConfigs.forEach((lightConfig, index) => {
      const lightTimerKey = `${triggertItemName}_light${index}`;

      if (timerMgr.hasTimer(lightTimerKey)) {
        timerMgr.cancel(lightTimerKey);
        logger.warn('cancelling timer with lightTimerKey:{}', lightTimerKey);
      }
    });
    cache.private.put('timerMgr', timerMgr);

    if (currentSensorConfig.isLightLevelActive()) {
      currentSensorConfig.sensorLightControl('ON');
    } else {
      logger.warn(
        `Light level above threshold, NOT turning light on : ${currentSensorConfig.friendlyName}, for item: ${triggertItemName}`,
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
    logger.info('Rule "PIR - ON to OFF" triggered by {}', event.itemName);
    const triggertItemName = event.itemName.toString();
    const item = items.getItem(triggertItemName);
    if (!item) {
      logger.warn(`Item ${triggertItemName} not found!`);
      return;
    }
    logger.warn(`Triggering item: ${triggertItemName} ON -> OFF,state: ${item.state}`);

    const currentSensorConfig = SensorConfigs.find((sensorLight) => sensorLight.occupancySensorItemName === triggertItemName);
    if (!currentSensorConfig) {
      logger.warn(`No SensorConfig found for item: ${triggertItemName}`);
      return;
    }
    logger.warn(
      'ON -> OFF..currentSensorConfig is: {} - {}',
      currentSensorConfig.friendlyName,
      currentSensorConfig.occupancySensorItemName,
    );

    const allTimerDurationsMs = currentSensorConfig.lightConfigs.map((lightConfig) => lightConfig.getLightOnOffTimerDurationMs());
    logger.warn('Timer durations for light configs ms: {}', JSON.stringify(allTimerDurationsMs));

    const lightControls = currentSensorConfig.lightConfigs.map((lightConfig) => ({
      triggertItemName: lightConfig.lightControlItemName,
      duration: lightConfig.getLightOnOffTimerDurationMs(),
    }));
    logger.warn('Light controls and durations: {}', JSON.stringify(lightControls));

    const timerDurationMs = Math.max(...allTimerDurationsMs);
    logger.warn(
      'Using maximum timer duration: {} ms from light configs: {}',
      timerDurationMs,
      JSON.stringify(allTimerDurationsMs),
    );

    timerMgr = cache.private.get('timerMgr');
    const timerKey = triggertItemName;
    const timerName = `${ruleUID}_${triggertItemName}`;

    currentSensorConfig.lightConfigs.forEach((lightConfig, index) => {
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

    cache.private.put('timerMgr', timerMgr);
  },
});

logger.info('Script evaluation finished.');
