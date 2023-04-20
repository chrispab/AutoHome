// unsigned int limitSensorValue(unsigned int reading, unsigned int min, unsigned int max){
//     if(reading > max){
//         return max;
//     }
//     if(reading < min){
//         return min;
//     }
//     return reading;
// }// //new normalising 7


// #define RAW_0PC_DRY 2500.0f //try 2970,2976,3000,3055 3100 3200,3100,2980
// #define RAW_100PC_WET 1570.0f//1725, 1712,1631,1630,1570
// #define RAW_RANGE_6 (RAW_0PC_DRY - RAW_100PC_WET)

// limitedSensorValue = limitSensorValue(moisture_raw, RAW_100PC_WET, RAW_0PC_DRY );
// float normalisedRangeSensorValue_6 = (float)abs((RAW_RANGE_6 - ((float)limitedSensorValue - RAW_100PC_WET)) / (RAW_RANGE_6 / 100.0f));
// sprintf(normalisedRangeSensorValue_6Str, "%.1f", normalisedRangeSensorValue_6);// convert float to 1dp string
// Serial.print("Sampling Sensor.....NOR limit sub range .._6");
// Serial.println(normalisedRangeSensorValue_6Str);
// MQTTclient.publish("soil1/moisture_7", normalisedRangeSensorValue_6Str);

const {
    log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('soil1_moisture');
// const { timeUtils } = require('openhab_rules_tools');
// const { toToday } = require('openhab_rules_tools/timeUtils');

// scriptLoaded = function () {
//     logger.warn('scriptLoaded - init soil1_moisture');
//     const temp = items.getItem('Soil1_Moisture_Raw').state;
//     items.getItem('CT_Temperature').sendCommand(temp);

//     logger.warn(`0 ==> STARTUP temp is: ${temp}`);
// };

function limitSensorValue(reading, min_limit, max_limit) {
    if (reading > max_limit) {
        return max_limit;
    }
    if (reading < min_limit) {
        return min_limit;
    }
    return reading;
}

const divisor = 8;
const RAW_0PC_DRY = 2600.0; //try 2970,2976,3000,3055 3100 3200,3100,2980
const RAW_100PC_WET = 1570.0;//1725, 1712,1631,1630,1570
const RAW_RANGE = (RAW_0PC_DRY - RAW_100PC_WET);

rules.JSRule({
    name: 'Soil1_Moisture_Raw readings',
    description: 'Soil1_Moisture_Raw readings',
    triggers: [triggers.ItemStateUpdateTrigger('Soil1_Moisture_Raw')],
    execute: () => {
        const moistureRaw = items.getItem('Soil1_Moisture_Raw').rawState;
        logger.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        logger.error(`!!!!! Soil1_Moisture_Raw: ${moistureRaw}`);
        logger.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);

        const limitedSensorValue = limitSensorValue(moistureRaw, RAW_100PC_WET, RAW_0PC_DRY);
        const normalisedRangeSensorValue = Math.abs((RAW_RANGE - (limitedSensorValue - RAW_100PC_WET)) / (RAW_RANGE / 100.0));

        // sprintf(normalisedRangeSensorValue_6Str, "%.1f", normalisedRangeSensorValue_6);// convert float to 1dp string
        const normalisedRangeSensorValue_1dp = (normalisedRangeSensorValue).toFixed(1);
        logger.error(`normalisedRangeSensorValue_1dp : ${normalisedRangeSensorValue_1dp}`);

        items.getItem('Soil1_Moisture_OH_1').postUpdate(normalisedRangeSensorValue_1dp);
        logger.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);

        // logger.warn(`CT_TEMP_CaLC, previous temp is: ${prevTemp}, new raw temp is: ${rawTemp}, CT_Temperature(newTemp): ${items.getItem('CT_Temperature').state}`);
    },
});
