// from core.rules import rule
// from core.triggers import when
// from core.actions import ScriptExecution

// @rule("System started", description="System started")
// @when("System started")
// def Sys_started(event):
//     Sys_started.log.info("Sys_started MARK ZONES OFFLINE")
//     events.postUpdate("Zone3Reachable", "Offline")
//     events.postUpdate("Zone1Reachable", "Offline")
const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('system_started');
const { timeUtils } = require('openhab_rules_tools');

scriptLoaded = function () {
  logger.warn('scriptLoaded -   init   system_started');
  items.getItem('Zone1Reachable').postUpdate('Offline');
  items.getItem('Zone3Reachable').postUpdate('Offline');
};
