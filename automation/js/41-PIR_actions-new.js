/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable max-len */
const {
  log, items, rules, triggers, actions,
} = require('openhab');
const fs = require('fs');
const path = require('path');

// Log versions
const { helpers } = require('openhab_rules_tools');
const { LightConfig, SensorConfig } = require('./lib/configClasses');

const ruleUID = 'pir_action_new';
const logger = log(ruleUID);

const { TimerMgr } = require('openhab_rules_tools');

let timerMgr = cache.private.get('timerMgr', () => TimerMgr());

// Load sensor configurations from JSON file
const configPath = '/etc/openhab/conf/automation/js/pir_config.json';
const rawConfig = fs.readFileSync(configPath);
const sensorData = JSON.parse(rawConfig);

const SensorConfigs = sensorData.map((data) => new SensorConfig(
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
  logger.warn('>SensorConfigs: {}', JSON.stringify(SensorConfigs));
  SensorConfigs.forEach((config) => config.setItemLabel());
};

const occupancyOnOffTimerFunctionTurnOffLight = (lightConfig) => () => {
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
  lightConfig.lightControl('OFF');
};

// PIR occupancy ON - Turn ON light
rules.JSRule({
  name: 'PIR - update    ON',
  description: 'PIR occupancy ON - Turn ON light',
  triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'OFF', 'ON')],

  execute: (event) => {
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
      logger.warn('PIR ON - light level: {}', items.getItem('BridgeLightSensorLevel').rawState);

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
