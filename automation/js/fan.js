// from core.rules import rule
// from core.triggers import when
// from core.actions import ScriptExecution
// from java.time import ZonedDateTime as DateTime


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
//                     # ScriptExecution.createTimer(DateTime.now().plusSeconds(120), lambda: (XiaomiMotionSensorBathroom_Motion_3(CLOSED)))
// def ct_fan_body():
//     events.sendCommand("CT_Fan433PowerSocket", "OFF")
//     conservatory_fan.log.debug("conservatory_fan recic heat turn FAN OFF NOW   XX")




// @rule("React on Fan heat recirc ENABLE turned on ON", description="React on Fan heat recirc ENABLE turned on ON", tags=["conservatory", "fan"])
// # @when("Item CT_Fan_Cooling_enable changed from OFF to ON")
// @when("Item CT_Fan_Heating_circulate_enable changed from OFF to ON")
// def conservatory_fan_heat_recirc_on(event):
//     # if items["CT_Heater"] != ON: # prevent doinbg when heater is on - cos it may be recircing
//     conservatory_fan_heat_recirc_on.log.debug("conservatory_fan_heat_recirc_on - no action required")
//         # events.sendCommand("CT_Fan433PowerSocket", "ON")






// cooling
// @rule("React on Fan heat recirc ENABLE turned off", description="React on Fan heat recirc ENABLE turned off", tags=["conservatory", "fan"])
// @when("Item CT_Fan_Heating_circulate_enable changed from ON to OFF")
// def conservatory_fan_heat_recirc_off(event):
//     # if items["CT_Heater"] != ON: # prevent doinbg when heater is on - cos it may be recircing
//     conservatory_fan_heat_recirc_off.log.debug("conservatory_fan_heat_recirc_off - CT_Fan433PowerSocket OFF")
//     events.sendCommand("CT_Fan433PowerSocket", "OFF")



// @rule("conservatory fan_cool rule", description="Handles fan actions", tags=["conservatory", "fan"])
// @when("Item CT_Temperature changed")
// @when("Item Conservatory_Fan_ON_Setpoint changed")
// def conservatory_fan_cool(event):
//     conservatory_fan_cool.log.debug("conservatory_fan_ cool rulel - check if cooling fan reqd")
//     setpoint = items["Conservatory_Fan_ON_Setpoint"]
//     # turnOnTemp = setpoint
//     temp = items["CT_Temperature"]
//    # sp = items["CT_TemperatureSetpoint"]

//     conservatory_fan_cool.log.debug(">>>> Conservatory_fan_ cool rulel CHECKING")
//     if ((items["CT_Fan_Cooling_enable"] == ON)):
//         if items["CT_Heater"] != ON: # prevent doinbg when heater is on - cos it may be recircing
//             if temp >= setpoint:
//                 events.sendCommand("CT_Fan433PowerSocket", "ON")
//             if temp < setpoint:
//                 events.sendCommand("CT_Fan433PowerSocket", "OFF")
//                 conservatory_fan_cool.log.debug(">>>> Conservatory_fan_ cool rulel turning fan off")
scriptLoaded = function () {
    console.log("==================================script loaded");
    loadedDate = Date.now();
}


// @rule("React on Fan cooling  ENABLE turned on ON", description="React on Fan cooling recirc ENABLE turned on ON", tags=["conservatory", "fan"])
// @when("Item CT_Fan_Cooling_enable changed from OFF to ON")
// def conservatory_fan_cool_recirc_on(event):
//     # if items["CT_Heater"] != ON: # prevent doinbg when heater is on - cos it may be recircing
//     conservatory_fan_cool_recirc_on.log.debug("conservatory_fan_cool_recirc_on - no action required")
//         # events.sendCommand("CT_Fan433PowerSocket", "ON")
rules.JSRule({
    name: "Fan cooling  ENABLE turned ON",
    description: "Fan cooling  ENABLE turned ON",
    triggers: [triggers.ItemStateChangeTrigger('CT_Fan_Cooling_enable', 'OFF', 'ON')],
    execute: data => {
      // items.getItem("ZbWhiteBulb01Switch").sendCommand("OFF");
      // items.getItem("ZbWhiteBulb02Switch").sendCommand("OFF");
      // actions.NotificationAction.sendNotification(email, "Balcony lights are  OFF");
      console.info("*********************************  conservatory_fan_cool_recirc_on - no action required");
      console.error("*********************************  conservatory_fan_cool_recirc_on - no action required")

    }
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
    triggers: [triggers.ItemStateChangeTrigger('CT_Fan_Cooling_enable', 'ON', 'OFF')],
    execute: data => {
      // items.getItem("ZbWhiteBulb01Switch").sendCommand("OFF");
      // items.getItem("ZbWhiteBulb02Switch").sendCommand("OFF");
      // actions.NotificationAction.sendNotification(email, "Balcony lights are  OFF");
      console.info("*********************************  conservatory_fan_cool_recirc_off - - CT_Fan433PowerSocket OFF");
      console.error("*********************************  conservatory_fan_cool_recirc_off - - CT_Fan433PowerSocket OFF");
      items.getItem("CT_Fan433PowerSocket").sendCommand("OFF");

    }
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
    triggers: [triggers.ItemStateChangeTrigger('FanPulseSwitch', 'OFF', 'ON')],
    execute: data => {
        console.error("*********************************  fan pulse CT_Fan433PowerSocket ON");

      items.getItem("CT_Fan433PowerSocket").sendCommand("ON");
      actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(10), function() {
        items.getItem('CT_Fan433PowerSocket').sendCommand('OFF');
        console.error("*********************************  fan pulse CT_Fan433PowerSocket OFF");
      });

    }
  });
