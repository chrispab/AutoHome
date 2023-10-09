const {
  log, items, rules, triggers,
} = require('openhab');

// const { timeUtils } = require('openhab_rules_tools');

var ruleUID = "heating-boiler";
// log:set DEBUG org.openhab.automation.openhab-js.heating-boiler

const logger = log(ruleUID);
// const { CountdownTimer, timeUtils, TimerMgr } = require('openhab_rules_tools');
// openhab> log:set DEBUG org.openhab.automation.openhab-js.zb1_pir

rules.JSRule({
  name: 'when any heater states updated to ON, turn Boiler ON else OFF',
  description: 'when any heater states updated, turn Boiler ON else turn boiler OFF',
  triggers: [triggers.GroupStateUpdateTrigger('gHeaterControls')],
  execute: (event) => {
    // logger.warn('A heater state has been updated!, do we turn Boiler ON or turn boiler OFF?');
    // console.log(event);
    // myutils.showEvent(event);
    // logger.debug(`....triggering item : ${event.itemName}`);
    // logger.debug(`....item value : ${event.receivedState}`);
    // logger.debug(`...gAnyRoomHeaterOn: ${items.getItem('gAnyRoomHeaterOn').state}`);
    if (items.getItem('gAnyRoomHeaterOn').state === 'ON') {
      // if boiler off, send on command
      if (items.getItem('Boiler_Control').state.toString() === 'OFF') {
        logger.info(`Boiler -action: ${event.itemName}-(${event.receivedState}), at least 1 heater is ON -> boiler is OFF so sending boiler ON command`);
        items.getItem('Boiler_Control').sendCommand('ON');
      } else {
        logger.debug(`Boiler -no action: ${event.itemName}-(${event.receivedState}), at least 1 heater is ON -> boiler already ON so NOT sending ON command`);
      }
    } else if (items.getItem('Boiler_Control').state.toString() === 'ON') {
      logger.info(`Boiler -action: ${event.itemName}-(${event.receivedState}), all Heaters are OFF -> boiler is ON so sending boiler OFF command`);
      items.getItem('Boiler_Control').sendCommand('OFF');
    } else {
      logger.debug(`Boiler -no action: ${event.itemName}-(${event.receivedState}), all Heaters are OFF -> boiler already OFF so NOT sending OFF command`);
    }
  },
});
