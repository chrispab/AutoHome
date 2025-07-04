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

  // turn off all items in gZbAllBulbs group gZbWhiteBulbs
  // const allBulbs1 = items.getItem('gZbAllBulbs');
  // const allBulbs2 = items.getItem('gZbWhiteBulbs');
  // // iterate through all members of the group and sub groups and turn them off
  // function turnOffGroupMembers(groupItem) {
  //   if (!groupItem || !groupItem.members) return;
  //   groupItem.members.forEach((member) => {
  //     if (member.members && member.members.length > 0) {
  //       // Recursively turn off sub-group members
  //       turnOffGroupMembers(member);
  //     } else {
  //       member.sendCommand('OFF');
  //     }
  //   });
  // }

  // turnOffGroupMembers(allBulbs2);

  // if (allBulbs && allBulbs.members) {
  //   allBulbs.members.forEach((bulb) => {
  //     // if (bulb.state === 'ON') {
  //     bulb.sendCommand('OFF');
  //     // }
  //   });
  // }

  const bulbs = items.getItem('gZbWhiteBulb02');
  if (bulbs && bulbs.members) {
    bulbs.members.forEach((bulb) => {
      // if (bulb.state === 'ON') {
      bulb.sendCommand('OFF');
      // }
    });
  } else {
    logger.warn('gZbWhiteBulbs group not found or has no members.');
  }
  // // repeat for gZbColourBulbs group
  // const colourBulbs = items.getItem('gZbColourBulbs');
  // if (colourBulbs && colourBulbs.members) {
  //   colourBulbs.members.forEach((bulb) => {
  //     // if (bulb.state === 'ON') {
  //     bulb.sendCommand('OFF');
  //     // }
  //   });
  // } else {
  //   logger.warn('gZbColourBulbs group not found or has no members.');
  // }

  logger.error(infoStr);
};

require('@runtime').lifecycleTracker.addDisposeHook(() => {
  // actions.Audio.playSound('61 Transporter Materialization.mp3');
  // actions.Audio.playSound('61 Transporter Materialization.mp3');
  alerting.sendEmail('openhab addDisposeHook', 'lifecycleTracker.addDisposeHook', logger);
  logger.info('lifecycleTracker.addDisposeHook,');
  // actions.Voice.say('startup complete');
});
