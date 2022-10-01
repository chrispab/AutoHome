const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('boiler ctl.js');
const { timeUtils } = require('openhab_rules_tools');

rules.JSRule({
  name: 'If any heaters demand, turn Boiler ON else OFF',
  description: 'If any heaters demanding heat, turn Boiler ON else turn boiler OFF',
  triggers: [triggers.GroupStateUpdateTrigger('gRoomHeaterStates')],
  execute: (event) => {
    // console.error('£££: If any heaters demanding heat, turn Boiler ON else turn boiler OFF');

    // myutils.showEvent(event);

    // if items["gAnyRoomHeaterOn"] == ON:
    if (items.getItem('gAnyRoomHeaterOn').state === 'ON') {
      logger.error('£££:demand turn boiler ON');

      // myutils.showGroupMembers('gRoomHeaterStates');
      items.getItem('Boiler_Control').sendCommand('ON');
    } else {
      logger.error('£££:NO demand turn boiler OFF');
      // myutils.showGroupMembers('gRoomHeaterStates');
      items.getItem('Boiler_Control').sendCommand('OFF');
    }
  },
});
