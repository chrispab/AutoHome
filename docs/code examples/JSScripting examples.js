//e.g rule
rules.JSRule({
    name: "turn OFF conservatory stereo",
    description: "turn OFF conservatory stereo",
    triggers: [
    triggers.ItemStateUpdateTrigger("vCT_stereo", "OFF"),
    ],
    execute: (data) => {
        console.error("Turning OFF stereo - kodi, amp, and bridges");
        items.getItem("kodiConservatory_systemcommand").sendCommand("Shutdown");//shutdown CT Pi
        items.getItem("bg_wifisocket_3_1_power").sendCommand("OFF");//amp ir bridge hdmi audio extractor
        console.error("STEREO - turned OFF amp, and bridges");
        //if stereo off timer is not defined or completed, restart the stereo off timer
        if (!CT_stereo_off_timer || !CT_stereo_off_timer.isActive()) {
            CT_stereo_off_timer = actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(60), function () {
                items.getItem("bg_wifisocket_1_1_power").sendCommand("OFF");//kodi pi
                console.error("STEREO - turned OFF kodi");
            });
        }
    },
});

//cron
rules.JSRule({
    name: "CRON Hello World",
    description: "CRON Hello World",
    triggers: [
        triggers.GenericCronTrigger("0/15 * * * * ?")
    ],
    execute: (data) => {
        if (items.getItem("gConservatoryLights").state == "OFF") {
            console.error("CRON Hello  World");
            // items.getItem("gConservatoryLights").sendCommand("ON");

            // var {alerting} = require('personal');
            // alerting.sendInfo('CRON auto turn On conservatory lights MORNING if OFF');
        }
    },
});


//timer creation
        //if stereo off timer is not defined or completed, restart the stereo off timer
        if (!CT_stereo_off_timer || !CT_stereo_off_timer.isActive()) {
            CT_stereo_off_timer = actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(60), function () {
                //     events.sendCommand("CT_TV433PowerSocket", "OFF")
                //     events.sendCommand("bg_wifisocket_3_1_power", "OFF") #amp ir bridge hdmi audio extractor
                //     events.sendCommand("bg_wifisocket_1_1_power", "OFF") # kodi pi
                //     t_CTtvPowerOff = None
                items.getItem("bg_wifisocket_3_1_power").sendCommand("OFF");//amp ir bridge hdmi audio extractor
                items.getItem("bg_wifisocket_1_1_power").sendCommand("OFF");//kodi pi
                console.error("STEREO - turned OFF amp, kodi and brideges");
            });
        }


//on script loaded
scriptLoaded = function () {
  console.log("==================================script loaded");
  loadedDate = Date.now();
};

//sending emails
var {alerting} = require('personal');
alerting.sendInfo('CRON auto turn On conservatory lights MORNING if OFF');//email
alerting.sendAlert('CRON auto turn On conservatory lights MORNING if OFF');



Querying the status of a thing

const thingStatusInfo = actions.Things.getThingStatusInfo("zwave:serial_zstick:512");
console.log("Thing status",thingStatusInfo.getStatus());


