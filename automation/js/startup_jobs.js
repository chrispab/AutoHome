const email = 'cbattisson@gmail.com';

const {
  log, items, rules, actions, triggers,
} = require('openhab');

scriptLoaded = function () {
  console.log('script loaded - test-js');
  // loadedDate = Date.now();
  actions.Audio.playSound('fart-03.mp3');
  // actions.Audio.playSound('0600_hours_regeneration_cycle_complete_normalised.mp3');
};

rules.JSRule({
  name: '0600_hours_regeneration_cycle_complete.mp3',
  description: '0600_hours_regeneration_cycle_complete.mp3',
  triggers: [triggers.SystemStartlevelTrigger(70)],
  execute: () => {
    actions.Audio.playSound('0600_hours_regeneration_cycle_complete_normalised.mp3');

    // items.getItem("ZbWhiteBulb01Switch").sendCommand("OFF");
    // items.getItem("ZbWhiteBulb02Switch").sendCommand("OFF");
    // actions.NotificationAction.sendNotification(email, "Balcony lights are  OFF");
    // console.info("*********************************  ZbWhiteBulb01Switch  OFF");
    // console.debug("*********************************  ZbWhiteBulb01Switch  OFF")
  },
});
