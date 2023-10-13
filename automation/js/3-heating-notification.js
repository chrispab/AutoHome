const {
  log, items, rules, triggers,
} = require('openhab');

var ruleUID = "heating-notification";

const logger = log(ruleUID);
// // const { CountdownTimer, timeUtils, TimerMgr } = require('openhab_rules_tools');
// // openhab> log:set DEBUG org.openhab.automation.openhab-js.heating_change

// // if gHeatingModes, gTemperatureSetpoints ,gThermostatTemperatureAmbients are updated
// // figure out if a room heater needs turning on
scriptLoaded = function () {
    actions.Voice.say('heating now available');
  };