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
   * @param {number} lightLevelActiveThresholdItem - The light level active threshold item associated with this Sensor.
   * @param {number} defaultOffTimerDuration - The default duration of the off-timer in seconds.
   * @param {...string} lightItemNames - The names of the light items associated with this SensorLight instance.
   */
  constructor(
    friendlyName,
    occupancySensorItemName,
    offTimerDurationItemName,
    lightLevelActiveThresholdItem,
    defaultOffTimerDuration,
    ...lightItemNames
  ) {
    this.friendlyName = friendlyName;
    this.occupancySensorItemName = occupancySensorItemName;
    // this.occupancySensorItem = items.getItem(occupancySensorItemName);

    this.offTimerDurationItemName = offTimerDurationItemName;
    this.lightLevelActiveThresholdItem = lightLevelActiveThresholdItem;
    this.defaultOffTimerDuration = defaultOffTimerDuration;
    this.lightItemNames = lightItemNames;

    const endIndex = occupancySensorItemName.indexOf('_');
    this.pirPrefix = occupancySensorItemName.substring(0, endIndex);
    this.label = `${this.pirPrefix} - ${friendlyName}`;
    this.rawlabelitem = items.getItem(occupancySensorItemName).rawItem;
    this.rawlabelitem.setLabel(this.label);
  }

  /**
   * Controls the lights associated with this SensorLight instance.
   *
   * @param {string} state - The state to set the lights to (default: 'OFF')
   * @return {undefined}
   */
  lightsControl(state = 'OFF') {
    this.lightItemNames.forEach((lightItemName) => {
      logger.debug('send {} -> {}', state, lightItemName);
      items.getItem(lightItemName).sendCommand(state);
    });
  }

  /**
   * Retrieves the duration of the off timer for this SensorLight instance.
   * If the off timer duration item is not defined, a default duration of 10 seconds is used.
   * The duration is returned in milliseconds.
   *
   * @return {number} The duration of the off timer in milliseconds.
   */
  getOffTimerDurationMs() {
    // get timerDuration for this offTimerDurationItemName, return null if missing
    let timerDuration = items.getItem(this.offTimerDurationItemName, true).rawState;
    timerDuration = timerDuration || 10; // default to 10s if offTimerDurationItemName not defined(null)
    const timerDurationMs = timerDuration * 1000 + 1;
    logger.debug(
      'occupancySensorItemName: {}, lightLevelActiveThresholdItem()(secs): {}',
      this.occupancySensorItemName,
      timerDuration,
    );

    return timerDurationMs;
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

// const kitchen_LHS_sensor =
const slPir05 = new SensorLight(
  'KT-LHS1',
  'pir05_occupancy',
  'pir05_offTimerDurationItem',
  'lightLevelActiveThresholdItem',
  100,
  'KT_light_2_Power',
  'KT_light_3_Power',
);
const slPir06 = new SensorLight(
  'KT-LHS2',
  'pir06_occupancy',
  'pir06_offTimerDurationItem',
  'lightLevelActiveThresholdItem',
  100,
  'KT_light_2_Power',
  'KT_light_3_Power',
);
const slPir01 = new SensorLight(
  'KT-RHS',
  'pir01_occupancy',
  'pir01_offTimerDurationItem',
  'lightLevelActiveThresholdItem',
  200,
  'KT_light_1_Power',
);
const slPir03 = new SensorLight(
  'DR',
  'pir03_occupancy',
  'pir03_offTimerDurationItem',
  'lightLevelActiveThresholdItem',
  500,
  'v_StartColourBulbsCycle',
);
const slPir04 = new SensorLight(
  'bottom-Stairs',
  'pir04_occupancy',
  'pir04_offTimerDurationItem',
  'lightLevelActiveThresholdItem',
  500,
  'v_StartColourBulbsCycle',
  'ZbWhiteBulb01Switch',
);
const slPir02 = new SensorLight(
  'top-of-stairs',
  'pir02_occupancy',
  'pir02_offTimerDurationItem',
  'lightLevelActiveThresholdItem',
  500,
  'ZbWhiteBulb01Switch',
);
// const slPir06 = new SensorLight('CT-room-sensor', 'pir06_occupancy', 'pir06_offTimerDurationItem', 'lightLevelActiveThresholdItem', 5000, 'v_StartColourBulbsCycle');
// const slPir05 = new SensorLight('CT-room-sensor', 'pir05_occupancy', 'pir05_offTimerDurationItem', 'lightLevelActiveThresholdItem', 5000, 'v_StartColourBulbsCycle');

//
const sensorLights = [slPir01, slPir02, slPir03, slPir04, slPir05, slPir06];

rules.JSRule({
  name: 'PIR - OFF to ON',
  description: 'PIR occupancy ON - Turn ON light',
  triggers: [triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy', 'ON')],
  execute: (event) => {
    itemName = event.itemName.toString();
    logger.debug(`Triggering item: ${itemName},state is: ${items.getItem(itemName).state}`);
    timerKey = itemName;

    // find sensorlight that has occupancy triggered
    const currentSensorLight = sensorLights.find((sensorLight) => sensorLight.occupancySensorItemName === itemName);
    logger.debug(
      'PIR OFF > ON ..currentSensorLight is: {} - {}',
      currentSensorLight.friendlyName,
      currentSensorLight.occupancySensorItemName,
    );

    if (currentSensorLight.friendlyName === 'DR') {
      logger.debug('DR PIR ON - light level: {}', items.getItem('BridgeLightSensorLevel').rawState);
      // say 'possible cat alert'
      actions.Voice.say('Alert, possible cat in the dining room');
    }

    timerMgr = cache.private.get('timerMgr');
    // if an old timer exists stop it
    if (timerMgr.hasTimer(timerKey)) {
      timerMgr.cancel(timerKey);
      logger.debug('timer with timerKey: {}, exists - cancelling it', timerKey);
    }
    cache.private.put('timerMgr', timerMgr);

    if (items.getItem('BridgeLightSensorLevel').rawState < items.getItem('ConservatoryLightTriggerLevel').rawState) {
      // turn on the sensorlight light item(s)
      // if (currentSensorLight !== undefined) {
      if (currentSensorLight) {
        currentSensorLight.lightsControl('ON');
      }
    } else {
      logger.debug(
        `BridgeLightSensorLevel ABOVE ConservatoryLightTriggerLevel, NOT turning light on : ${currentSensorLight}, for item: ${itemName}`,
      );
    }
  },
});

rules.JSRule({
  name: 'PIR - ON to OFF',
  description: 'PIR sensor start OFF lights timer',
  triggers: [triggers.GroupStateChangeTrigger('gZbPIRSensorOccupancy', 'ON', 'OFF')],
  execute: (event) => {
    itemName = event.itemName.toString();
    logger.debug(`Triggering item: ${itemName} ON -> OFF,state: ${items.getItem(itemName).state}`);

    timerKey = itemName;
    timerName = `${ruleUID}_${itemName}`;

    // find sensorlight that has occupancy triggered
    const currentSensorLight = sensorLights.find((sensorLight) => sensorLight.occupancySensorItemName === itemName);
    logger.debug(
      'ON -> OFF..currentSensorLight is: {} - {}',
      currentSensorLight.friendlyName,
      currentSensorLight.occupancySensorItemName,
    );

    // re/start the timer
    timerMgr = cache.private.get('timerMgr');

    // get off timer duration
    timerDuration = currentSensorLight.getOffTimerDurationMs();

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
