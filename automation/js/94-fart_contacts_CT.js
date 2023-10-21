const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
// const { timeUtils } = require('openhab_rules_tools');
const {
  ON, OFF, DecimalType, PercentType,
} = require('@runtime');
var ruleUID = "contact01";
const logger = log(ruleUID);

let number = 0;
let fartString;
let numString;
const max = 29;// num farts-1

function randomFartString() {
  // generate  number in range 1 to max
  number = Math.round(Math.random() * max) + 1;
  // number = Math.round(num * 10)/10;

  logger.debug(`VVV - fart number  : ${number}`);
  // if len = 1, fs = '0'+`${number}`
  if (number.toString().length === 1) {
    numString = `0${number.toString()}`;
  } else {
    numString = number.toString();
  }
  logger.debug(`VVV - numString  : ${numString}`);

  fartString = `farts/fart-${numString}.mp3`;
  logger.info(`contact01 - fart string  : ${fartString}`);
  return fartString;
}

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
      if( Math.random() > 0.9){
        actions.Audio.playSound(randomFartString());
      }

    }

  },
});
// rules.JSRule({
//   name: 'CT contact01 went true',
//   description: 'CT contact01 went true',
//   triggers: [
//     triggers.ItemStateChangeTrigger('zb_contact_01_contact', 'false', 'true'),
//     triggers.ItemStateChangeTrigger('v_test_switch_01', 'OFF', 'ON'),
//   ],
//   execute: () => {
//     if (items.getItem('vFartDoorEnable').state.toString() === 'ON') {

//       logger.debug('CT contact01 went true');

//       if( Math.random() > 0.9){
//         actions.Audio.playSound(randomFartString());
//       }
//       // actions.Audio.setMasterVolume(vol);
//       // logger.warn(`VVV - setMasterVolume to GHM : ${vol}`);
//     }
//   },
// });
