const {
  log, actions
} = require('openhab');

var ruleUID = "heating-ready-notification";

const logger = log(ruleUID);
// // openhab> log:set DEBUG org.openhab.automation.openhab-js.heating_change


scriptLoaded = function () {
  actions.Voice.say('heating now available');
};