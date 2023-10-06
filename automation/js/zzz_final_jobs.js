const email = 'cbattisson@gmail.com';

const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { alerting } = require('personal');
var ruleUID = "final";

const logger = log(ruleUID);


scriptLoaded = function () {
  logger.info('script loaded - startup jobs');
  // audioFile = '25 Food + Drink Synthesizer.mp3';
  audioFile = 'regeneration_cycle_complete_normalised.mp3';

  infoStr = `startup xscript loaded zzz_startup_jobs - ${audioFile}`;
  actions.Audio.playSound(audioFile);
  alerting.sendInfo(infoStr);
  logger.info(infoStr);
};

rules.JSRule({
  name: 'SystemStartlevelTrigger_100',
  description: 'SystemStartlevelTrigger(100)',
  triggers: [triggers.SystemStartlevelTrigger(100)],
  execute: () => {
    audioFile = '0600_hours_regeneration_cycle_complete_normalised.mp3';
    infoStr = `triggers.SystemStartlevelTrigger(100) -  - ${audioFile}`;

    actions.Audio.playSound(audioFile);
    alerting.sendInfo(infoStr);
    logger.info(infoStr);
  },
});




