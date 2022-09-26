// @rule("If any heaters demand, turn Boiler ON else OFF", description="If heater demand turn on Boiler else off", tags=["boiler"])
// @when("Member of gRoomHeaterStates received update") #update if ANY heater demand updated - v often
// def boiler_control(event):

const { myutils } = require('personal');

rules.JSRule({
  name: 'If any heaters demand, turn Boiler ON else OFF',
  description: 'If any heaters demanding heat, turn Boiler ON else turn boiler OFF',
  triggers: [triggers.GroupStateUpdateTrigger('gRoomHeaterStates')],
  execute: (event) => {
    console.error('£££: If any heaters demanding heat, turn Boiler ON else turn boiler OFF');

    myutils.showEvent(event);

    // if items["gAnyRoomHeaterOn"] == ON:
    if (items.getItem('gAnyRoomHeaterOn').state === 'ON') {
      console.error('£££:show heaters group, demand turn boiler ON');

      myutils.showGroupMembers('gRoomHeaterStates');
      items.getItem('Boiler_Control').sendCommand('ON');
    } else {
      console.error('£££:show heaters group, NO demand turn boiler OFF');
      myutils.showGroupMembers('gRoomHeaterStates');
      items.getItem('Boiler_Control').sendCommand('OFF');
    }
  },
});
