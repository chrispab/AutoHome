const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('BG_Availability.js');
const { timeUtils } = require('openhab_rules_tools');

let tsceneStartup;

scriptLoaded = function () {
  logger.warn('StartUp - set up Item Scene_Goodnight');
  if (tsceneStartup === undefined) {
    tsceneStartup = actions.ScriptExecution.createTimer(timeUtils.toDateTime((45 * 1000)), () => {
      items.getItem('Scene_Goodnight').postUpdate('OFF');
    });
  }
};

let tgoodnight;

rules.JSRule({
  name: 'Goodnight Going to bed',
  description: 'Goodnight Going to bed',
  triggers: [triggers.ItemStateChangeTrigger('Scene_Goodnight', 'OFF', 'ON')],
  execute: (event) => {
    logger.warn(`Goodnight Going to bed, triggering item name: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);

    items.getItem('CT_FairyLights433Socket').sendCommand('OFF');
    items.getItem('ZbColourBulb01Switch').sendCommand('OFF');
    items.getItem('ZbColourBulb02Switch').sendCommand('OFF');

    items.getItem('radio').sendCommand('OFF');
    items.getItem('gCT_TVKodiSpeakers').sendCommand('OFF');
    // items.getItem('vCT_TVKodiSpeakers2').sendCommand('OFF');

    // get temp values from the web   page defining room temp presets
    // and update 'XX_Heating_PresetTempNormal' items
    items.getItem('CT_Heating_PresetTempNormal').postUpdate(items.getItem('CT_HPSP_Night').toString());
    items.getItem('FR_Heating_PresetTempNormal').postUpdate(items.getItem('FR_HPSP_Night').toString());
    items.getItem('ER_Heating_PresetTempNormal').postUpdate(items.getItem('ER_HPSP_Night').toString());
    items.getItem('AT_Heating_PresetTempNormal').postUpdate(items.getItem('AT_HPSP_Night').toString());
    items.getItem('BR_Heating_PresetTempNormal').postUpdate(items.getItem('BR_HPSP_Night').toString());
    items.getItem('OF_Heating_PresetTempNormal').postUpdate(items.getItem('OF_HPSP_Night').toString());
    items.getItem('HL_Heating_PresetTempNormal').postUpdate(items.getItem('HL_HPSP_Night').toString());
    items.getItem('Heating_UpdateHeaters').sendCommand('OFF');
    items.getItem('Heating_UpdateHeaters').sendCommand('ON');

    items.getItem('Scene_Goodnight').postUpdate('OFF');
    items.getItem('workLightsPowerSocket').sendCommand('OFF');
    tgoodnight = actions.ScriptExecution.createTimer(timeUtils.toDateTime((300 * 1000)), () => {
      items.getItem('ZbWhiteBulb01Switch').sendCommand('OFF');
    });
  },
});
