const email = 'cbattisson@gmail.com';

const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { alerting } = require('personal');

scriptLoaded = function () {
  console.log('script loaded - startup jobs');
  actions.Audio.playSound('regeneration_cycle_complete_normalised.mp3');
  alerting.sendInfo('startup script loaded zzz_startup_jobs');

};

rules.JSRule({
  name: 'SystemStartlevelTrigger(100)',
  description: 'SystemStartlevelTrigger(100)',
  // triggers: [triggers.SystemStartlevelTrigger(100)],
  triggers: [triggers.SystemStartlevelTrigger(100)],

  execute: () => {
    // actions.Audio.playSound('0600_hours_regeneration_cycle_complete_normalised.mp3');
    actions.Audio.playSound('input_ok_3_clean.mp3');
    alerting.sendInfo('triggers.SystemStartlevelTrigger(100)');

  },
});
