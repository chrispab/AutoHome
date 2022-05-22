scriptLoaded = function () {
  console.log("==================================script loaded");
  loadedDate = Date.now();
};

rules.JSRule({
  name: "conservatory fan circulate heat Cron",
  description: "conservatory fan circulate heat Cron",
  triggers: [triggers.GenericCronTrigger("0 0/5 * * * ?")],
  execute: (data) => {
    console.error("ZZZZZ  conservatory fan circulate heat Cron   ZZZZZ");
    fanOnSecs = 240;
    setPoint = items.getItem("CT_TemperatureSetpoint").state;
    temp = items.getItem("CT_Temperature").state;
    if(setPoint>=18 && temp<setPoint && items.getItem("CT_Fan_Heating_circulate_enable").state == "ON"){
      console.error("ZZZZZ  conservatory fan circulate heat rulel turn FAN ON NOW   ZZZZZ");
      items.getItem("CT_Fan433PowerSocket").sendCommand("ON");

      actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(fanOnSecs), function () {
        items.getItem("CT_Fan433PowerSocket").sendCommand("OFF");
        // items.getItem("FanPulseSwitch").sendCommand("OFF");
        console.error("ZZZZZ  conservatory_fan recic heat turn FAN OFF NOW   ");
      });

    }
  }
});


rules.JSRule({
  name: "Fan heat recirc ENABLE turned ON",
  description: "Fan heat recirc ENABLE turned ON",
  triggers: [triggers.ItemStateChangeTrigger("CT_Fan_Heating_circulate_enable", "OFF", "ON")],
  execute: (data) => {
    console.error("*********************************  conservatory_fan_heat_recirc_on - no action required");
  },
});


rules.JSRule({
  name: "Fan heat recirc ENABLE turned off",
  description: "Fan heat recirc ENABLE turned off",
  triggers: [triggers.ItemStateChangeTrigger("CT_Fan_Heating_circulate_enable", "ON", "OFF")],
  execute: (data) => {
    console.error("*********************************  conservatory_fan_heat_recirc_off - CT_Fan433PowerSocket OFF");
    items.getItem("CT_Fan433PowerSocket").sendCommand("OFF");
  },
});


rules.JSRule({
  name: "conservatory fan_cool rule",
  description: "check if cooling fan is required to go ON",
  triggers: [
    triggers.ItemStateChangeTrigger("CT_Temperature"),
    triggers.ItemStateChangeTrigger("Conservatory_Fan_ON_Setpoint"),
    triggers.ItemStateChangeTrigger("CT_Fan_Cooling_enable"),
  ],

  execute: (data) => {
    console.error("**********************conservatory_fan_ cool rulel - check if cooling fan reqd");

    var {alerting} = require('personal');
    // alerting.sendInfo('FROM fan OPENHABvv');
    // alerting.sendAlert('The following Chromecast devices are now in use');

    if (items.getItem("CT_Fan_Cooling_enable").state == "ON") {
      console.error("**********************conservatory_fan_ cool rulel - detected CT_Fan_Cooling_enable   ON");
      setPoint = items.getItem("Conservatory_Fan_ON_Setpoint").state;
      temp = items.getItem("CT_Temperature").state;
      if (items.getItem("CT_Heater") != "ON") {
        if (temp >= setPoint) {
          items.getItem("CT_Fan433PowerSocket").sendCommand("ON");
          console.error(">>>> Conservatory_fan_ cool rulel turning fan ON");
        }
        if (temp < setPoint) {
          items.getItem("CT_Fan433PowerSocket").sendCommand("OFF");
          console.error(">>>> Conservatory_fan_ cool rulel turning fan off");
        }
      }
    }
  },
});


rules.JSRule({
  name: "Fan cooling  ENABLE turned ON",
  description: "Fan cooling  ENABLE turned ON",
  triggers: [triggers.ItemStateChangeTrigger("CT_Fan_Cooling_enable", "OFF", "ON")],
  execute: (data) => {
    console.error("*********************************  conservatory_fan_cool_recirc_on - no action required");
  },
});


rules.JSRule({
  name: "Fan cooling  ENABLE turned OFF",
  description: "Fan cooling  ENABLE turned OFF",
  triggers: [triggers.ItemStateChangeTrigger("CT_Fan_Cooling_enable", "ON", "OFF")],
  execute: (data) => {
    console.error("*********************************  conservatory_fan_cool_recirc_off - - CT_Fan433PowerSocket OFF");
    items.getItem("CT_Fan433PowerSocket").sendCommand("OFF");
  },
});


rules.JSRule({
  name: "Fan Pulse (FanPulseSwitch) off to on",
  description: "Fan Pulse (FanPulseSwitch) change/update",
  triggers: [triggers.ItemStateChangeTrigger("FanPulseSwitch", "OFF", "ON")],
  execute: (data) => {
    console.error("*********************************  fan pulse CT_Fan433PowerSocket ON");

    items.getItem("CT_Fan433PowerSocket").sendCommand("ON");
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(10), function () {
      items.getItem("CT_Fan433PowerSocket").sendCommand("OFF");
      items.getItem("FanPulseSwitch").sendCommand("OFF");
      console.error("*********************************  fan pulse CT_Fan433PowerSocket OFF");
    });
  },
});
