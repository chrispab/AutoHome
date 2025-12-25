/**
 * @file This file contains the configuration data for PIR sensor-based lighting automation.
 * It defines the lights that can be controlled and the PIR sensors that trigger them.
 * This data is imported and used by '41-PIR_actions-new.js'.
 */

// --- Light Configurations ---
const lightConfigs = [
  {
    name: 'colourBulbsCycle',
    location: 'Dining Room',
    lightControlItemName: 'v_StartColourBulbsCycle',
    lightOffDelayTimerDurationItemName: 'v_StartColourBulbsCycle_onDuration',
    defaultLightOffDelayTimerDurationSecs: 1,
  },
  {
    name: 'landingLight',
    location: 'Landing',
    lightControlItemName: 'ZbWhiteBulb01Switch',
    lightOffDelayTimerDurationItemName: 'landing_offDelayTimerDurationItem',
    defaultLightOffDelayTimerDurationSecs: 11,
  },
  {
    name: 'workLight',
    location: 'Desk Area',
    lightControlItemName: 'workLightsPowerSocket',
    lightOffDelayTimerDurationItemName: 'work_light_offDelayTimerDurationItem',
    defaultLightOffDelayTimerDurationSecs: 5,
  },
  {
    name: 'fairyLights',
    location: 'Fairy Lights',
    lightControlItemName: 'CT_FairyLights433Socket',
    lightOffDelayTimerDurationItemName: 'fairy_lights_offDelayTimerDurationItem',
    defaultLightOffDelayTimerDurationSecs: 5,
  },
  {
    name: 'kitchenLight_1',
    location: 'Kitchen Kettle Area',
    lightControlItemName: 'KT_light_1_Power',
    lightOffDelayTimerDurationItemName: 'kitchen_kettle_offDelayTimerDurationItem',
    defaultLightOffDelayTimerDurationSecs: 5,
  },
  {
    name: 'kitchenLight_2',
    location: 'Kitchen prep Area',
    lightControlItemName: 'KT_light_2_Power',
    lightOffDelayTimerDurationItemName: 'kitchen_prep_offDelayTimerDurationItem',
    defaultLightOffDelayTimerDurationSecs: 5,
  },
  {
    name: 'kitchenLight_3',
    location: 'Kitchen Island Area',
    lightControlItemName: 'KT_light_3_Power',
    lightOffDelayTimerDurationItemName: 'kitchen_toaster_offDelayTimerDurationItem',
    defaultLightOffDelayTimerDurationSecs: 5,
  },
];

// --- PIR Sensor Configurations ---
const pirSensorConfigs = [
  {
    name: 'pir01',
    location: 'Kettle',
    friendlyName: 'pir1-Kitchen-kettle',
    occupancySensorItemName: 'pir01_occupancy',
    lightLevelActiveThresholdItemName: 'ConservatoryLightTriggerLevel',
    lightLevelSensorItemName: 'BridgeLightSensorLevel',
    phrases: [
    ],
    lightConfigNames: [
      'kitchenLight_1',
    ],
  },
  {
    name: 'pir02',
    location: 'prep',
    friendlyName: 'pir2-prep1',
    occupancySensorItemName: 'pir02_occupancy',
    lightLevelActiveThresholdItemName: 'ConservatoryLightTriggerLevel',
    lightLevelSensorItemName: 'BridgeLightSensorLevel',
    phrases: [
    ],
    lightConfigNames: [
      'kitchenLight_2',
      'kitchenLight_3',
    ],
  },
  {
    name: 'pir03',
    location: 'Dining Room',
    friendlyName: 'pir3-dining-room',
    occupancySensorItemName: 'pir03_occupancy',
    lightLevelActiveThresholdItemName: 'ConservatoryLightTriggerLevel',
    lightLevelSensorItemName: 'BridgeLightSensorLevel',
    phrases: [
      'dining',
    ],
    lightConfigNames: [
      'colourBulbsCycle',
    ],
  },
  {
    name: 'pir04',
    location: 'Stairs',
    friendlyName: 'pir4-Stairs',
    occupancySensorItemName: 'pir04_occupancy',
    lightLevelActiveThresholdItemName: 'ConservatoryLightTriggerLevel',
    lightLevelSensorItemName: 'BridgeLightSensorLevel',
    phrases: [
      'Stairs',
    ],
    lightConfigNames: [
      'colourBulbsCycle',
      'landingLight',
    ],
  },
  {
    name: 'pir05',
    location: 'sink',
    friendlyName: 'pir5-Kitchen-Sink',
    occupancySensorItemName: 'pir05_occupancy',
    lightLevelActiveThresholdItemName: 'ConservatoryLightTriggerLevel',
    lightLevelSensorItemName: 'BridgeLightSensorLevel',
    phrases: [
    ],
    lightConfigNames: [
      'kitchenLight_2',
      'kitchenLight_3',
    ],
  },
  {
    name: 'pir06',
    location: 'Landing',
    friendlyName: 'pir6-Landing',
    occupancySensorItemName: 'pir06_occupancy',
    lightLevelActiveThresholdItemName: 'ConservatoryLightTriggerLevel',
    lightLevelSensorItemName: 'BridgeLightSensorLevel',
    phrases: [
      'landing',
    ],
    lightConfigNames: [
      'landingLight',
    ],
  },
  {
    name: 'pir07',
    location: 'kettle',
    friendlyName: 'pir7-kettle',
    occupancySensorItemName: 'pir07_occupancy',
    lightLevelActiveThresholdItemName: 'ConservatoryLightTriggerLevel',
    lightLevelSensorItemName: 'BridgeLightSensorLevel',
    phrases: [
    ],
    lightConfigNames: [
      'kitchenLight_1',
    ],
  },
  {
    name: 'pir08',
    location: 'unplaced',
    friendlyName: 'pir8-desk',
    occupancySensorItemName: 'pir08_occupancy',
    lightLevelActiveThresholdItemName: 'ConservatoryLightTriggerLevel',
    lightLevelSensorItemName: 'BridgeLightSensorLevel',
    phrases: [
    ],
    lightConfigNames: [
      'colourBulbsCycle',
    ],
  },
];

module.exports = {
  lightConfigs,
  pirSensorConfigs,
};
