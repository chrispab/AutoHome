const email = 'cbattisson@gmail.com';

const {
  log, items, rules, actions, triggers,
} = require('openhab');

scriptLoaded = function () {
  console.log('script loaded - test-js');
  loadedDate = Date.now();
  actions.Audio.playSound('0600_hours_regeneration_cycle_complete.mp3');
};

// rules.JSRule({
//   name: "ZbWhiteBulb01Switch  OFF",
//   description: "Light will turn on when it's 5:00pm",
//   triggers: [triggers.GenericCronTrigger("0 0/1 * * * ?")],
//   execute: data => {
//     // items.getItem("ZbWhiteBulb01Switch").sendCommand("OFF");
//     // items.getItem("ZbWhiteBulb02Switch").sendCommand("OFF");
//     // actions.NotificationAction.sendNotification(email, "Balcony lights are  OFF");
//     console.info("*********************************  ZbWhiteBulb01Switch  OFF");
//     console.debug("*********************************  ZbWhiteBulb01Switch  OFF")

//   }
// });
