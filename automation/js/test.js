// const email = 'cbattisson@gmail.com';
const {
    log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');
const { myutils } = require('personal');
const logger = log('TVs on off.js');
// const {
//   log, items, rules, actions, triggers,
// } = require('openhab');

// scriptLoaded = function () {
//   console.log('script loaded - test-js');
//   loadedDate = Date.now();
//   actions.Audio.playSound('fart-03.js');
// };

rules.JSRule({
    name: '0600_hours_regeneration_cycle_complete.mp3',
    description: '0600_hours_regeneration_cycle_complete.mp3',
    triggers: [triggers.ItemStateChangeTrigger('testSwitch1', 'OFF', 'ON')],
    execute: () => {
        actions.Audio.playSound('0600_hours_regeneration_cycle_complete.mp3');

        // myutils.toggleItem('KT_light_1_Power', 5, 2000, logger);

        // items.getItem("ZbWhiteBulb01Switch").sendCommand("OFF");
        // items.getItem("ZbWhiteBulb02Switch").sendCommand("OFF");
        // actions.NotificationAction.sendNotification(email, "Balcony lights are  OFF");
        console.info("*********************************  ZbWhiteBulb01Switch  OFF");
        console.debug("*********************************  ZbWhiteBulb01Switch  OFF")
    },
});
