const {
  log, actions
} = require('openhab');

var ruleUID = "heating-ready-notification";

const logger = log(ruleUID);

scriptLoaded = function () {
  actions.Voice.say('heating control is now available');
};