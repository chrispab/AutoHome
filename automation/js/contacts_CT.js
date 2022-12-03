const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
// const { timeUtils } = require('openhab_rules_tools');
const {
  ON, OFF, DecimalType, PercentType,
} = require('@runtime');

const logger = log('contact01.js');
let number = 0;
let fartString;
let numString;
const max = 29;// num farts-1
function randomFartString() {
  // generate  number in range 1 to max
  number = Math.round(Math.random() * max) + 1;
  // number = Math.round(num * 10)/10;

  logger.warn(`VVV - fart number  : ${number}`);
  // if len = 1, fs = '0'+`${number}`
  if (number.toString().length === 1) {
    numString = `0${number.toString()}`;
  } else {
    numString = number.toString();
  }
  logger.warn(`VVV - numString  : ${numString}`);

  fartString = `farts/fart-${numString}.mp3`;
  logger.warn(`VVV - fart string  : ${fartString}`);
  return fartString;
}

let vol = 0.5;
rules.JSRule({
  name: 'CT contact01 went fasle',
  description: 'CT contact01 went false',
  triggers: [
    triggers.ItemStateChangeTrigger('zb_contact_01_contact', 'true', 'false'),
    triggers.ItemStateChangeTrigger('v_test_switch_01', 'ON', 'OFF'),
  ],
  execute: () => {
    logger.warn('CT contact01 went false');

    vol = actions.Audio.getMasterVolume();
    let newVol = vol;
    newVol = 1.0;
    logger.warn(`VVV - getMasterVolume from GHM : ${vol}`);

    actions.Audio.setMasterVolume(newVol);

    actions.Audio.playSound(randomFartString());
  },
});
rules.JSRule({
  name: 'CT contact01 went true',
  description: 'CT contact01 went true',
  triggers: [
    triggers.ItemStateChangeTrigger('zb_contact_01_contact', 'false', 'true'),
    triggers.ItemStateChangeTrigger('v_test_switch_01', 'OFF', 'ON'),
  ],
  execute: () => {
    logger.warn('CT contact01 went true');

    actions.Audio.playSound(randomFartString());

    actions.Audio.setMasterVolume(vol);
    logger.warn(`VVV - setMasterVolume to GHM : ${vol}`);
  },
});
