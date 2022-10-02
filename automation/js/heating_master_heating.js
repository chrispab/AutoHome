const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('master-mode-changed');
const { timeUtils } = require('openhab_rules_tools');
const { toToday } = require('openhab_rules_tools/timeUtils');

rules.JSRule({
  name: 'handle MasterHeatingMode updated',
  description: 'handle MasterHeatingMode updated',
  triggers: [
    triggers.ItemStateUpdateTrigger('masterHeatingMode'),
  ],
  execute: (event) => {
    logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1handle MasterHeatingMode updated');
    // myutils.showEvent(event);
    const masterHeatingModeItemState = items.getItem('masterHeatingMode').state.toString();

    switch (masterHeatingModeItemState) {
      case 'off':
        // turn 'off' all individual room heating modes
        logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!make all rooms - off - MASTER Heating Mode :');
        items.getItem('gHeatingModes').sendCommand('off');
        // todo do not override mode if manual
        break;
      case 'manual':
        logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!make all rooms - manual - MASTER Heating Mode :');
        items.getItem('gHeatingModes').sendCommand('manual');
        // todo do not override mode if manual
        break;
      case 'auto':
        // check each heater heating mode
        logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!make all rooms - AUTO - MASTER Heating Mode :');
        items.getItem('gHeatingModes').sendCommand('auto');
        // todo do not override mode if manual
        break;
      default:
        logger.error(`Unkown master heating mode: ${masterHeatingModeItemState}`);
    }
    // events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc
    items.getItem('Heating_UpdateHeaters').sendCommand('ON');
  },
});
