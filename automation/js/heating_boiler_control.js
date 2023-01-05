const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('boiler control.js');
const { timeUtils } = require('openhab_rules_tools');

rules.JSRule({
  name: 'when any heater states updated to ON, turn Boiler ON else OFF',
  description: 'when any heater states updated, turn Boiler ON else turn boiler OFF',
  triggers: [triggers.GroupStateUpdateTrigger('gRoomHeaterStates')],
  execute: (event) => {
    // logger.warn('A heater state has been updated!, do we turn Boiler ON or turn boiler OFF?');
    // console.log(event);
    // myutils.showEvent(event);
    // logger.warn(`....triggering item : ${event.itemName}`);
    // logger.warn(`....item value : ${event.receivedState}`);
    // logger.warn(`...gAnyRoomHeaterOn: ${items.getItem('gAnyRoomHeaterOn').state}`);
    if (items.getItem('gAnyRoomHeaterOn').state === 'ON') {
      logger.warn(`boiler control:....trigger: ${event.itemName}-(${event.receivedState}), at least 1 Heater is ON -> sending boiler ON command`);

      items.getItem('Boiler_Control').sendCommand('ON');
    } else {
      logger.warn(`boiler control....trigger: ${event.itemName}-(${event.receivedState}), All heaters are OFF -> sending boiler OFF command`);
      items.getItem('Boiler_Control').sendCommand('OFF');
    }
  },
});
