const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('boiler control.js');
const { timeUtils } = require('openhab_rules_tools');

rules.JSRule({
  name: 'If any heater states ON, turn Boiler ON else OFF',
  description: 'If any heaters demanding heat, turn Boiler ON else turn boiler OFF',
  triggers: [triggers.GroupStateUpdateTrigger('gRoomHeaterStates')],
  execute: (event) => {
    logger.warn('...If any heaters demanding heat, turn Boiler ON else turn boiler OFF');
    console.log(event);
    logger.warn(`....triggering item : ${event.itemName}`);
    logger.warn(`....item value : ${event.receivedState}`);
    logger.warn(`...gAnyRoomHeaterOn: ${items.getItem('gAnyRoomHeaterOn').state}`);
    if (items.getItem('gAnyRoomHeaterOn').state === 'ON') {
      logger.warn('....A heater is ON - turn boiler ON');

      items.getItem('Boiler_Control').sendCommand('ON');
    } else {
      logger.warn('....All heaters are OFF - turn boiler OFF');
      items.getItem('Boiler_Control').sendCommand('OFF');
    }
  },
});
