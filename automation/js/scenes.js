const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('scenes');
const { timeUtils } = require('openhab_rules_tools');

let tsceneStartup;
const resetSceneGoodnightDelay = 45 * 1000;

scriptLoaded = function () {
  logger.info('StartUp - set up Item Scene_Goodnight');
  if (tsceneStartup === undefined) {
    tsceneStartup = actions.ScriptExecution.createTimer(time.toZDT((resetSceneGoodnightDelay)), () => {
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
    logger.info(`Goodnight Going to bed, triggering item name: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);

    items.getItem('CT_FairyLights433Socket').sendCommand('OFF');

    items.getItem('ZbColourBulb01_switch').sendCommand('OFF');
    items.getItem('ZbColourBulb02_switch').sendCommand('OFF');

    items.getItem('radio').sendCommand('OFF');
    items.getItem('gCT_TVKodiSpeakers').sendCommand('OFF');
    // items.getItem('vCT_TVKodiSpeakers2').sendCommand('OFF');

    // turn off all heating

    // items.getItem('Heating_UpdateHeaters').sendCommand('OFF');
    // items.getItem('Heating_UpdateHeaters').sendCommand('ON');

    items.getItem('gLightCyclers').postUpdate('OFF');

    items.getItem('Scene_Goodnight').postUpdate('OFF');
    items.getItem('workLightsPowerSocket').sendCommand('OFF');

    tgoodnight = actions.ScriptExecution.createTimer(time.toZDT((300 * 1000)), () => {
      items.getItem('ZbWhiteBulb01Switch').sendCommand('OFF');
    });
  },
});
