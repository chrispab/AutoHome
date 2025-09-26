const {
  log, items, rules, actions, triggers,
} = require('openhab');

const ruleUID = 'auto CT lights';
const logger = log(ruleUID);
// const { timeUtils } = require('openhab_rules_tools');
const { alerting } = require('openhab-my-utils');

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
  },
});

rules.JSRule({
  name: 'alert when gKT_WiFiLightsReachable changed',
  description: 'alert when gKT_WiFiLightsReachable changed',
  triggers: [triggers.GroupStateChangeTrigger('gKT_WiFiLightsReachable')],
  execute: (event) => {
    logger.info(`alert when gKT_WiFiLightsReachable offline   gKT_WiFiLightsReachable==: ${JSON.stringify(event)}`);
    alerting.sendEmail('gKT_WiFiLightsReachable!', `gKT_WiFiLightsReachable: ${JSON.stringify(event)}%`);

    // items.getItem('gConservatoryLights').sendCommand('OFF');
    // items.getItem('gColourBulbs').sendCommand('OFF');
  },
});
// gKT_WiFiLightsReachable
