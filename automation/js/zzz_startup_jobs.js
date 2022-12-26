const email = 'cbattisson@gmail.com';

const {
  log, items, rules, actions, triggers,
} = require('openhab');

scriptLoaded = function () {
  console.log('script loaded - startup jobs');
  actions.Audio.playSound('regeneration_cycle_complete_normalised.mp3');
};

rules.JSRule({
  name: 'SystemStartlevelTrigger(100)',
  description: 'SystemStartlevelTrigger(100)',
  // triggers: [triggers.SystemStartlevelTrigger(100)],
  triggers: [triggers.SystemStartlevelTrigger(40)],

  execute: () => {
    // actions.Audio.playSound('0600_hours_regeneration_cycle_complete_normalised.mp3');
    actions.Audio.playSound('input_ok_3_clean.mp3');
  },
});
