//!TODO
// @rule("auto lighting init", description="Handles fan actions", tags=["conservatory"])
// @when("System started")
// def auto_lighting_init(event):
//     auto_lighting_init.log.info("auto_lighting_init")
//     events.postUpdate("BridgeLightSensorState", "OFF")



// # rule "if dark in morning turn on conservatory lights"
// @rule("auto_lighting_on_morning", description="auto conservatory lights", tags=["conservatory"])
// @when("Time cron 0 00 07 ? * * *")
// def auto_lighting_on_morning(event):
//     if items["BridgeLightSensorState"] == OFF:
//         events.sendCommand("gConservatoryLights", "ON")
rules.JSRule({
    name: "CRON auto turn On conservatory lights MORNING",
    description: "CRON auto turn On conservatory lights MORNING",
    triggers: [
        triggers.GenericCronTrigger("0 0 07 * * ?")
    ],
    execute: (data) => {
        if (items.getItem("gConservatoryLights").state == "OFF") {
            console.error("CRON auto turn On conservatory lights MORNING");
            items.getItem("gConservatoryLights").sendCommand("ON");
        }
    },
});


// # rule "turn off lights (if on) when daylight rises"
// @rule("auto cvty  lights on t,w,thurs early", description="auto conservatory lights", tags=["conservatory"])
// @when("Time cron 0 30 6 ? * TUE,WED,THU *")
// def auto_lighting_on_morning(event):
//     if items["BridgeLightSensorState"] == OFF:
//         events.sendCommand("gConservatoryLights", "ON")
rules.JSRule({
    name: "CRON auto turn On conservatory lights early early MORNING",
    description: "CRON auto turn On conservatory lights early MORNING",
    triggers: [
        triggers.GenericCronTrigger("0 30 0 * * ?")
    ],
    execute: (data) => {
        if (items.getItem("gConservatoryLights").state == "OFF") {
            console.error("CRON auto turn On conservatory lights early MORNING");
            items.getItem("gConservatoryLights").sendCommand("ON");
        }
    },
});


// @rule("auto_lighting_off_morning", description="Handles fan actions", tags=["conservatory"])
// @when("Item BridgeLightSensorState changed from OFF to ON")
// def auto_lighting_off_morning(event):
//     if items["BridgeLightSensorState"] == ON:
//         # events.sendCommand("conservatoryLightsProxy", "OFF")
//         events.sendCommand("gConservatoryLights", "OFF")
//         events.sendCommand("gColourBulbs", "OFF")
rules.JSRule({
    name: "auto turn OFF conservatory lights",
    description: "turn OFF conservatory lights when ambient light level high",
        triggers: [
    triggers.ItemStateChangeTrigger("BridgeLightSensorState", "OFF", "ON"),
    ],
    execute: (data) => {
        console.error("turn OFF conservatory lights when ambient light level high");
        items.getItem("conservatoryLightsProxy").sendCommand("OFF");
        items.getItem("gColourBulbs").sendCommand("OFF");
    },
});



// # rule "Light sensor Turn ON lights when it gets dark"
// @rule("auto_lighting_on_evening", description="Handles fan actions", tags=["conservatory"])
// @when("Item BridgeLightSensorState changed from ON to OFF")
// def auto_lighting_on_evening(event):
//     # events.sendCommand("conservatoryLightsProxy", "ON")
//     events.sendCommand("gConservatoryLights", "ON")
rules.JSRule({
    name: "auto turn ON conservatory lights",
    description: "turn ON conservatory lights when ambient light level low",
    triggers: [
        triggers.ItemStateChangeTrigger("BridgeLightSensorState", "ON", "OFF"),
    ],
    execute: (data) => {
        console.error("turn ON conservatory lights when ambient light level low");
        // items.getItem("conservatoryLightsProxy").sendCommand("ON");
        items.getItem("gConservatoryLights").sendCommand("ON");
    },
});

// # rule "2.30 am turn off lights if i forgot"
// @rule("auto_lighting_off_late", description="Handles fan actions", tags=["conservatory"])
// @when("Time cron 0 30 01 ? * * *")
// def auto_lighting_off_late(event):
//     # events.sendCommand("conservatoryLightsProxy", "OFF")
//     events.sendCommand("gConservatoryLights", "OFF")
//     events.sendCommand("gColourBulbs", "OFF")
rules.JSRule({
    name: "CRON auto turn OFF conservatory lights",
    description: "CRON turn OFF conservatory lights when late - maybe forgot",
    triggers: [
        triggers.GenericCronTrigger("0 30 01 * * ?")
    ],
    execute: (data) => {
        console.error("CRON turn OFF conservatory lights when late - maybe forgot");
        items.getItem("gConservatoryLights").sendCommand("OFF");
        items.getItem("gColourBulbs").sendCommand("OFF");
    },
});
