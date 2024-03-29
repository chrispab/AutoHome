const {
  log, items, rules, actions, triggers,
} = require('openhab');
// const { myutils } = require('personal');

const logger = log('auto CT lights');
// const { timeUtils } = require('openhab_rules_tools');

const { alerting } = require('personal');

// let previousLightSensorLevel = null;
// let currentLightSensorLevel = null;

// when script reloaded, set auto detection lighting to suitable defaults
scriptLoaded = function () {
  // logger.error('scriptLoaded - set all CT auto lighting items');

};

// turn off conservatory lights when it goes from dark to light
rules.JSRule({
  name: 'alert when service changed',
  description: 'alert when service changed',
  triggers: [triggers.GroupStateChangeTrigger('gServices_Core_Online')],
  execute: (event) => {
    logger.info(`alert when service offline   gServices_Core_Online==: ${JSON.stringify(event)}`);
    // items.getItem('gConservatoryLights').sendCommand('OFF');
    // items.getItem('gColourBulbs').sendCommand('OFF');
    // alerting.sendInfo(`alert when service offline   gServices_Core_Online==: ${JSON.stringify(event)}`);
  },
});
