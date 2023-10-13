const {
  log, actions, items, rules, triggers,
} = require('openhab');

var ruleUID = "heating-notification";

const logger = log(ruleUID);
// // openhab> log:set DEBUG org.openhab.automation.openhab-js.heating_change


scriptLoaded = function () {
    actions.Voice.say('heating now available');
  };