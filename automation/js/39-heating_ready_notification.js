const {
  log, actions,
} = require('openhab');

const ruleUID = 'heating-ready-notification';

const logger = log(ruleUID);

scriptLoaded = function () {
  // actions.Voice.say('heating control is now available');
};
