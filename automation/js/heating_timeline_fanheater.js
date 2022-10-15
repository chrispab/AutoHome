const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('timepicker.js');
const { timeUtils } = require('openhab_rules_tools');

rules.JSRule({
  name: 'If vFanHeater_Enable timeline trigger',
  description: 'If the vFanHeater_Enable timeline sends an event-respond',
  triggers: [triggers.ItemStateUpdateTrigger('vFanHeater_Enable')],
  execute: (data) => {
    logger.warn('__>>timeline trigger');
    logger.warn(`__>>data triggger item : ${items.getItem(data.itemName).name}`);
    logger.warn(`__>>data triggger item state: ${items.getItem(data.itemName).state}`);
    items.getItem('fan_heater_enable').sendCommand(items.getItem(data.itemName).state);
  },
});
