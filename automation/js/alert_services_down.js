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

  // previousLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;
  // currentLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;
  // items.getItem('BridgeLightSensorTrend').sendCommand('ON'); //
  // items.getItem('CT_LightDark_State').sendCommand('OFF'); // its light in conservatory
};

// turn off CT lights when late - in case forgot to turn off
// rules.JSRule({
//   name: 'CRON auto turn OFF conservatory lights',
//   description: 'CRON turn OFF conservatory lights when late - maybe forgot',
//   triggers: [triggers.GenericCronTrigger('0 30 01 * * ?')],
//   execute: () => {
//     logger.error('CRON turn OFF conservatory lights when late - maybe forgot');
//     items.getItem('gConservatoryLights').sendCommand('OFF');
//     items.getItem('gColourBulbs').sendCommand('OFF');
//     alerting.sendInfo('CRON auto turn OFF conservatory lights');
//   },
// });

// turn off conservatory lights when it goes from dark to light
rules.JSRule({
  name: 'alert when service changed',
  description: 'alert when service changed',
  triggers: [triggers.GroupStateChangeTrigger('gServices_Core_Online')],
  execute: (event) => {
    logger.error('gServices_Core_Online');
    // items.getItem('gConservatoryLights').sendCommand('OFF');
    // items.getItem('gColourBulbs').sendCommand('OFF');
    alerting.sendInfo(`alert when service offline   gServices_Core_Online==: ${JSON.stringify(event)}`);
  },
});

// turn ON conservatory lights when it goes from light to dark
// rules.JSRule({
//   name: 'auto turn ON conservatory lights when when goes from light to dark',
//   description: 'turn ON conservatory lights when ambient light level goes from light to dark',
//   triggers: [triggers.ItemStateChangeTrigger('CT_LightDark_State', 'ON', 'OFF')],
//   execute: () => {
//     logger.error('turn ON conservatory lights when ambient light level goes from light to dark');
//     items.getItem('gConservatoryLights').sendCommand('ON');
//     alerting.sendInfo('auto turn ON conservatory lights  when ambient light level goes from light to dark');
//   },
// });

// when bridge sends an update to abient light sensor level
// - set bridge light sensor trend to ON if light going up, set to OFF if going down
// - also set CT_LightDark_State to ON(light) if trend up and above detection threshold
// - also set CT_LightDark_State to OFF(dark) if trend down and below detection threshold
// rules.JSRule({
//   name: 'monitor 433 bridge light sensor',
//   description: 'monitor 433 bridge light sensor',
//   triggers: [triggers.ItemStateUpdateTrigger('BridgeLightSensorLevel')],
//   execute: () => {
//     currentLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;

//     if (currentLightSensorLevel > previousLightSensorLevel) {
//       items.getItem('BridgeLightSensorTrend').sendCommand('ON');
//       // console.error('...trend: UP');
//     } else {
//       items.getItem('BridgeLightSensorTrend').sendCommand('OFF');
//       // console.error('...trend: DOWN');
//     }

//     previousLightSensorLevel = currentLightSensorLevel;
//     // ambient light below trigger level and trend going down - its getting dark
//     if (
//       currentLightSensorLevel < items.getItem('CT_Auto_Lighting_Trigger_SetPoint').rawState
//       && items.getItem('BridgeLightSensorTrend').state === 'OFF' // down getting darker
//     ) {
//       items.getItem('CT_LightDark_State').sendCommand('OFF');
//     }

//     // ambient light above trigger level and trend going up - its getting light
//     if (
//       currentLightSensorLevel > items.getItem('CT_Auto_Lighting_Trigger_SetPoint').rawState
//       && items.getItem('BridgeLightSensorTrend').state === 'ON' // up getting lighter
//     ) {
//       items.getItem('CT_LightDark_State').sendCommand('ON');
//     }
//   },
// });
