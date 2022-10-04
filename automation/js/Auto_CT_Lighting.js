const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('auto CT lights');
const { timeUtils } = require('openhab_rules_tools');

//! TODO
// @rule("auto lighting init", description="Handles fan actions", tags=["conservatory"])
// @when("System started")
// def auto_lighting_init(event):
//     auto_lighting_init.log.info("auto_lighting_init")
//     events.postUpdate("BridgeLightSensorState", "OFF")
const { alerting } = require('personal');

rules.JSRule({
  name: 'CRON auto turn On conservatory lights MORNING if dark',
  description: 'CRON auto turn On conservatory lights MORNING if dark',
  triggers: [triggers.GenericCronTrigger('0 30 06 * * ?')],
  execute: (data) => {
    if (items.getItem('CT_LightDark_State').state == 'OFF') {
      //! only turn on if dark

      console.error('CRON auto turn On conservatory lights MORNING');
      items.getItem('gConservatoryLights').sendCommand('ON');

      alerting.sendInfo('CRON auto turn On conservatory lights MORNING if OFF');
    }
  },
});

rules.JSRule({
  name: 'CRON auto turn OFF conservatory lights',
  description: 'CRON turn OFF conservatory lights when late - maybe forgot',
  triggers: [triggers.GenericCronTrigger('0 30 01 * * ?')],
  execute: (data) => {
    console.error('CRON turn OFF conservatory lights when late - maybe forgot');
    items.getItem('gConservatoryLights').sendCommand('OFF');
    items.getItem('gColourBulbs').sendCommand('OFF');

    // var { alerting } = require('personal');
    alerting.sendInfo('CRON auto turn OFF conservatory lights');
  },
});

rules.JSRule({
  name: 'auto turn OFF conservatory lights',
  description: 'turn OFF conservatory lights when ambient light level high',
  triggers: [triggers.ItemStateChangeTrigger('CT_LightDark_State', 'OFF', 'ON')],
  execute: (data) => {
    console.error('...........................turn OFF conservatory lights when ambient light level high');
    items.getItem('gConservatoryLights').sendCommand('OFF');
    items.getItem('gColourBulbs').sendCommand('OFF');

    // var { alerting } = require('personal');
    alerting.sendInfo('auto turn OFF conservatory lights');
  },
});

rules.JSRule({
  name: 'auto turn ON conservatory lights',
  description: 'turn ON conservatory lights when ambient light level low',
  triggers: [triggers.ItemStateChangeTrigger('CT_LightDark_State', 'ON', 'OFF')],
  execute: (data) => {
    console.error('...........................turn ON conservatory lights when ambient light level low');
    // items.getItem("conservatoryLightsProxy").sendCommand("ON");
    items.getItem('gConservatoryLights').sendCommand('ON');

    // var { alerting } = require('personal');
    alerting.sendInfo('auto turn ON conservatory lights if getting dark');
  },
});

let previousLightSensorLevel = null;
let currentLightSensorLevel = null;

scriptLoaded = function () {
  console.error('scriptLoaded - set all CT auto lightings items etc');

  previousLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;
  currentLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;
  items.getItem('BridgeLightSensorTrend').sendCommand('OFF'); // going down
  items.getItem('CT_LightDark_State').sendCommand('OFF'); // its light in conservatory
};

rules.JSRule({
  name: 'monitor 433 bridge light sensor',
  description: 'monitor 433 bridge light sensor',
  triggers: [triggers.ItemStateUpdateTrigger('BridgeLightSensorLevel')],
  execute: (event) => {
    // console.error('monitor 433 bridge light sensor');
    // console.error(`previousLightSensorLevel: ${previousLightSensorLevel}`);
    currentLightSensorLevel = items.getItem('BridgeLightSensorLevel').state;
    // console.error(`currentLightSensorLevel: ${currentLightSensorLevel}`);
    // console.error(
    //   `CT_Auto_Lighting_Trigger_SetPoint: ${items.getItem('CT_Auto_Lighting_Trigger_SetPoint').state}`,
    // );

    if (currentLightSensorLevel > previousLightSensorLevel) {
      items.getItem('BridgeLightSensorTrend').sendCommand('ON');
      // console.error('...trend: UP');
    } else {
      items.getItem('BridgeLightSensorTrend').sendCommand('OFF');
      // console.error('...trend: DOWN');
    }

    previousLightSensorLevel = currentLightSensorLevel;

    // console.error(`currentLightSensorLevel: ${currentLightSensorLevel}`);
    // console.error(
    //   `CT_Auto_Lighting_Trigger_SetPoint: ${items.getItem('CT_Auto_Lighting_Trigger_SetPoint').state}`,
    // );
    // console.error(
    //   `BridgeLightSensorTrend: ${items.getItem('BridgeLightSensorTrend').state}`,
    // );
    // console.error(`CT_LightDark_State: ${items.getItem('CT_LightDark_State').state}`);

    // ambient light below trigger level and trend going down - its getting dark
    if (
      currentLightSensorLevel < items.getItem('CT_Auto_Lighting_Trigger_SetPoint').rawState
      && items.getItem('BridgeLightSensorTrend').state == 'OFF' // down getting darker
    ) {
      items.getItem('CT_LightDark_State').sendCommand('OFF');
      // console.error(
      //   `CT_LightDark_State: ${items.getItem('CT_LightDark_State').state
      //   } - dark`,
      // );
    }

    // ambient light above trigger level and trend going up - its getting light
    if (
      currentLightSensorLevel > items.getItem('CT_Auto_Lighting_Trigger_SetPoint').rawState
      && items.getItem('BridgeLightSensorTrend').state == 'ON' // up getting lighter
    ) {
      items.getItem('CT_LightDark_State').sendCommand('ON');
      // console.error(
      //   `CT_LightDark_State: ${items.getItem('CT_LightDark_State').state} - light`,
      // );
    }
  },
});
