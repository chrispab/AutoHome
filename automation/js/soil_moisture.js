const {
    log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('soil1_moisture');

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


rules.JSRule({
    name: 'zone3 moisture low',
    description: 'zone3 moisture low',
    triggers: [
        triggers.ItemStateChangeTrigger('testBtn1', 'OFF', 'ON'),

        triggers.ItemStateChangeTrigger('Soil1_Moisture_OH_1'),
    ],
    execute: (data) => {
        currentState = items.getItem('KT_light_1_Power').state;
        currentMoisture = items.getItem('Soil1_Moisture_OH_1').state;

        items.getItem('KT_light_1_Power').sendCommand('ON');
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(1), () => {
            items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
            console.error('KT_light_1_Power');
        });
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(2), () => {
            items.getItem('KT_light_1_Power').sendCommand('ON'); // IR code
            console.error('KT_light_1_Power');
        });
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(3), () => {
            items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
            console.error('KT_light_1_Power');
        });
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(4), () => {
            items.getItem('KT_light_1_Power').sendCommand('ON'); // IR code
            console.error('KT_light_1_Power');
        });
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(5), () => {
            items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
            console.error('KT_light_1_Power');
        });
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(6), () => {
            items.getItem('KT_light_1_Power').sendCommand('ON'); // IR code
            console.error('KT_light_1_Power');
        });
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(7), () => {
            items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
            console.error('KT_light_1_Power');
        });
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(8), () => {
            items.getItem('KT_light_1_Power').sendCommand(currentState);
            console.error('KT_light_1_Power restore original state');
        });
    },
});
