const {
  log, items, rules, actions, triggers,
} = require('openhab');

const ruleUID = 'ct-auto-lights';
const logger = log(ruleUID);

const { alerting } = require('openhab-my-utils');

let previousLightSensorLevel = null;
let currentLightSensorLevel = null;

// when script reloaded, set auto detection lighting to suitable defaults
scriptLoaded = function () {
  logger.debug('scriptLoaded - set all CT auto lighting items');
  actions.Voice.say('CT auto lighting starting');

  previousLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;
  currentLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;
  items.getItem('BridgeLightSensorTrend').sendCommand('ON'); //
  items.getItem('CT_LightDark_State').sendCommand('OFF'); // its light in conservatory
};

// turn off CT lights when late - in case forgot to turn off
rules.JSRule({
  name: 'CRON auto turn OFF conservatory lights',
  description: 'CRON turn OFF conservatory lights when late - maybe forgot',
  triggers: [triggers.GenericCronTrigger('0 30 01 * * ?')],
  execute: () => {
    logger.info('CRON turn OFF conservatory lights when late - maybe forgot');
    items.getItem('gConservatoryLights').sendCommand('OFF');
    items.getItem('gColourBulbs').sendCommand('OFF');
    alerting.sendEmail('Conservatory lights CRON turn OFF', 'CRON auto turn OFF conservatory lights');
  },
});

// turn on CT lights in work mornings
rules.JSRule({
  name: 'CRON auto turn On conservatory lights',
  description: 'CRON turn On conservatory lights dark work mornings',
  triggers: [triggers.GenericCronTrigger('0 0 6 ? * MON,TUE,WED,THU,FRI *')],

  execute: () => {
    logger.info('CRON turn On conservatory lights dark work mornings');
    if (items.getItem('CT_LightDark_State').state === 'OFF') {
      logger.info('its dark, so turn ON conservatory lights in work mornings');
      items.getItem('gConservatoryLights').sendCommand('ON');
    }

    alerting.sendEmail(
      'Conservatory lights CRON turn ON',
      'CRON auto turn ON conservatory lights in work mornings',
    );
  },
});

// turn off conservatory lights when it goes from dark to light
rules.JSRule({
  name: 'auto turn OFF conservatory lights when goes from dark to light',
  description: 'turn OFF conservatory lights when ambient light level when goes from dark to light',
  triggers: [triggers.ItemStateChangeTrigger('CT_LightDark_State', 'OFF', 'ON')],
  execute: () => {
    logger.debug('turn OFF conservatory lights when ambient light level when goes from dark to light');
    items.getItem('gConservatoryLights').sendCommand('OFF');
    items.getItem('gColourBulbs').sendCommand('OFF');
    alerting.sendEmail(
      'Conservatory lights auto turn OFF',
      'turn OFF conservatory lights when ambient light level when goes from dark to light',
    );
  },
});

// turn ON conservatory lights when it goes from light to dark
rules.JSRule({
  name: 'auto turn ON conservatory lights when when goes from light to dark',
  description: 'turn ON conservatory lights when ambient light level goes from light to dark',
  triggers: [triggers.ItemStateChangeTrigger('CT_LightDark_State', 'ON', 'OFF')],
  execute: () => {
    logger.debug('turn ON conservatory lights when ambient light level goes from light to dark');
    items.getItem('gConservatoryLights').sendCommand('ON');
    alerting.sendEmail(
      'Conservatory lights auto turn ON',
      'auto turn ON conservatory lights  when ambient light level goes from light to dark',
    );
  },
});

// when bridge sends an update to abient light sensor level
// - set bridge light sensor trend to ON if light going up, set to OFF if going down
// - also set CT_LightDark_State to ON(light) if trend up and above detection threshold
// - also set CT_LightDark_State to OFF(dark) if trend down and below detection threshold
rules.JSRule({
  name: 'monitor 433 bridge light sensor',
  description: 'monitor 433 bridge light sensor',
  triggers: [triggers.ItemStateUpdateTrigger('BridgeLightSensorLevel')],
  execute: () => {
    currentLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;

    if (currentLightSensorLevel > previousLightSensorLevel) {
      items.getItem('BridgeLightSensorTrend').sendCommand('ON');
      // console.error('...trend: UP');
    } else {
      items.getItem('BridgeLightSensorTrend').sendCommand('OFF');
      // console.error('...trend: DOWN');
    }

    previousLightSensorLevel = currentLightSensorLevel;
    // ambient light below trigger level and trend going down - its getting darker
    if (
      currentLightSensorLevel < items.getItem('CT_Auto_Lighting_Trigger_SetPoint').rawState
      && items.getItem('BridgeLightSensorTrend').state === 'OFF' // down getting darker
    ) {
      items.getItem('CT_LightDark_State').sendCommand('OFF');
    }

    // ambient light above trigger level and trend going up - its getting lighter
    if (
      currentLightSensorLevel > items.getItem('CT_Auto_Lighting_Trigger_SetPoint').rawState
      && items.getItem('BridgeLightSensorTrend').state === 'ON' // up getting lighter
    ) {
      items.getItem('CT_LightDark_State').sendCommand('ON');
    }
  },
});

rules.JSRule({
  name: 'Turn ON conservatory lights via proxy',
  description: 'Turn ON conservatory lights via proxy',
  triggers: [triggers.ItemStateChangeTrigger('conservatoryLightsProxy', 'OFF', 'ON')],
  execute: (event) => {
    logger.info('£££:  Turn ON the Conservatory lights via proxy');

    // myutils.showEvent(event);

    items.getItem('gConservatoryFairyLights').sendCommand('ON');
    items.getItem('workLightsPowerSocket').sendCommand('ON');
  },
});

rules.JSRule({
  name: 'Turn OFF conservatory lights via proxy',
  description: 'Turn OFF conservatory lights via proxy',
  triggers: [triggers.ItemStateChangeTrigger('conservatoryLightsProxy', 'ON', 'OFF')],
  execute: (event) => {
    logger.info('£££:  Turn OFF the Conservatory lights via proxy');

    // myutils.showEvent(event);

    items.getItem('gConservatoryFairyLights').sendCommand('OFF');
    items.getItem('workLightsPowerSocket').sendCommand('OFF');
  },
});
