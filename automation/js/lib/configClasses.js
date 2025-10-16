/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable max-len */

// This module now exports a function that accepts a logger instance.
module.exports = function(logger) {
  const { items } = require('openhab');

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
  }

  class SensorConfig {
    constructor(
      friendlyName,
      occupancySensorItemName,
      offTimerDurationItemName,
      lightLevelActiveThresholdItemName,
      defaultOffTimerDuration,
      phrases = [],
      ...lightConfigs
    ) {
      this.friendlyName = friendlyName;
      this.occupancySensorItemName = occupancySensorItemName;
      this.offTimerDurationItemName = offTimerDurationItemName;
      this.lightLevelActiveThresholdItemName = lightLevelActiveThresholdItemName;
      this.defaultOffTimerDuration = defaultOffTimerDuration;
      this.phrases = phrases;
      this.lightConfigs = lightConfigs.map(lc => new LightConfig(lc.lightControlItemName, lc.lightOnOffTimerDurationItemName, lc.defaultLightOnOffTimerDurationSecs));
      this.lightItemNames = lightConfigs.map((config) => config.itemName);

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

  return {
    LightConfig,
    SensorConfig,
  };
};
