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
      // logger.warn(`boiler control:....trigger: ${event.itemName}-(${event.receivedState}), at least 1 Heater is ON -> sending boiler ON command`);
      // if boiler off, send on command
      if (items.getItem('Boiler_Control').state.toString() === 'OFF') {
        logger.warn(`boiler control:....trigger: ${event.itemName}-(${event.receivedState}), at least 1 heater is ON -> boiler is OFF so sending boiler ON command`);
        items.getItem('Boiler_Control').sendCommand('ON');
      } else {
        logger.warn(`boiler control:....trigger: ${event.itemName}-(${event.receivedState}), at least 1 heater is ON -> boiler already ON so NOT sending ON command`);
      }
    } else if (items.getItem('Boiler_Control').state.toString() === 'ON') {
      logger.warn(`boiler control:....trigger: ${event.itemName}-(${event.receivedState}), all Heaters are OFF -> boiler is ON so sending boiler OFF command`);
      items.getItem('Boiler_Control').sendCommand('OFF');
    } else {
      logger.warn(`boiler control:....trigger: ${event.itemName}-(${event.receivedState}), all Heaters are OFF -> boiler already OFF so NOT sending OFF command`);
    }
  },
});
