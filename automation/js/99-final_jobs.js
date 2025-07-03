const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { alerting } = require('openhab-my-utils');

const ruleUID = 'final-jobs';
const logger = log(ruleUID);

scriptLoaded = function () {
  logger.info('script loaded -final-jobs');
  // audioFile = '25 Food + Drink Synthesizer.mp3';
  const audioFile = 'regeneration_cycle_complete_normalised.mp3';

  const infoStr = `startup script loaded final-jobs - ${audioFile}`;
  actions.Audio.playSound(audioFile);
  alerting.sendEmail('openhab script loaded -final-jobs', infoStr, logger);

  // turn off all items in gZbAllBulbs group

  const bulbs = items.getItem('gZbAllBulbs');
  if (bulbs && bulbs.members) {
    bulbs.members.forEach((bulb) => {
      if (bulb.state === 'ON') {
        bulb.sendCommand('OFF');
      }
    });
  } else {
    logger.warn('gZbAllBulbs group not found or has no members.');
  }
  logger.error(infoStr);
};

require('@runtime').lifecycleTracker.addDisposeHook(() => {
  // actions.Audio.playSound('61 Transporter Materialization.mp3');
  // actions.Audio.playSound('61 Transporter Materialization.mp3');
  alerting.sendEmail('openhab addDisposeHook', 'lifecycleTracker.addDisposeHook', logger);
  logger.info('lifecycleTracker.addDisposeHook,');
  // actions.Voice.say('startup complete');
});
