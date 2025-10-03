/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable max-len */
const {
  log, items, rules, triggers, actions,
} = require('openhab');

// Log versions
const { helpers } = require('openhab_rules_tools');

const ruleUID = 'pir_action_new';
const logger = log(ruleUID);
// log:set warn org.openhab.automation.openhab-js.pir_action
// log:set INFO org.openhab.automation.openhab-js.pir_action

const { TimerMgr } = require('openhab_rules_tools');

let timerMgr = cache.private.get('timerMgr', () => TimerMgr());

scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
  logger.info('>utils.OPENHAB_JS_VERSION: {}', utils.OPENHAB_JS_VERSION);
  logger.info('>helpers.OHRT_VERSION: {}', helpers.OHRT_VERSION);
  // eslint-disable-next-line no-use-before-define
  logger.warn('>SensorConfigs: {}', JSON.stringify(SensorConfigs));
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects

// class to manage light configurations:
class LightConfig {
  constructor(lightControlItemName, lightOnOffTimerDurationItemName, defaultLightOnOffTimerDurationSecs) {
    this.lightControlItemName = lightControlItemName;
    this.lightOnOffTimerDurationItemName = lightOnOffTimerDurationItemName;
    this.defaultLightOnOffTimerDurationSecs = defaultLightOnOffTimerDurationSecs;
  }

  getLightOnOffTimerDurationMs() {
    const offTimerDurationItem = items.getItem(this.lightOnOffTimerDurationItemName, true);

    logger.warn(`this.defaultLightOnOffTimerDurationSecs: ${this.defaultLightOnOffTimerDurationSecs}`);
    let timerDurationSecs = offTimerDurationItem ? offTimerDurationItem.rawState : undefined;
    if (timerDurationSecs === undefined) {
      timerDurationSecs = this.defaultLightOnOffTimerDurationSecs;
      logger.warn(
        `lightOnOffTimerDurationItemName: ${this.onTimerDurationItemName} not defined. Using default: ${this.defaultLightOnOffTimerDurationSecs}`,
      );
    }
    logger.warn(`timerDurationSecs: ${timerDurationSecs}`);
    return timerDurationSecs * 1000;
  }

  /**
   * Controls the lights associated with this LightConfig instance.
   *
   * @param {string} state - The state to set the lights to (default: 'OFF')
   * @return {undefined}
   */
  lightControl(state) {
    // this.lightConfigs.forEach((lightConfig) => {
    const lightItem = items.getItem(this.lightControlItemName);
    if (lightItem) {
      logger.warn('send {} -> {}', state, this.lightControlItemName);
      if (state === 'ON') {
        const duration = this.getLightOnOffTimerDurationMs();
        logger.warn('lightControl( {} ON duration: {} ms', this.lightControlItemName, duration);
      }
      lightItem.sendCommand(state);
    } else {
      logger.warn(`lightControl Item ${this.lightControlItemName} not found!`);
    }
    // });
  }
}

class SensorConfig {
  /**
   * Initializes a SensorConfig instance with the given parameters.
   *
   * @param {string} friendlyName - The friendlyName of the SensorConfig instance.
   * @param {string} occupancySensorItemName - The name of the occupancy item associated with this SensorConfig instance.
   * @param {string} offTimerDurationItemName - The name of the off-timer duration item associated with this SensorConfig instance.
   * @param {string} lightLevelActiveThresholdItemName - The name of the light level active threshold item associated with this Sensor.
   * @param {number} defaultOffTimerDuration - The default duration of the off-timer in seconds.
   * @param {...string} lightConfigs - The lightConfigs of the light items associated with this SensorConfig instance.
   */
  constructor(
    friendlyName,
    occupancySensorItemName,
    offTimerDurationItemName,
    lightLevelActiveThresholdItemName,
    defaultOffTimerDuration,
    ...lightConfigs
  ) {
    this.friendlyName = friendlyName;
    this.occupancySensorItemName = occupancySensorItemName;
    // this.occupancySensorItem = items.getItem(occupancySensorItemName);

    this.offTimerDurationItemName = offTimerDurationItemName;
    this.lightLevelActiveThresholdItemName = lightLevelActiveThresholdItemName;
    this.defaultOffTimerDuration = defaultOffTimerDuration;
    this.lightConfigs = lightConfigs;
    // Replace this.lightItemNames with:
    this.lightItemNames = lightConfigs.map((config) => config.itemName);
    this.phrases = [];

    const endIndex = occupancySensorItemName.indexOf('_');
    this.pirPrefix = occupancySensorItemName.substring(0, endIndex);
    this.label = `${this.pirPrefix} - ${friendlyName}`;
    const item = items.getItem(occupancySensorItemName);
    if (item && item.rawItem) {
      item.rawItem.setLabel(this.label);
    } else {
      logger.warn(`Item ${occupancySensorItemName} or its rawItem not found to set label to ${this.label}`);
    }
  }

