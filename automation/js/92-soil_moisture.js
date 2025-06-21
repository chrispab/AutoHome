const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { alerting } = require('openhab-my-utils');

const ruleUID = 'soil_moisture';
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.soil_moisture
// log:set INFO org.openhab.automation.openhab-js.soil_moisture

function limitSensorValue(reading, minLimit, maxLimit) {
  if (reading > maxLimit) {
    return maxLimit;
  }
  if (reading < minLimit) {
    return minLimit;
  }
  return reading;
}

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
const RAW_0PC_DRY = 2250.0;
// const RAW_100PC_WET = 2020.0;
const RAW_100PC_WET = 1920.0;

const RAW_RANGE = RAW_0PC_DRY - RAW_100PC_WET;

rules.JSRule({
  name: 'Soil1_Moisture_Raw readings',
  description: 'Calculates soil moisture percentage from raw sensor readings',
  triggers: [triggers.ItemStateUpdateTrigger('Soil1_Moisture_Raw')],
  execute: () => {
    const rawMoistureItem = items.getItem('Soil1_Moisture_Raw');
    if (!rawMoistureItem) {
      logger.error('Soil1_Moisture_Raw item not found!');
      return;
    }
    const moistureRaw = parseFloat(rawMoistureItem.state); // Explicit type conversion. Handles potential errors
    if (isNaN(moistureRaw)) {
      logger.error(`Invalid value for Soil1_Moisture_Raw: ${rawMoistureItem.state}`);
      return;
    }

    const limitedMoisture = limitSensorValue(moistureRaw, RAW_100PC_WET, RAW_0PC_DRY); // Use the limited value
    const moisturePercentage = Math.max(0, Math.min(100, ((RAW_RANGE - (limitedMoisture - RAW_100PC_WET)) / RAW_RANGE) * 100)).toFixed(1); // Improved calculation, handles edge cases

    items.getItem('Soil1_Moisture_OH_1').postUpdate(moisturePercentage);
    items.getItem('Soil1_Moisture_Percentage_Calculated').postUpdate(moisturePercentage);

    logger.debug(`Soil moisture calculated: ${moisturePercentage}%`); // More concise logging
  },
});

const alertMinimumMoistureLevel = 33;

rules.JSRule({
  name: 'zone3 moisture low alert',
  description: 'Sends email alert if soil moisture is too low',
  triggers: [
    triggers.GenericCronTrigger('0 0 0/4 ? * * *'), // Check every 4 hours. Adjust as needed
  ],
  execute: () => {
    // const moistureItem = items.getItem('Soil1_Moisture_OH_1');
    const moisturePercentageItem = items.getItem('Soil1_Moisture_Percentage_Calculated');
    if (!moisturePercentageItem) {
      logger.error('Soil1_Moisture_Percentage_Calculated item not found!');
      return;
    }
    // Explicit type conversion, Handles potential errors
    const currentMoisture = parseFloat(moisturePercentageItem.state);

    if (Number.isNaN(currentMoisture)) {
      logger.error(`Invalid value for Soil1_Moisture_OH_1: ${moisturePercentageItem.state}`);
      return;
    }

    if (currentMoisture < alertMinimumMoistureLevel && items.getItem('Soil1_Reachable').state.toString() === 'Online') {
      alerting.sendEmail('MOISTURE LOW!', `Zone 3 moisture low: ${currentMoisture}%`);
    }
  },
});
