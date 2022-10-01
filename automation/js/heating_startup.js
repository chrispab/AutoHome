// from core.rules import rule
// from core.triggers import when
// from core.actions import LogAction
// from core.actions import ScriptExecution
// from java.time import ZonedDateTime as DateTime
const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('BG_Availability.js');
const { timeUtils } = require('openhab_rules_tools');
// @rule("Heating startup", description="StartUp Heating", tags=["Heating"])
// @when("System started")
// def heating_startup(event):
//     LogAction.logError("Heating startup","Heating startup")
scriptLoaded = function () {
  logger.warn('scriptLoaded -   Heating startup');

  //     if ir.getItem("masterHeatingMode") == NULL:
  //         events.postUpdate(ir.getItem("masterHeatingMode"),"auto")
  if ((items.getItem('masterHeatingMode').state.toString() == null)) {
    (items.getItem('masterHeatingMode').postUpdate('auto'));
  }

  //     for item in ir.getItem("gTemperatureSetpoints").members:
  //         if item == NULL:
  //             events.postUpdate(item,DecimalType(17))
  items.getItem('gTemperatureSetpoints').members.forEach((item) => {
    if (!item) {
      item.postUpdate(17);
    }
  });

  //     for item in ir.getItem("gHeatingModes").members:
  //         if item == NULL:
  //             events.postUpdate(item,"auto")
  items.getItem('gHeatingModes').members.forEach((item) => {
    if (!item) {
      item.postUpdate('auto');
    }
  });

  //     for item in ir.getItem("gThermostatModes").members:
  //         if item == NULL:
  //             events.postUpdate(item,"heat")
  items.getItem('gThermostatModes').members.forEach((item) => {
    if (!item) {
      item.postUpdate('heat');
    }
  });

  //     if ir.getItem("Boiler_Control") == NULL:
  //         events.postUpdate(ir.getItem("Boiler_Control"),"OFF")

  if (!items.getItem('Boiler_Control')) {
    items.getItem('Boiler_Control').postUpdate('OFF');
  }
};

// # // ! these must be set at least on first run to init them
// # //! then use each rooms program setpoint page to set
