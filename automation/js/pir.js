scriptLoaded = function () {
  console.log("PIR MONITOR scriptLoaded function");
  loadedDate = Date.now();
}

rules.JSRule({
  name: "PIR MONITOR",
  description: "monitor any PIR occupancy updates..v..",
  triggers: [
    triggers.ItemStateUpdateTrigger("pir01_occupancy"),
    triggers.ItemStateUpdateTrigger("pir02_occupancy")
  ],
  execute: (data) => {
    console.error("PIR MONITOR -  pir_occupancy received update itemName : " + data.itemName + ", state: " + items.getItem(data.itemName).state + ", PREV state: " + items.getItem(data.itemName).history.previousState());
  },
});

var pir01_off_timer = null;
var pir02_off_timer = null;
rules.JSRule({
  name: "pir01 or 02 updated with ON",
  description: "pir01 or 02  - Turn ON lights, cancel off timers  ",
  triggers: [
    triggers.ItemStateUpdateTrigger("pir01_occupancy", "ON"),
    triggers.ItemStateUpdateTrigger("pir02_occupancy", "ON")
  ],
  execute: (data) => {
    console.error("ON ON ON =======  pir_occupancy received update itemName : " + data.itemName + ", state: " + items.getItem(data.itemName).state + ", PREV state: " + items.getItem(data.itemName).history.previousState() );
    if (items.getItem("BridgeLightSensorLevel").state < items.getItem("ConservatoryLightTriggerLevel").state) {
      if (items.getItem("pir01_occupancy").state == "ON") {
        items.getItem("KT_light_1_Power").sendCommand("ON");
        console.error("ON ON ON ======= rxed pir01_occupancy ON");
        //cancrl the off timer if running
        if( pir01_off_timer && pir01_off_timer.isActive()){
          pir01_off_timer.cancel();
          console.error("ON ON ON ======= CANCEL     STOP running pir01_off_timer");
        }
      }
      if (items.getItem("pir02_occupancy").state == "ON") {
        items.getItem("KT_light_2_Power").sendCommand("ON");
        items.getItem("KT_light_3_Power").sendCommand("ON");
        console.error("ON ON ON ======= rxed pir02_occupancy ON");
        if( pir02_off_timer && pir02_off_timer.isActive()){
          pir02_off_timer.cancel();
          console.error("ON ON ON ======= CANCEL     STOP running pir02_off_timer");
        }
      }
    }
  },
});


rules.JSRule({
  name: "PIRsensor ON to OFF - start the lights off timer",
  description: "PIRsensor start OFF lights timer",
  triggers: [
    triggers.ItemStateChangeTrigger("pir01_occupancy", "ON","OFF"),
    triggers.ItemStateChangeTrigger("pir02_occupancy", "ON","OFF"),
  ],
  execute: (data) => {
    console.error("update =======  pir_occupancy received update itemName : " + data.itemName + ", state: " + items.getItem(data.itemName).state + ", PREV state: " + items.getItem(data.itemName).history.previousState() );
      if ( data.itemName == "pir01_occupancy") {
        console.error("update===========pir01_occupancy: STARTING TIMER KT_light_1_Power: OFF, off time is: " + items.getItem("KT_cupboard_lights_timeout").state.toString());
        let now = time.ZonedDateTime.now();
        pir01_off_timer = actions.ScriptExecution.createTimer(now.plusSeconds(items.getItem("KT_cupboard_lights_timeout").state), pir1_off_body);
        console.error("update===========pir01_occupancy: STARTING TIMER KT_light_1_Power: OFF END");
      }
      if ( data.itemName == "pir02_occupancy") {
        console.error("update=========== : STARTING TIMER KT_light_2&3_Power : OFF, off timer is: " + items.getItem("KT_cupboard_lights_timeout").state.toString());
        let now = time.ZonedDateTime.now();
        pir02_off_timer = actions.ScriptExecution.createTimer(now.plusSeconds(items.getItem("KT_cupboard_lights_timeout").state), pir2_off_body);
        console.error("update===========pir02_occupancy: STARTING TIMER KT_light_2&3_Power: OFF END");
      }
    }
});

function pir1_off_body() {
  console.error('===================================================The timer is over.pir1_off_body');
  items.getItem("KT_light_1_Power").sendCommand("OFF");
}
function pir2_off_body() {
  console.error('====================================================The timer is over.pir2_off_body');
  items.getItem("KT_light_2_Power").sendCommand("OFF");
  items.getItem("KT_light_3_Power").sendCommand("OFF");
}
