const email = 'cbattisson@gmail.com';

const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { alerting } = require('openhab-my-utils');
var ruleUID = "final-jobs";

const logger = log(ruleUID);


scriptLoaded = function () {
  logger.info('script loaded -final-jobs');
  // audioFile = '25 Food + Drink Synthesizer.mp3';
  audioFile = 'regeneration_cycle_complete_normalised.mp3';

  infoStr = `startup xscript loaded final-jobs - ${audioFile}`;
  actions.Audio.playSound(audioFile);
  // alerting.sendInfo(infoStr);
  alerting.sendEmail('script loaded -final-jobs',infoStr,logger);

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
    // alerting.sendInfo(infoStr);
    alerting.sendEmail('SystemStartlevelTrigger_100',infoStr,logger);

    logger.info(infoStr);
  },
});