  /**
   * Controls the lights associated with this SensorConfig instance.
   *
   * @param {string} state - The state to set the lights to
   * @return {undefined}
   */
  sensorLightControl(state) {
    this.lightConfigs.forEach((lightConfig) => {
      const lightItem = items.getItem(lightConfig.lightControlItemName);
      if (lightItem) {
        logger.warn('send {} -> {}', state, lightConfig.lightControlItemName);
        if (state === 'ON') {
          const duration = lightConfig.getLightOnOffTimerDurationMs();
          logger.warn('sensorLightControl( {} ON duration: {} ms', lightConfig.lightControlItemName, duration);
        }
        lightItem.sendCommand(state);
      } else {
        logger.warn(`sensorLightControl Item ${lightConfig.lightControlItemName} not found!`);
      }
    });
  }

  /**
   * Retrieves the duration of the off timer for this SensorConfig instance.
   * If the off timer duration item is not defined, a default duration is used.
   * The duration is returned in milliseconds.
   *
   * @return {number} The duration of the off timer in milliseconds.
   */
  getSensorOnOffTimerDurationMs() {
    // get timerDurationSecs for this offTimerDurationItemName, return default if missing
    const offTimerDurationItem = items.getItem(this.offTimerDurationItemName, true);
    let timerDurationSecs = offTimerDurationItem ? offTimerDurationItem.rawState : undefined;
    if (timerDurationSecs === undefined) {
      timerDurationSecs = this.defaultOffTimerDuration;
      logger.warn(
        `OffTimerDurationItem: ${this.offTimerDurationItemName} not defined. Using default: ${this.defaultOffTimerDuration}`,
      );
    }

    const timerDurationMs = timerDurationSecs * 1000;
    logger.warn(
      'occupancySensorItemName: {}, offTimerDurationItemName: {}, timerDurationSecs(secs): {}',
      this.occupancySensorItemName,
      this.offTimerDurationItemName,
      timerDurationSecs,
    );

    return timerDurationMs;
  }

  /**
   * Checks if the current light level is below the active threshold for this SensorConfig.
   *
   * @returns {boolean} True if the light level is below the threshold, false otherwise.
   */
  isLightLevelActive() {
    const bridgeLightSensorLevelItem = items.getItem('BridgeLightSensorLevel');
    const lightLevelThresholdItem = items.getItem(this.lightLevelActiveThresholdItemName);
    if (!bridgeLightSensorLevelItem || !lightLevelThresholdItem) {
      logger.warn('Cant get BridgeLightSensorLevel or LightLevelThreshold item for isLightLevelActive check');
      return false;
    }

    const currentLightLevel = bridgeLightSensorLevelItem.rawState;
    const lightLevelThreshold = lightLevelThresholdItem.rawState;
    const isActive = currentLightLevel < lightLevelThreshold;
    logger.warn(
      'Checking light level for {}: Current level: {}, Threshold: {}, Active: {}',
      this.friendlyName,
      currentLightLevel,
      lightLevelThreshold,
      isActive,
    );
    return isActive;
  }
}
const slPir01 = new SensorConfig(
  'Kitchen-RHS',
  'pir01_occupancy',
  'pir01_offTimerDurationItem',
  'ConservatoryLightTriggerLevel',
  200,
  new LightConfig('KT_light_1_Power', 'KT_light_1_onDuration', 5),
);
slPir01.phrases = [];

const slPir02 = new SensorConfig(
  'landing',
  'pir02_occupancy',
  'pir02_offTimerDurationItem',
  'ConservatoryLightTriggerLevel',
  500,
  'ZbWhiteBulb01Switch',
);
slPir02.phrases = ['landing'];
const slPir03 = new SensorConfig(
  'Dining Room',
  'pir03_occupancy',
  'pir03_offTimerDurationItem',
  'ConservatoryLightTriggerLevel',
  500,
  'v_StartColourBulbsCycle',
);
slPir03.phrases = [
  'dining room',
];

const slPir04 = new SensorConfig(
  'Stairs',
  'pir04_occupancy',
  'pir04_offTimerDurationItem',
  'ConservatoryLightTriggerLevel',
  500,
  'v_StartColourBulbsCycle',
  'ZbWhiteBulb01Switch',
);
slPir04.phrases = ['stairs'];
const slPir05 = new SensorConfig(
  'Kitchen-LHS1',
  'pir05_occupancy',
  'pir05_offTimerDurationItem',
  'ConservatoryLightTriggerLevel',
  100,
  new LightConfig('KT_light_2_Power', 'KT_light_2_onDuration', 10),
  new LightConfig('KT_light_3_Power', 'KT_light_3_onDuration', 30),
);

slPir05.phrases = [];

const slPir06 = new SensorConfig(
  'pir6-fairy',
  'pir06_occupancy',
  'pir06_offTimerDurationItem',
  'ConservatoryLightTriggerLevel',
  100,
  // new LightConfig('KT_light_2_Power', 'KT_light_2_onDuration', 3),
  // new LightConfig('KT_light_3_Power', 'KT_light_3_onDuration', 3),
  // new LightConfig('CT_FairyLights433Socket', 'CT_FairyLights433Socket_onDuration', 9),
  // new LightConfig('KT_light_2_Power', 'KT_light_2_onDuration', 10),
  new LightConfig('v_StartColourBulbsCycle', 'v_StartColourBulbsCycle_onDuration', 11),
);
slPir06.phrases = ['test'];

