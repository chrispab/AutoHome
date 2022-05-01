scriptLoaded = function () {
  console.log("==================================script loaded");
  loadedDate = Date.now();
};

// @rule("conservatory fan circulate heat", description="Handles fan actions", tags=["conservatory", "fan"])
// @when("Time cron 0 */5 * ? * *")
// def conservatory_fan(event):
//     conservatory_fan.log.debug("conservatory_fan rulel now")
//     fanOnSecs = 240
//     sp = items["CT_TemperatureSetpoint"]
//     currentTemp = items["CT_Temperature"]
//     if ((sp >= 18) and (currentTemp < (sp)) and (items["CT_Fan_Heating_circulate_enable"] == ON)):
//         conservatory_fan.log.debug("conservatory fan circulate heat rulel turn FAN ON NOW   ZZZZZ")
//         events.sendCommand("CT_Fan433PowerSocket", "ON")
//         ScriptExecution.createTimer(DateTime.now().plusSeconds(fanOnSecs), lambda: ct_fan_body())
// def ct_fan_body():
//     events.sendCommand("CT_Fan433PowerSocket", "OFF")
//     conservatory_fan.log.debug("conservatory_fan recic heat turn FAN OFF NOW   XX")

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



// @rule("React on Fan heat recirc ENABLE turned on ON", description="React on Fan heat recirc ENABLE turned on ON", tags=["conservatory", "fan"])
// # @when("Item CT_Fan_Cooling_enable changed from OFF to ON")
// @when("Item CT_Fan_Heating_circulate_enable changed from OFF to ON")
// def conservatory_fan_heat_recirc_on(event):
//     # if items["CT_Heater"] != ON: # prevent doinbg when heater is on - cos it may be recircing
//     conservatory_fan_heat_recirc_on.log.debug("conservatory_fan_heat_recirc_on - no action required")
//         # events.sendCommand("CT_Fan433PowerSocket", "ON")
rules.JSRule({
  name: "Fan heat recirc ENABLE turned ON",
  description: "Fan heat recirc ENABLE turned ON",
  triggers: [triggers.ItemStateChangeTrigger("CT_Fan_Heating_circulate_enable", "OFF", "ON")],
  execute: (data) => {
    console.error("*********************************  conservatory_fan_heat_recirc_on - no action required");
  },
});


// @rule("React on Fan heat recirc ENABLE turned off", description="React on Fan heat recirc ENABLE turned off", tags=["conservatory", "fan"])
// @when("Item CT_Fan_Heating_circulate_enable changed from ON to OFF")
// def conservatory_fan_heat_recirc_off(event):
//     # if items["CT_Heater"] != ON: # prevent doinbg when heater is on - cos it may be recircing
//     conservatory_fan_heat_recirc_off.log.debug("conservatory_fan_heat_recirc_off - CT_Fan433PowerSocket OFF")
//     events.sendCommand("CT_Fan433PowerSocket", "OFF")
rules.JSRule({
  name: "Fan heat recirc ENABLE turned off",
  description: "Fan heat recirc ENABLE turned off",
  triggers: [triggers.ItemStateChangeTrigger("CT_Fan_Heating_circulate_enable", "ON", "OFF")],
  execute: (data) => {
    console.error("*********************************  conservatory_fan_heat_recirc_off - CT_Fan433PowerSocket OFF");
    items.getItem("CT_Fan433PowerSocket").sendCommand("OFF");
  },
});





// @rule("conservatory fan_cool rule", description="Handles fan actions", tags=["conservatory", "fan"])
// @when("Item CT_Temperature changed")
// @when("Item Conservatory_Fan_ON_Setpoint changed")
// def conservatory_fan_cool(event):
//     conservatory_fan_cool.log.debug("conservatory_fan_ cool rulel - check if cooling fan reqd")
//     setpoint = items["Conservatory_Fan_ON_Setpoint"]
//     temp = items["CT_Temperature"]
//     conservatory_fan_cool.log.debug(">>>> Conservatory_fan_ cool rulel CHECKING")
//     if ((items["CT_Fan_Cooling_enable"] == ON)):
//         if items["CT_Heater"] != ON: # prevent doinbg when heater is on - cos it may be recircing
//             if temp >= setpoint:
//                 events.sendCommand("CT_Fan433PowerSocket", "ON")
//             if temp < setpoint:
//                 events.sendCommand("CT_Fan433PowerSocket", "OFF")
//                 conservatory_fan_cool.log.debug(">>>> Conservatory_fan_ cool rulel turning fan off")
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


// @rule("React on Fan cooling  ENABLE turned on ON", description="React on Fan cooling recirc ENABLE turned on ON", tags=["conservatory", "fan"])
// @when("Item CT_Fan_Cooling_enable changed from OFF to ON")
// def conservatory_fan_cool_recirc_on(event):
//     # if items["CT_Heater"] != ON: # prevent doinbg when heater is on - cos it may be recircing
//     conservatory_fan_cool_recirc_on.log.debug("conservatory_fan_cool_recirc_on - no action required")
//         # events.sendCommand("CT_Fan433PowerSocket", "ON")
rules.JSRule({
  name: "Fan cooling  ENABLE turned ON",
  description: "Fan cooling  ENABLE turned ON",
  triggers: [triggers.ItemStateChangeTrigger("CT_Fan_Cooling_enable", "OFF", "ON")],
  execute: (data) => {
    console.error("*********************************  conservatory_fan_cool_recirc_on - no action required");
  },
});

// @rule("React on Fan cooling recirc ENABLE turned off", description="React on Fan cooling recirc ENABLE turned off", tags=["conservatory", "fan"])
// @when("Item CT_Fan_Cooling_enable changed from ON to OFF")
// def conservatory_fan_cool_recirc_on(event):
//     # if items["CT_Heater"] != ON: # prevent doinbg when heater is on - cos it may be recircing
//     conservatory_fan_cool_recirc_on.log.debug("conservatory_fan_cool_recirc_on - CT_Fan433PowerSocket OFF")
//     events.sendCommand("CT_Fan433PowerSocket", "OFF")
rules.JSRule({
  name: "Fan cooling  ENABLE turned OFF",
  description: "Fan cooling  ENABLE turned OFF",
  triggers: [triggers.ItemStateChangeTrigger("CT_Fan_Cooling_enable", "ON", "OFF")],
  execute: (data) => {
    console.error("*********************************  conservatory_fan_cool_recirc_off - - CT_Fan433PowerSocket OFF");
    items.getItem("CT_Fan433PowerSocket").sendCommand("OFF");
  },
});

// @rule("React on Fan Pulse (FanPulseSwitch) change/update", description="React on Fan Pulse (FanPulseSwitch) change/update", tags=["conservatory", "fan"])
// @when("Item FanPulseSwitch changed from OFF to ON")
// def conservatory_fan_pulse(event):
//     conservatory_fan_pulse.log.debug("conservatory_fan rulel now")
//     events.sendCommand("CT_Fan433PowerSocket", "ON")

//     fan_pulse_timer = ScriptExecution.createTimer(DateTime.now().plusSeconds(
//         25), lambda: events.sendCommand("CT_Fan433PowerSocket", "OFF"))

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
