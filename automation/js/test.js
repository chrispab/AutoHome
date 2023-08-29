// const email = 'cbattisson@gmail.com';
const {
    log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');
const { myutils } = require('personal');
const logger = log('MQTTThingWiFiPowerSocket4_Rssi');
// const {
//   log, items, rules, actions, triggers,
// } = require('openhab');

// scriptLoaded = function () {
//   console.log('script loaded - test-js');
//   loadedDate = Date.now();
//   actions.Audio.playSound('fart-03.js');
// };

rules.JSRule({
    name: 'test',
    description: '0600_hours_regeneration_cycle_complete.mp3',
    triggers: [triggers.ItemStateUpdateTrigger('MQTTThingWiFiPowerSocket4_Rssi')],
    execute: () => {
        // actions.Audio.playSound('0600_hours_regeneration_cycle_complete.mp3');

        // myutils.toggleItem('KT_light_1_Power', 5, 2000, logger);

        // items.getItem("ZbWhiteBulb01Switch").sendCommand("OFF");
        // items.getItem("ZbWhiteBulb02Switch").sendCommand("OFF");
        // actions.NotificationAction.sendNotification(email, "Balcony lights are  OFF");
        logger.error(`wifi_socket_4_rssi: ${items.getItem('wifi_socket_4_rssi').state.toString()}`);
        logger.error(`MQTTThingWiFiPowerSocket4_Rssi: ${items.getItem('MQTTThingWiFiPowerSocket4_Rssi').state.toString()}`);

    },
});
