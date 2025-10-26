/* eslint-disable no-undef */
/* eslint-disable max-len */
const {
  log, items, rules, triggers, actions,
} = require('openhab');

// Log versions
const { helpers } = require('openhab_rules_tools');

const ruleUID = 'pir_action';
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.pir_action
// log:set INFO org.openhab.automation.openhab-js.pir_action

const { TimerMgr } = require('openhab_rules_tools');

let timerMgr = cache.private.get('timerMgr', () => TimerMgr());

scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
  logger.info('>utils.OPENHAB_JS_VERSION: {}', utils.OPENHAB_JS_VERSION);
  logger.info('>helpers.OHRT_VERSION: {}', helpers.OHRT_VERSION);
  // eslint-disable-next-line no-use-before-define
  logger.debug('>sensorLights: {}', JSON.stringify(sensorLights));
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects

class SensorLight {
  /**
   * Initializes a SensorLight instance with the given parameters.
   *
   * @param {string} friendlyName - The friendlyName of the SensorLight instance.
   * @param {string} occupancySensorItemName - The name of the occupancy item associated with this SensorLight instance.
   * @param {string} offTimerDurationItemName - The name of the off-timer duration item associated with this SensorLight instance.
   * @param {string} lightLevelActiveThresholdItemName - The name of the light level active threshold item associated with this Sensor.
   * @param {number} defaultOffTimerDuration - The default duration of the off-timer in seconds.
   * @param {...string} lightItemNames - The names of the light items associated with this SensorLight instance.
   */
  constructor(
    friendlyName,
    occupancySensorItemName,
    offTimerDurationItemName,
    lightLevelActiveThresholdItemName,
    defaultOffTimerDuration,
    ...lightItemNames
  ) {
    this.friendlyName = friendlyName;
    this.occupancySensorItemName = occupancySensorItemName;
    // this.occupancySensorItem = items.getItem(occupancySensorItemName);

    this.offTimerDurationItemName = offTimerDurationItemName;
    this.lightLevelActiveThresholdItemName = lightLevelActiveThresholdItemName;
    this.defaultOffTimerDuration = defaultOffTimerDuration;
    this.lightItemNames = lightItemNames;
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
   * Controls the lights associated with this SensorLight instance.
   *
   * @param {string} state - The state to set the lights to (default: 'OFF')
   * @return {undefined}
   */
  lightsControl(state = 'OFF') {
    this.lightItemNames.forEach((lightItemName) => {
      const lightItem = items.getItem(lightItemName);
      if (lightItem) {
        logger.debug('send {} -> {}', state, lightItemName);
        lightItem.sendCommand(state);
      } else {
        logger.warn(`Light Item ${lightItemName} not found!`);
      }
    });
  }

  /**
   * Retrieves the duration of the off timer for this SensorLight instance.
   * If the off timer duration item is not defined, a default duration is used.
   * The duration is returned in milliseconds.
   *
   * @return {number} The duration of the off timer in milliseconds.
   */
  getOffTimerDurationMs() {
    // get timerDuration for this offTimerDurationItemName, return default if missing
    const timerItem = items.getItem(this.offTimerDurationItemName, true);
    let timerDuration = timerItem ? timerItem.rawState : undefined;
    if (timerDuration === undefined) {
      timerDuration = this.defaultOffTimerDuration;
      logger.warn(
        `OffTimerDurationItem: ${this.offTimerDurationItemName} not defined. Using default: ${this.defaultOffTimerDuration}`,
      );
    }

    const timerDurationMs = timerDuration * 1000;
    logger.debug(
      'occupancySensorItemName: {}, offTimerDurationItemName: {}, timerDuration(secs): {}',
      this.occupancySensorItemName,
      this.offTimerDurationItemName,
      timerDuration,
    );

    return timerDurationMs;
  }

  /**
   * Checks if the current light level is below the active threshold for this SensorLight.
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

/**
 *
 * @param {*} ASensorLight
 * @returns
 */
const occupancyOffTimerFunction = (ASensorLight) => () => {
  logger.debug(
    'OFF Timer expired, location: {}, sensor: {} lights: {}',
    ASensorLight.friendlyName,
    JSON.stringify(ASensorLight.occupancySensorItemName),
    JSON.stringify(ASensorLight.lightItemNames),
  );
  // lightsControl(ASensorLight.lightItemNames, 'OFF');
  ASensorLight.lightsControl('OFF');
};

const slPir05 = new SensorLight(
  'Kitchen-LHS1',
  'pir05_occupancy',
  'pir05_offTimerDurationItem',
  'ConservatoryLightTriggerLevel',
  100,
  'KT_light_2_Power',
  'KT_light_3_Power',
);
slPir05.phrases = [

];

// const slPir06 = new SensorLight(
//   'Kitchen-LHS2',
//   'pir06_occupancy',
//   'pir06_offTimerDurationItem',
//   'ConservatoryLightTriggerLevel',
//   100,
//   'KT_light_2_Power',
//   'KT_light_3_Power',
// );
// slPir06.phrases = [

// ];

// const slPir01 = new SensorLight(
//   'Kitchen-RHS',
//   'pir01_occupancy',
//   'pir01_offTimerDurationItem',
//   'ConservatoryLightTriggerLevel',
//   200,
//   'KT_light_1_Power',
// );
// slPir01.phrases = [

// ];

// const slPir03 = new SensorLight(
//   'Dining Room',
//   'pir03_occupancy',
//   'pir03_offTimerDurationItem',
//   'ConservatoryLightTriggerLevel',
//   500,
//   'v_StartColourBulbsCycle',
// );
// slPir03.phrases = [
//   'dining room',
//   'dining room',
//   'dining room',
//   'dining room',
//   'Idiot in the dining room',
// ];

// const slPir04 = new SensorLight(
//   'Stairs',
//   'pir04_occupancy',
//   'pir04_offTimerDurationItem',
//   'ConservatoryLightTriggerLevel',
//   500,
//   'v_StartColourBulbsCycle',
//   'ZbWhiteBulb01Switch',
// );
// slPir04.phrases = [
//   'stairs',
// ];

// const slPir02 = new SensorLight(
//   'landing',
//   'pir02_occupancy',
//   'pir02_offTimerDurationItem',
//   'ConservatoryLightTriggerLevel',
//   500,
//   'ZbWhiteBulb01Switch',
// );
// slPir02.phrases = [
//   'landing',
// ];
// const sensorLights = [slPir01, slPir02, slPir03, slPir04, slPir05, slPir06];
// const sensorLights = [slPir01, slPir03, slPir04, slPir05];
const sensorLights = [slPir05];

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
    logger.debug(`Triggering item: ${itemName},state is: ${item.state}`);
    const timerKey = itemName;

    // find sensorlight that has occupancy triggered
    const currentSensorLight = sensorLights.find((sensorLight) => sensorLight.occupancySensorItemName === itemName);
    if (!currentSensorLight) {
      logger.warn(`No SensorLight found for item: ${itemName}`);
      return;
    }
    logger.debug(
      'PIR OFF > ON ..currentSensorLight is: {} - {}',
      currentSensorLight.friendlyName,
      currentSensorLight.occupancySensorItemName,
    );

    if (currentSensorLight.phrases.length > 0) {
      logger.debug('PIR ON - light level: {}', items.getItem('BridgeLightSensorLevel').rawState);

      const phrase = currentSensorLight.phrases[Math.floor(Math.floor(Math.random() * currentSensorLight.phrases.length))];

      // actions.Audio.playSound('now_disconnected.mp3');
      actions.Voice.say(phrase);
    }
    timerMgr = cache.private.get('timerMgr');
    // if an old timer exists stop it
    if (timerMgr.hasTimer(timerKey)) {
      timerMgr.cancel(timerKey);
      logger.debug('timer with timerKey: {}, exists - cancelling it', timerKey);
    }
    cache.private.put('timerMgr', timerMgr);

    if (currentSensorLight.isLightLevelActive()) {
      currentSensorLight.lightsControl('ON');
    } else {
      logger.debug(
        `Light level above threshold, NOT turning light on : ${currentSensorLight.friendlyName}, for item: ${itemName}`,
      );
    }
  },
});

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
    logger.debug(`Triggering item: ${itemName} ON -> OFF,state: ${item.state}`);

    const timerKey = itemName;
    const timerName = `${ruleUID}_${itemName}`;

    // find sensorlight that has occupancy triggered
    const currentSensorLight = sensorLights.find((sensorLight) => sensorLight.occupancySensorItemName === itemName);
    if (!currentSensorLight) {
      logger.warn(`No SensorLight found for item: ${itemName}`);
      return;
    }
    logger.debug(
      'ON -> OFF..currentSensorLight is: {} - {}',
      currentSensorLight.friendlyName,
      currentSensorLight.occupancySensorItemName,
    );

    // re/start the timer
    timerMgr = cache.private.get('timerMgr');

    // get off timer duration
    const timerDuration = currentSensorLight.getOffTimerDurationMs();

    timerMgr.cancel(timerKey);
    logger.debug('cancel timer with timerKey:{}', timerKey);

    timerMgr.check(timerKey, timerDuration, occupancyOffTimerFunction(currentSensorLight), true, null, timerName);
    logger.debug(
      'ON > OFF timerMgr.check - timerKey:{}, duration-s:{}, occupancyOffTimerFunction:{}, lightNames:{}, timerRuleName:{} ',
      timerKey,
      timerDuration / 1000,
      'lightsOff',
      JSON.stringify(currentSensorLight.lightItemNames),
      timerName,
    );

    cache.private.put('timerMgr', timerMgr);
  },
});
