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

  infoStr = `startup script loaded final-jobs - ${audioFile}`;
  actions.Audio.playSound(audioFile);
  alerting.sendEmail('openhab script loaded -final-jobs',infoStr,logger);

  logger.info(infoStr);
};

require('@runtime').lifecycleTracker.addDisposeHook(() => {
  // actions.Audio.playSound('61 Transporter Materialization.mp3');
  // actions.Audio.playSound('61 Transporter Materialization.mp3');
  alerting.sendEmail('openhab addDisposeHook', 'lifecycleTracker.addDisposeHook',logger);
  logger.info('lifecycleTracker.addDisposeHook,');
  actions.Voice.say('final jobs complete');

});




