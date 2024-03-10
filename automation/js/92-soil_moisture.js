const {
    log, items, rules, actions, triggers,
} = require('openhab');
const { alerting } = require('openhab-my-utils');
var ruleUID = "soil_moisture";
const logger = log(ruleUID);

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
// const RAW_0PC_DRY = 2600.0; //try 2970,2976,3000,3055 3100 3200,3100,2980
const RAW_0PC_DRY = 2970.0; //try 2970,2976,3000,3055 3100 3200,3100,2980

const RAW_100PC_WET = 1570.0;//1725, 1712,1631,1630,1570
const RAW_RANGE = (RAW_0PC_DRY - RAW_100PC_WET);

rules.JSRule({
    name: 'Soil1_Moisture_Raw readings',
    description: 'Soil1_Moisture_Raw readings',
    triggers: [triggers.ItemStateUpdateTrigger('Soil1_Moisture_Raw')],
    execute: () => {
        const moistureRaw = items.getItem('Soil1_Moisture_Raw').rawState;
        logger.debug(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        logger.debug(`!!!!! Soil1_Moisture_Raw: ${moistureRaw}`);
        logger.debug(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);

        const limitedSensorValue = limitSensorValue(moistureRaw, RAW_100PC_WET, RAW_0PC_DRY);
        logger.debug(`!!!!! limitedSensorValue: ${limitedSensorValue}`);
        const normalisedRangeSensorValue = Math.abs((RAW_RANGE - (limitedSensorValue - RAW_100PC_WET)) / (RAW_RANGE / 100.0));
        logger.debug(`!!!!! normalisedRangeSensorValue: ${normalisedRangeSensorValue}`);

        // sprintf(normalisedRangeSensorValue_6Str, "%.1f", normalisedRangeSensorValue_6);// convert float to 1dp string
        const normalisedRangeSensorValue_1dp = (normalisedRangeSensorValue).toFixed(1);
        logger.debug(`normalisedRangeSensorValue_1dp, Soil1_Moisture_OH_1 : ${normalisedRangeSensorValue_1dp}`);

        items.getItem('Soil1_Moisture_OH_1').postUpdate(normalisedRangeSensorValue_1dp);
        logger.debug(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);

        // logger.warn(`CT_TEMP_CaLC, previous temp is: ${prevTemp}, new raw temp is: ${rawTemp}, CT_Temperature(newTemp): ${items.getItem('CT_Temperature').state}`);
    },
});

const alertMinimumMoistureLevel = 30;

rules.JSRule({
    name: 'zone3 moisture low',
    description: 'zone3 moisture low',
    triggers: [
        triggers.ItemStateChangeTrigger('testBtn1', 'OFF', 'ON'),
        // triggers.ItemStateUpdateTrigger('Soil1_Moisture_OH_1'),
        // triggers.GenericCronTrigger("0 0 * ? * * *"),
        triggers.GenericCronTrigger("0 0 0/4 ? * * *"),
        // 0 0 0/4 ? * * *
        // triggers.GenericCronTrigger("0 0/1 * * * * "),# ev minute

        // */5 * * * *
    ],
    execute: (data) => {
        currentState = items.getItem('KT_light_1_Power').state;
        currentMoisture = items.getItem('Soil1_Moisture_OH_1').rawState;

        // currentLightSensorLevel > items.getItem('CT_Auto_Lighting_Trigger_SetPoint').rawState
        if (currentMoisture < alertMinimumMoistureLevel && items.getItem('Soil1_Reachable').state.toString() == 'Online') {
            alerting.sendEmail('openhab MOISTURE LOW!', `zone 3 moisture low: ${items.getItem('Soil1_Moisture_OH_1').state}`);
        }

    },
});
