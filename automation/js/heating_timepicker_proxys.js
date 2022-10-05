const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('timepicker.js');
const { timeUtils } = require('openhab_rules_tools');

rules.JSRule({
  name: 'If any timepicker',
  description: 'If any heaters demanding heat, turn Boiler ON else turn boiler OFF',
  triggers: [triggers.ItemStateUpdateTrigger('vCT_HeatingMode')],
  execute: () => {
    logger.warn('__If any timepicker');
    logger.warn(`vCT_HeatingMode: ${items.getItem('vCT_HeatingMode').state}`);
    //   if (items.getItem('gAnyRoomHeaterOn').state === 'ON') {
    //     logger.warn('A heater is ON - turn boiler ON');
    //     items.getItem('Boiler_Control').sendCommand('ON');
    //   } else {
    //     logger.warn('All heaters OFF - turn boiler OFF');
    //     items.getItem('Boiler_Control').sendCommand('OFF');
    //   }
    items.getItem('CT_HeatingMode').sendCommand(items.getItem('vCT_HeatingMode').state);
  },
});
