const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
// const { timeUtils } = require('openhab_rules_tools');
const {
  ON, OFF, DecimalType, PercentType,
} = require('@runtime');

const ruleUID = 'contact01';
const logger = log(ruleUID);

const max = 29;// num farts-1

const vol = 0.5;
rules.JSRule({
  name: 'CT contact01 went fasle',
  description: 'CT contact01 went false',
  triggers: [
    triggers.ItemStateChangeTrigger('zb_contact_01_contact'),
    triggers.ItemStateChangeTrigger('v_test_switch_01'),
  ],
  execute: () => {
    logger.debug('CT contact01 went false');
    if (items.getItem('vFartDoorEnable').state.toString() === 'ON') {
      // vol = actions.Audio.getMasterVolume();
      // let newVol = vol;
      // newVol = 1.0;
      // logger.warn(`VVV - getMasterVolume from GHM : ${vol}`);

      // actions.Audio.setMasterVolume(newVol);
      // generate  number in range 1 to max
      if (Math.random() > 0.9) {
        actions.Audio.playSound(randomFartString());
      }
    }
  },
});

// items
// String        LivingRoomSpeaker_Playuri_backup    "Play uri backup"

// rule
// when
//     Item received command
// then
//     if (LivingRoomSpeaker_AppId.state == "CC1AD845" && LivingRoomSpeaker_Control.state == PLAY) {
//     LivingRoomSpeaker_Playuri_backup.postUpdate(LivingRoomSpeaker_Playuri.state)
//     playSound("doorbell.mp3")
//     Thread::sleep(3000)
//     LivingRoomSpeaker_Playuri.sendCommand(LivingRoomSpeaker_Playuri_backup.state.toString)
//     LivingRoomSpeaker_Control.sendCommand(PLAY) }
//     else {playSound("barking.mp3")}
// end

function randomFartString() {
  // generate  number in range 1 to max
  const number = Math.round(Math.random() * max) + 1;
  // number = Math.round(num * 10)/10;
  let numString;

  logger.debug(`VVV - fart number  : ${number}`);
  // if len = 1, fs = '0'+`${number}`
  if (number.toString().length === 1) {
    numString = `0${number.toString()}`;
  } else {
    numString = number.toString();
  }
  logger.debug(`VVV - numString  : ${numString}`);

  const fartString = `farts/fart-${numString}.mp3`;
  logger.info(`contact01 - fart string  : ${fartString}`);
  return fartString;
}
