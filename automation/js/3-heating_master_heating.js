const {
  log, items, rules, actions, triggers,
} = require('openhab');

const logger = log('master-mode-changed');
const { timeUtils } = require('openhab_rules_tools');
const { toToday } = require('openhab_rules_tools/timeUtils');

rules.JSRule({
  name: 'handle MasterHeatingMode updated',
  description: 'handle MasterHeatingMode updated',
  triggers: [
    triggers.ItemStateUpdateTrigger('masterHeatingMode'),
  ],
  execute: () => {
    logger.debug('1handle MasterHeatingMode updated');
    // myutils.showEvent(event);
    const masterHeatingModeItemState = items.getItem('masterHeatingMode').state.toString();

    switch (masterHeatingModeItemState) {
      case 'off':
        // turn 'off' all individual room heating modes
        logger.debug('make all rooms - off - MASTER Heating Mode :');
        items.getItem('gHeatingModes').sendCommand('off');
        // todo do not override mode if manual
        break;
      case 'manual':
        logger.debug('make all rooms - manual - MASTER Heating Mode :');
        // items.getItem('gHeatingModes').sendCommand('manual');
        // todo do not override mode if manual
        break;
      case 'auto':
        // check each heater heating mode
        logger.debug('make all rooms - AUTO - MASTER Heating Mode :');
        items.getItem('gHeatingModes').sendCommand('auto');
        // todo do not override mode if manual
        break;
      default:
        logger.debug(`Unkown master heating mode: ${masterHeatingModeItemState}`);
    }
    // events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc
    items.getItem('Heating_UpdateHeaters').sendCommand('ON');
  },
});
