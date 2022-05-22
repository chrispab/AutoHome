//!TODO
// @rule("auto lighting init", description="Handles fan actions", tags=["conservatory"])
// @when("System started")
// def auto_lighting_init(event):
//     auto_lighting_init.log.info("auto_lighting_init")
//     events.postUpdate("BridgeLightSensorState", "OFF")



rules.JSRule({
    name: "CRON auto turn On conservatory lights MORNING if dark",
    description: "CRON auto turn On conservatory lights MORNING if dark",
    triggers: [
        triggers.GenericCronTrigger("0 0 07 * * ?")
    ],
    execute: (data) => {
        if (items.getItem("BridgeLightSensorState").state == "OFF") {        //!only turn on if dark

            console.error("CRON auto turn On conservatory lights MORNING");
            items.getItem("gConservatoryLights").sendCommand("ON");

            var {alerting} = require('personal');
            alerting.sendInfo('CRON auto turn On conservatory lights MORNING if OFF');
        }
    },
});



rules.JSRule({
    name: "auto turn OFF conservatory lights",
    description: "turn OFF conservatory lights when ambient light level high",
        triggers: [
    triggers.ItemStateChangeTrigger("BridgeLightSensorState", "OFF", "ON"),
    ],
    execute: (data) => {
        console.error("turn OFF conservatory lights when ambient light level high");
        items.getItem("gConservatoryLights").sendCommand("OFF");
        items.getItem("gColourBulbs").sendCommand("OFF");

        var {alerting} = require('personal');
        alerting.sendInfo('auto turn OFF conservatory lights');
    },
});




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

        var {alerting} = require('personal');
        alerting.sendInfo('auto turn ON conservatory lights if getting dark');
    },
});


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

        var {alerting} = require('personal');
        alerting.sendInfo('CRON auto turn OFF conservatory lights');
    },
});
