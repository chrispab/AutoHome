/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable max-len */

const { log, items } = require('openhab');

const ruleUID = 'config_classes';
const logger = log(ruleUID);

class PirLightConfig {
  constructor(name, lightControlItemName, lightOnOffTimerDurationItemName, defaultLightOnOffTimerDurationSecs) {
    this.name = name;
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
   * Controls the lights associated with this PirLightConfig instance.
   *
   * @param {string} state - The state to set the lights to (default: 'OFF')
   * @return {undefined}
   */
  lightControl(state) {
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
  }

  getTurnOffTimerFunction() {
    return () => {
      const offTimerDurationItem = items.getItem(this.lightOnOffTimerDurationItemName, true);
      const timerDurationSecs = offTimerDurationItem ? offTimerDurationItem.rawState : undefined;

      logger.warn(
        'on-OFF Timer expired, lightControlItemName: {}, lightOnOffTimerDurationItemName: {} timerDuration:{}, defaultLightOnOffTimerDurationSecs: {}',
        this.lightControlItemName,
        this.lightOnOffTimerDurationItemName,
        timerDurationSecs,
        this.defaultLightOnOffTimerDurationSecs,
      );
      this.lightControl('OFF');
    };
  }
}

class PirSensorConfig {
  /**
   * Initializes a PirSensorConfig instance with the given parameters.
   *
   * @param {string} friendlyName - The friendlyName of the PirSensorConfig instance.
   * @param {string} occupancySensorItemName - The name of the occupancy item.
   * @param {string} offTimerDurationItemName - The name of the off-timer duration item.
   * @param {string} lightLevelActiveThresholdItemName - The name of the light level threshold item.
   * @param {number} defaultOffTimerDuration - The default duration of the off-timer in seconds.
   * @param {Array<string>} phrases - Optional array of phrases to be spoken
   * @param {Array<string>} lightConfigNames - The names of the light configurations.
   * @param {Map<string, PirLightConfig>} allLightConfigsMap - A map of all light configurations.
   */
  constructor(
    friendlyName,
    occupancySensorItemName,
    offTimerDurationItemName,
    lightLevelActiveThresholdItemName,
    defaultOffTimerDuration,
    phrases = [],
    lightConfigNames = [],
    allLightConfigsMap,
  ) {
    this.friendlyName = friendlyName;
    this.occupancySensorItemName = occupancySensorItemName;
    this.offTimerDurationItemName = offTimerDurationItemName;
    this.lightLevelActiveThresholdItemName = lightLevelActiveThresholdItemName;
    this.defaultOffTimerDuration = defaultOffTimerDuration;
    this.phrases = phrases;
    this.lightConfigNames = lightConfigNames;
    this.lightConfigs = this.lightConfigNames.map((name) => allLightConfigsMap.get(name));
    this.lightItemNames = this.lightConfigs.map((config) => config.lightControlItemName);

    const endIndex = occupancySensorItemName.indexOf('_');
    this.pirPrefix = occupancySensorItemName.substring(0, endIndex);
    this.label = `${this.pirPrefix} - ${friendlyName}`;
  }

  setItemLabel() {
    const item = items.getItem(this.occupancySensorItemName);
    if (item && item.rawItem) {
      item.rawItem.setLabel(this.label);
    } else {
      logger.warn(`Item ${this.occupancySensorItemName} or its rawItem not found to set label to ${this.label}`);
    }
  }

  /**
   * Controls the lights associated with this PirSensorConfig instance.
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
   * Retrieves the duration of the off timer for this PirSensorConfig instance.
   * If the off timer duration item is not defined, a default duration is used.
   * The duration is returned in milliseconds.
   *
   * @return {number} The duration of the off timer in milliseconds.
   */
  getSensorOnOffTimerDurationMs() {
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
   * Checks if the current light level is below the active threshold for this PirSensorConfig.
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

module.exports = {
  PirLightConfig,
  PirSensorConfig,
};
