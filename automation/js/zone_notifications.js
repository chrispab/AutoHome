scriptLoaded = function () {
  console.log('zone3 lights on scriptLoaded function');
  loadedDate = Date.now();
};

var pir01_off_timer = null;
var pir02_off_timer = null;
rules.JSRule({
  name: 'zone3 lights on',
  description: 'zone3 lights on',
  triggers: [
    triggers.ItemStateChangeTrigger('testBtn1', 'OFF', 'ON'),

    triggers.ItemStateChangeTrigger('Zone3LightStatus', 'OFF', 'ON'),
    triggers.ItemStateChangeTrigger('Zone3LightStatusAlt', 'OFF', 'ON'),
  ],
  execute: (data) => {
    console.error(
      'ON ON ON =======  zone3 lights on : ' +
        data.itemName +
        ', state: ' +
        items.getItem(data.itemName).state +
        ', PREV state: ' +
        items.getItem(data.itemName).history.previousState()
    );

    items.getItem('KT_light_1_Power').sendCommand('ON');
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(1), function () {
      items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(2), function () {
      items.getItem('KT_light_1_Power').sendCommand('ON'); //IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(3), function () {
      items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(4), function () {
      items.getItem('KT_light_1_Power').sendCommand('ON'); //IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(5), function () {
      items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(6), function () {
      items.getItem('KT_light_1_Power').sendCommand('ON'); //IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(7), function () {
      items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
      console.error('KT_light_1_Power');
    });
  },
});

//   rules.JSRule({
//     name: "PIRsensor ON to OFF - start the lights off timer",
//     description: "PIRsensor start OFF lights timer",
//     triggers: [
//       triggers.ItemStateChangeTrigger("pir01_occupancy", "ON","OFF"),
//       triggers.ItemStateChangeTrigger("pir02_occupancy", "ON","OFF"),
//     ],
//     execute: (data) => {
//       console.error("update =======  pir_occupancy received update itemName : " + data.itemName + ", state: " + items.getItem(data.itemName).state + ", PREV state: " + items.getItem(data.itemName).history.previousState() );
//         if ( data.itemName == "pir01_occupancy") {
//           console.error("update===========pir01_occupancy: STARTING TIMER KT_light_1_Power: OFF, off time is: " + items.getItem("KT_cupboard_lights_timeout").state.toString());
//           let now = time.ZonedDateTime.now();
//           pir01_off_timer = actions.ScriptExecution.createTimer(now.plusSeconds(items.getItem("KT_cupboard_lights_timeout").rawState), pir1_off_body);
//           console.error("update===========pir01_occupancy: STARTING TIMER KT_light_1_Power: OFF END");
//         }
//         if ( data.itemName == "pir02_occupancy") {
//           console.error("update=========== : STARTING TIMER KT_light_2&3_Power : OFF, off timer is: " + items.getItem("KT_cupboard_lights_timeout").state);
//           let now = time.ZonedDateTime.now();
//           pir02_off_timer = actions.ScriptExecution.createTimer(now.plusSeconds(items.getItem("KT_cupboard_lights_timeout").rawState), pir2_off_body);
//           console.error("update===========pir02_occupancy: STARTING TIMER KT_light_2&3_Power: OFF END");
//         }
//       }
//   });

//   function pir1_off_body() {
//     console.error('===================================================The timer is over.pir1_off_body');
//     items.getItem("KT_light_1_Power").sendCommand("OFF");
//   }
//   function pir2_off_body() {
//     console.error('====================================================The timer is over.pir2_off_body');
//     items.getItem("KT_light_2_Power").sendCommand("OFF");
//     items.getItem("KT_light_3_Power").sendCommand("OFF");
//   }