// const SensorConfigs = [slPir01, slPir02, slPir03, slPir04, slPir05, slPir06];
const SensorConfigs = [slPir06];

/**
 *
 * @param {*} ASensorLight
 * @returns
 */
const occupancyOffTimerFunction = (ASensorLight) => () => {
  logger.warn(
    'OFF Timer expired, location: {}, sensor: {} lights: {}',
    ASensorLight.friendlyName,
    JSON.stringify(ASensorLight.occupancySensorItemName),
    JSON.stringify(ASensorLight.lightConfigs),
  );
  // lightsControl(ASensorLight.lightItemNames, 'OFF');
  ASensorLight.sensorLightControl('OFF');
};

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
  logger.warn(
    'on-OFF Timer expired, lightControlItemName: {}, lightOnOffTimerDurationItemName: {} defaultLightOnOffTimerDurationSecs: {}',
    lightConfig.lightControlItemName,
    lightConfig.lightOnOffTimerDurationItemName,
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
    const itemName = event.itemName.toString();
    const item = items.getItem(itemName);
    if (!item) {
      logger.warn(`Item ${itemName} not found!`);
      return;
    }
    logger.warn(`Triggering item: ${itemName},state is: ${item.state}`);
    const timerKey = itemName;

    // find sensorlight that has occupancy triggered
    const currentSensorConfig = SensorConfigs.find((sensorLight) => sensorLight.occupancySensorItemName === itemName);
    if (!currentSensorConfig) {
      logger.warn(`No SensorConfig found for item: ${itemName}`);
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

      // actions.Audio.playSound('now_disconnected.mp3');
      actions.Voice.say(phrase);
    }
    timerMgr = cache.private.get('timerMgr');
    // if an old timer exists stop it
    if (timerMgr.hasTimer(timerKey)) {
      timerMgr.cancel(timerKey);
      logger.warn('timer with timerKey: {}, exists - cancelling it', timerKey);
    }
    cache.private.put('timerMgr', timerMgr);

    if (currentSensorConfig.isLightLevelActive()) {
      currentSensorConfig.sensorLightControl('ON');
    } else {
      logger.warn(
        `Light level above threshold, NOT turning light on : ${currentSensorConfig.friendlyName}, for item: ${itemName}`,
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
    const itemName = event.itemName.toString();
    const item = items.getItem(itemName);
    if (!item) {
      logger.warn(`Item ${itemName} not found!`);
      return;
    }
    logger.warn(`Triggering item: ${itemName} ON -> OFF,state: ${item.state}`);

    const timerKey = itemName;
    const timerName = `${ruleUID}_${itemName}`;

    // find sensorlight that has occupancy triggered
    const currentSensorConfig = SensorConfigs.find((sensorLight) => sensorLight.occupancySensorItemName === itemName);
    if (!currentSensorConfig) {
      logger.warn(`No SensorConfig found for item: ${itemName}`);
      return;
    }
    logger.warn(
      'ON -> OFF..currentSensorConfig is: {} - {}',
      currentSensorConfig.friendlyName,
      currentSensorConfig.occupancySensorItemName,
    );

    // get timerMgr from cache
    timerMgr = cache.private.get('timerMgr');
    // re/start the timer
    // Get timer durations for all light configs in this sensor
    const allTimerDurationsMs = currentSensorConfig.lightConfigs.map((lightConfig) => lightConfig.getLightOnOffTimerDurationMs());
    // print allTimerDurationsMs to logger warn message
    logger.warn('Timer durations for light configs ms: {}', JSON.stringify(allTimerDurationsMs));

    // Create an array of objects containing light control item names and their timer durations
    const lightControls = currentSensorConfig.lightConfigs.map((lightConfig) => ({
      itemName: lightConfig.lightControlItemName,
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

    timerMgr.cancel(timerKey);
    logger.warn('cancel timer with timerKey:{}', timerKey);

    const currentLight = currentSensorConfig.lightConfigs[0];
    // timerMgr.check(timerKey, timerDurationMs, occupancyOffTimerFunction(currentSensorConfig), true, null, timerName);
    timerMgr.check(timerKey, timerDurationMs, occupancyOnOffTimerFunctionTurnOffLight(currentLight), true, null, timerName);

    logger.warn(
      'ON > OFF timerMgr.check - timerKey:{}, duration-ms:{}, occupancyOffTimerFunction:{}, lightConfigs:{}, timerName:{} ',
      timerKey,
      timerDurationMs,
      currentSensorConfig,
      JSON.stringify(currentSensorConfig.lightConfigs),
      timerName,
    );

    // save timerMgr to cache
    cache.private.put('timerMgr', timerMgr);
  },
});
