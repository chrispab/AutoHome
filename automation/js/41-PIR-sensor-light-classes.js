/**
 * @file This file defines classes for configuring PIR sensor and light interactions in openHAB.
 * It provides structured objects for managing individual light settings and sensor behaviors,
 * which are then used by the main PIR automation script.
 */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable max-len */

const { log, items } = require('openhab');

const ruleUID = 'pir_sensor_light_classes';
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.pir_sensor_light_classes

/**
 * Represents the configuration for a single light or group of lights
 * that can be controlled by a PIR sensor.
 */
class LightConfig {
  /**
   * Creates an instance of LightConfig.
   * @param {string} name - A unique name for this light configuration.
   * @param {string} lightControlItemName - The name of the openHAB item that controls the light (e.g., a Switch or Dimmer).
   * @param {string} lightOffDelayTimerDurationItemName - The name of the openHAB item that stores the turn-off delay in seconds.
   * @param {number} defaultLightOffDelayTimerDurationSecs - A default turn-off delay in seconds if the item is not set.
   */
  constructor(name, lightControlItemName, lightOffDelayTimerDurationItemName, defaultLightOffDelayTimerDurationSecs) {
    this.name = name;
    this.lightControlItemName = lightControlItemName;
    this.lightOffDelayTimerDurationItemName = lightOffDelayTimerDurationItemName;
    this.defaultLightOffDelayTimerDurationSecs = defaultLightOffDelayTimerDurationSecs;
  }

  /**
   * Gets the configured turn-off delay for the light.
   * It reads the value from the associated openHAB item, falling back to the default if the item is not set.
   * @returns {number} The turn-off delay in milliseconds.
   */
  getLightOnOffTimerDurationMs() {
    const offTimerDurationItem = items.getItem(this.lightOffDelayTimerDurationItemName, true);

    logger.debug(`this.defaultLightOffDelayTimerDurationSecs: ${this.defaultLightOffDelayTimerDurationSecs}`);
    let timerDurationSecs = offTimerDurationItem ? offTimerDurationItem.rawState : undefined;
    if (timerDurationSecs === undefined) {
      timerDurationSecs = this.defaultLightOffDelayTimerDurationSecs;
      logger.warn(
        `lightOffDelayTimerDurationItemName: ${this.lightOffDelayTimerDurationItemName} not defined. Using default: ${this.defaultLightOffDelayTimerDurationSecs}`,
      );
    }
    logger.debug(`timerDurationSecs: ${timerDurationSecs}`);
    return timerDurationSecs * 1000;
  }

  /**
   * Sends a command to the light's control item.
   * @param {string} state - The command to send (e.g., 'ON', 'OFF').
   * @return {undefined}
   */
  lightControl(state) {
    const lightItem = items.getItem(this.lightControlItemName);
    if (lightItem) {
      logger.debug('send {} -> {}', state, this.lightControlItemName);
      if (state === 'ON') {
        const duration = this.getLightOnOffTimerDurationMs();
        logger.debug('lightControl( {} ON duration: {} ms', this.lightControlItemName, duration);
      }
      lightItem.sendCommand(state);
    } else {
      logger.warn(`lightControl Item ${this.lightControlItemName} not found!`);
    }
  }

  /**
   * Returns a function that can be used as a callback for a timer to turn the light off.
   * @returns {function(): void} A function that sends an 'OFF' command to the light.
   */
  getLightTurnOffTimerFunction() {
    return () => {
      const offTimerDurationItem = items.getItem(this.lightOffDelayTimerDurationItemName, true);
      const timerDurationSecs = offTimerDurationItem ? offTimerDurationItem.rawState : undefined;

      logger.debug(
        'LightTurnOffTimerFunction: Turning OFF light. Timer expired. lightControlItemName: {}, lightOffDelayTimerDurationItemName: {} timerDuration:{}, defaultLightOffDelayTimerDurationSecs: {}',
        this.lightControlItemName,
        this.lightOffDelayTimerDurationItemName,
        timerDurationSecs,
        this.defaultLightOffDelayTimerDurationSecs,
      );
      this.lightControl('OFF');
    };
  }
}

/**
 * Represents the configuration for a PIR motion sensor.
 * It links a sensor to one or more light configurations and defines its behavior.
 */
class PirSensorConfig {
  /**
   * Creates an instance of PirSensorConfig.
   * @param {string} friendlyName - A user-friendly name for the sensor (e.g., "Kitchen Sensor").
   * @param {string} occupancySensorItemName - The name of the openHAB item representing the sensor's occupancy state.
   * @param {string} offTimerDurationItemName - The name of the openHAB item for this sensor's specific off-timer duration.
   * @param {string} lightLevelActiveThresholdItemName - The name of the openHAB item that holds the ambient light level threshold.
   * @param {number} defaultOffTimerDuration - A default off-timer duration in seconds.
   * @param {Array<string>} [phrases=[]] - An optional array of phrases to be spoken when motion is detected.
   * @param {Array<string>} lightConfigNames - The names of the light configurations.
   */
  constructor(
    friendlyName,
    occupancySensorItemName,
    offTimerDurationItemName,
    lightLevelActiveThresholdItemName,
    defaultOffTimerDuration,
    phrases = [],
    lightConfigNames = [],
  ) {
    this.friendlyName = friendlyName;
    this.occupancySensorItemName = occupancySensorItemName;
    this.offTimerDurationItemName = offTimerDurationItemName;
    this.lightLevelActiveThresholdItemName = lightLevelActiveThresholdItemName;
    this.defaultOffTimerDuration = defaultOffTimerDuration;
    this.phrases = phrases;
    this.lightConfigNames = lightConfigNames;

    const endIndex = occupancySensorItemName.indexOf('_');
    this.pirPrefix = occupancySensorItemName.substring(0, endIndex);
    this.label = `${this.pirPrefix} - ${friendlyName}`;
  }

  /**
   * Sets the label of the associated occupancy sensor item in openHAB for better identification in the UI.
   */
  setItemLabel() {
    const item = items.getItem(this.occupancySensorItemName);
    if (item && item.rawItem) {
      item.rawItem.setLabel(this.label);
    } else {
      logger.warn(`Item ${this.occupancySensorItemName} or its rawItem not found to set label to ${this.label}`);
    }
  }

  /**
   * Gets the sensor's specific turn-off delay.
   * @returns {number} The turn-off delay in milliseconds.
   */
  // This method seems redundant with LightConfig.getLightOnOffTimerDurationMs and might be a candidate for refactoring.
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
    logger.debug(
      'occupancySensorItemName: {}, offTimerDurationItemName: {}, timerDurationSecs(secs): {}',
      this.occupancySensorItemName,
      this.offTimerDurationItemName,
      timerDurationSecs,
    );

    return timerDurationMs;
  }

  /**
   * Checks if the current ambient light level is below the configured threshold.
   * This is used to decide whether to turn on lights when motion is detected.
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
    logger.debug(
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
  LightConfig,
  PirSensorConfig,
};
