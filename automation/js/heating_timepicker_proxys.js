const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('timepicker.js');
const { timeUtils } = require('openhab_rules_tools');

// function turnOnTV(onOffProxyItem, powerControlItem, message) {
//   logger.warn(`Turning on Pi Kodi and TV:${message}`);
//   actions.Voice.say(message);

//   // if off timer defined (someone tried to turn tv off), stop it so it dosent prevent powering ON
//   if (!(tvPowerOffTimer === undefined)) {
//     tvPowerOffTimer.cancel();// = undefined;
//   }
//   items.getItem(onOffProxyItem).postUpdate('ON');
//   items.getItem(powerControlItem).sendCommand('ON');
// }

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
