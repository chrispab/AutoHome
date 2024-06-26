const {
  log, items, rules, actions, triggers,
} = require('openhab');
var ruleUID = "heating-startup";

const logger = log(ruleUID);

// ! these must be set at least on first run to init them
//! then use each rooms program setpoint page to set
scriptLoaded = function () {
  logger.info('scriptLoaded -   Heating startup');

  if ((items.getItem('masterHeatingMode').state.toString() == null)) {
    (items.getItem('masterHeatingMode').postUpdate('auto'));
  }

  items.getItem('gThermostatTemperatureSetpoints').members.forEach((item) => {
    if (item.state === 'NULL') {
      item.postUpdate(17);
    }
  });

  items.getItem('gHeatingModes').members.forEach((item) => {
    if (item.state === 'NULL') {
      item.postUpdate('auto');
    }
  });

  items.getItem('gThermostatModes').members.forEach((item) => {
    if (item.state === 'NULL') {
      item.postUpdate('heat');
    }
  });

  if (!items.getItem('Boiler_Control')) {
    items.getItem('Boiler_Control').postUpdate('OFF');
  }
};


