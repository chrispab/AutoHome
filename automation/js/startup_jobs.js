const email = 'cbattisson@gmail.com';

const {
  log, items, rules, actions, triggers,
} = require('openhab');

scriptLoaded = function () {
  console.log('script loaded - startup jobs');
  // loadedDate = Date.now();
  // actions.Audio.playSound('fart-03.mp3');
  // actions.Audio.setMasterVolume(0.5);

  actions.Audio.playSound('regeneration_cycle_complete_normalised.mp3');
};

rules.JSRule({
  name: '0600_hours_regeneration_cycle_complete.mp3',
  description: '0600_hours_regeneration_cycle_complete.mp3',
  triggers: [triggers.SystemStartlevelTrigger(100)],
  execute: () => {
    // actions.Audio.playSound('0600_hours_regeneration_cycle_complete_normalised.mp3');
    actions.Audio.playSound('fart-03.mp3');
  },
});
