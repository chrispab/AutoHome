/* eslint-disable max-len */
const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { alerting } = require('openhab-my-utils');

const ruleUID = 'SoilMoistureSensorProcessing';
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.soil_moisture
// log:set INFO org.openhab.automation.openhab-js.soil_moisture

// function limitSensorValue(reading, minLimit, maxLimit) {
//   if (reading > maxLimit) {
//     return maxLimit;
//   }
//   if (reading < minLimit) {
//     return minLimit;
//   }
//   return reading;
// }

// Sensor Calibration Values - Adjust these based on your sensor readings.
// const RAW_0PC_DRY = 1835.0;
// const RAW_100PC_WET = 1390.0;
// const RAW_0PC_DRY = 1631.0;
// const RAW_100PC_WET = 1330.0;
// const RAW_0PC_DRY = 1574.0;
// const RAW_100PC_WET = 1365.0;
// const RAW_0PC_DRY = 2060.0;
// const RAW_100PC_WET = 1600.0;
// const RAW_100PC_WET = 1416.0;
// const RAW_100PC_WET = 1400.0;
// const RAW_100PC_WET = 1420.0;
// const RAW_0PC_DRY = 1735.0;
// const RAW_0PC_DRY = 2423.0;
// const RAW_100PC_WET = 2000.0;
// const RAW_100PC_WET = 1600.0;
// const RAW_0PC_DRY = 2270.0;
// const RAW_0PC_DRY = 2280.0;
// const RAW_0PC_DRY = 2290.0;
// const RAW_0PC_DRY = 2000.0;
// const RAW_0PC_DRY = 2260.0;
const RAW_0PC_DRY = 900.0;// new sensor

// const RAW_100PC_WET = 2020.0;
// const RAW_100PC_WET = 1920.0;
// const RAW_100PC_WET = 1910.0;
// const RAW_100PC_WET = 1760.0;
// const RAW_100PC_WET = 1730.0;
// const RAW_100PC_WET = 1900.0;
const RAW_100PC_WET = 0.0;

// const RAW_RANGE = RAW_0PC_DRY - RAW_100PC_WET;

// rules.JSRule({
//   name: 'calculate Soil Moisture sensor percentage from Raw reading',
//   description: 'Calculates zone soil moisture sensor percentage when new sensor readings are received, and sends MQTT updates',
//   triggers: [
//     triggers.ItemStateUpdateTrigger('Soil1_Moisture_Raw'),
//     triggers.ItemStateUpdateTrigger('Zone1SoilMoistureSensor1_ReadingRaw'),
//     triggers.ItemStateUpdateTrigger('Zone2SoilMoistureSensor1_ReadingRaw'),
//     triggers.ItemStateUpdateTrigger('Zone3SoilMoistureSensor1_ReadingRaw'),
//   ],
//   execute: (event) => {
//     logger.error(`${event.itemName} is the trigger item!`);

//     const readingRawItem = items.getItem(event.itemName);
//     if (!readingRawItem) {
//       logger.error(`${event.itemName} item not found!`);
//       return;
//     }
//     // Explicit type conversion. Handles potential errors
//     const readingRaw = parseFloat(readingRawItem.state);
//     if (Number.isNaN(readingRaw)) {
//       logger.error(`Invalid value for ${readingRawItem.name}: ${readingRawItem.state}`);
//       return;
//     }
//     // Use the limited value
//     const limitedReading = limitSensorValue(readingRaw, RAW_100PC_WET, RAW_0PC_DRY);
//     // Improved calculation, handles edge cases
//     const moisturePercentage = Math.max(
//       0,
//       Math.min(100, ((RAW_RANGE - (limitedReading - RAW_100PC_WET)) / RAW_RANGE) * 100),
//     ).toFixed(1);

//     // get the sensor name from the item name, assuming a consistent naming convention
//     const PercentMoistureCalculatedName = event.itemName.replace('_ReadingRaw', '_PercentMoistureCalculated').replace('_Raw', '_Percentage_Calculated');
//     logger.debug(`Calculated moisture percentage for ${PercentMoistureCalculatedName}: ${moisturePercentage}% (Raw: ${readingRaw}, Limited Raw: ${limitedReading})`);
//     items.getItem(PercentMoistureCalculatedName).postUpdate(moisturePercentage);
//     items.getItem(PercentMoistureCalculatedName).postUpdate(moisturePercentage);
//     const soil_moisture_1_raw_slew_limited = items.getItem('soil_moisture_1_raw_slew_limited').state;

//     // send calculated moisture percentage via mqtt
//     // Get the MQTT Broker Thing actions
//     const mqttActions = actions.Things.getActions('mqtt', 'mqtt:broker:MyMQTTBroker'); // FIXME: Replace 'mqtt:broker:mosquitto' with your actual MQTT Broker Thing UID
//     if (mqttActions) {
//       mqttActions.publishMQTT('openhab/soil_moisture_sensor_1/percentage', moisturePercentage.toString());
//       logger.debug(`Soil moisture calculated and published: ${moisturePercentage}%`);
//       mqttActions.publishMQTT('openhab/soil_moisture_sensor_1/raw_slew_limited', soil_moisture_1_raw_slew_limited.toString());
//       logger.debug(`soil_moisture_1_raw_slew_limited calculated and published: ${soil_moisture_1_raw_slew_limited}%`);
//     } else {
//       logger.error('Could not get MQTT actions. Please check your MQTT Broker Thing UID.');
//     }
//   },
// });

const alertMinimumMoistureLevel = 33;

rules.JSRule({
  name: 'zone moisture sensor value low alert',
  description: 'Checks soil moisture levels and sends email alert if too low',
  triggers: [
    triggers.GenericCronTrigger('0 0 0/4 ? * * *'), // Check every 4 hours. Adjust as needed
    // triggers.GenericCronTrigger('0 0/30 * ? * * *'), // Check every 30 minutes. Adjust as needed
  ],
  execute: () => {
    logger.info('Checking soil moisture levels...');

    // check each soil moisture sensor percentage item, and send alert if any are below the threshold
    const moisturePercentageItems = [
      items.getItem('Soil1_Moisture_Percentage_Calculated'),
      items.getItem('Soil2_Moisture_Percentage_Calculated'),
      items.getItem('Soil3_Moisture_Percentage_Calculated'),
    ];

    moisturePercentageItems.forEach((item) => {
      if (!item) {
        logger.error(`${item.name} item not found!`);
        return;
      }

      const currentMoisturePercentage = parseFloat(item.state);
      if (Number.isNaN(currentMoisturePercentage)) {
        logger.error(`Invalid value for ${item.name}: ${item.state}`);
        return;
      }

      if (currentMoisturePercentage < alertMinimumMoistureLevel && items.getItem('Soil1_Reachable').state.toString() === 'Online') {
        alerting.sendEmail('MOISTURE LOW!', `Zone 3 moisture low: ${currentMoisturePercentage}%`);
      }
    });
    // // Explicit type conversion, Handles potential errors
    // const currentMoisturePercentage = parseFloat(moisturePercentageItem.state);

    // if (Number.isNaN(currentMoisturePercentage)) {
    //   logger.error(`Invalid value for Soil1_Moisture_OH_1: ${moisturePercentageItem.state}`);
    //   return;
    // }

    // if (currentMoisturePercentage < alertMinimumMoistureLevel && items.getItem('Soil1_Reachable').state.toString() === 'Online') {
    // // if (currentMoisturePercentage < alertMinimumMoistureLevel) {
    //   alerting.sendEmail('MOISTURE LOW!', `Zone 3 moisture low: ${currentMoisturePercentage}%`);
    // }
  },
});
