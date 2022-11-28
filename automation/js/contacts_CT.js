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
    // eslint-disable-next-line max-len
    // const message = 'Hey Elsie, youve left the back door open. Please close it, or get a cuffing';
    vol = actions.Audio.getMasterVolume();
    let newVol = vol;
    newVol = 1.0;
    logger.warn(`VVV - getMasterVolume from GHM : ${vol}`);

    // actions.Audio.increaseMasterVolume(0.9);
    actions.Audio.setMasterVolume(newVol);

    // actions.Audio.playSound('fart-08.mp3');
    actions.Audio.playSound(randomFartString());

    // actions.Audio.setMasterVolume(vol);
    // actions.Voice.say(message);
    // turnOnTV('shutdownKodiBedroomProxy', 'wifi_socket_3_power', message);
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
    // const message = 'Thanks else';
    // actions.Voice.say(message);
    // vol = actions.Audio.getMasterVolume();
    // actions.Audio.increaseMasterVolume(100);
    // actions.Audio.playSound('fart-03.mp3');#
    actions.Audio.playSound(randomFartString());

    actions.Audio.setMasterVolume(vol);
    logger.warn(`VVV - setMasterVolume to GHM : ${vol}`);

    // turnOnTV('shutdownKodiBedroomProxy', 'wifi_socket_3_power', message);
  },
});
