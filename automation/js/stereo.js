// @rule("Conservatory Pi Kodi and TV amp on", description="System started - set all rooms TV settings", tags=["tv"])
// @when("Item vCT_TVKodiSpeakers received update ON")
// @when("Item vCT_TVKodiSpeakers2 received update ON")
// def conservatory_tv_on(event):
//     global t_CTtvPowerOff
//     conservatory_tv_on.log.info("conservatory_tv_on")
//     Voice.say("Turning on conservatory TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))

//     events.sendCommand("CT_TV433PowerSocket", "ON") #tv
//     events.sendCommand("bg_wifisocket_3_1_power", "ON") #amp ir bridge hdmi audio extractor
//     events.sendCommand("bg_wifisocket_1_1_power", "ON") # kodi pi

//     if t_CTtvPowerOff is not None:
//         t_CTtvPowerOff = None

//     t_ampStandbyON = ScriptExecution.createTimer(DateTime.now().plusSeconds(45), lambda: events.sendCommand("amplifierPowerOn", "ON"))
//     t_ampVideo01 = ScriptExecution.createTimer(DateTime.now().plusSeconds(60), lambda: events.sendCommand("amplifierVideo1", "ON"))

var CT_stereo_off_timer = null;
rules.JSRule({
    name: "turn ON conservatory stereo",
    description: "turn ON conservatory stereo",
    triggers: [
    triggers.ItemStateUpdateTrigger("vCT_stereo", "ON"),
    // triggers.ItemStateUpdateTrigger("vCT_stereo2", "ON"),
    ],
    execute: (data) => {
        console.error("Turning on stereo - kodi, amp,and selecting Aux" );
        items.getItem("bg_wifisocket_3_1_power").sendCommand("ON");//amp ir bridge hdmi audio extractor
        items.getItem("bg_wifisocket_1_1_power").sendCommand("ON");//kodi pi

        //if there is a request to turn off the stereo in progress cancel it as we want it on!
        if (CT_stereo_off_timer && CT_stereo_off_timer.isActive()) {
            CT_stereo_off_timer.cancel();
        }

        //     t_ampStandbyON = ScriptExecution.createTimer(DateTime.now().plusSeconds(45), lambda: events.sendCommand("amplifierPowerOn", "ON"))
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(30), function () {
            items.getItem("amplifierPowerOn").sendCommand("ON");
            console.error("STEREO - turn on amp");
        });
        //     t_ampVideo01 = ScriptExecution.createTimer(DateTime.now().plusSeconds(60), lambda: events.sendCommand("amplifierVideo1", "ON"))
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(40), function () {
            items.getItem("amplifierAux").sendCommand("ON");
            console.error("STEREO - switch to aux source");
        });
    },
});
// @rule("Conservatory Pi Kodi and TV amp off", description="System started - set all rooms TV settings", tags=["tv"])
// @when("Item vCT_TVKodiSpeakers received update OFF")
// @when("Item vCT_TVKodiSpeakers2 received update OFF")
// def conservatory_tv_off(event):
//     conservatory_tv_off.log.info("conservatory_tv_off")
//     global t_CTtvPowerOff

//     Voice.say("Turning off Conservatory TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))

//     LogAction.logError("Shutdown Conservatory Kodi","Shutdown Conservatory Kodi: {}", event.itemName)
//     events.sendCommand("kodiConservatory_systemcommand","Shutdown")
//     events.sendCommand("amplifierPowerOff", "ON")

//     if t_CTtvPowerOff is None:
//         t_CTtvPowerOff = ScriptExecution.createTimer(DateTime.now().plusSeconds(30), lambda: tvoffbody())

// def tvoffbody():
//     global t_CTtvPowerOff
//     events.sendCommand("CT_TV433PowerSocket", "OFF")
//     events.sendCommand("bg_wifisocket_3_1_power", "OFF") #amp ir bridge hdmi audio extractor
//     events.sendCommand("bg_wifisocket_1_1_power", "OFF") # kodi pi
//     t_CTtvPowerOff = None
rules.JSRule({
    name: "turn OFF conservatory stereo",
    description: "turn OFF conservatory stereo",
    triggers: [
    triggers.ItemStateUpdateTrigger("vCT_stereo", "OFF"),
    // triggers.ItemStateUpdateTrigger("vCT_stereo2", "ON"),
    ],
    execute: (data) => {
        console.error("Turning OFF stereo - kodi, amp, and bridges");
        items.getItem("kodiConservatory_systemcommand").sendCommand("Shutdown");//shutdown CT Pi
        items.getItem("bg_wifisocket_3_1_power").sendCommand("OFF");//amp ir bridge hdmi audio extractor
        console.error("STEREO - turned OFF amp, and bridges");
        //if stereo off timer is not defined or completed, restart the stereo off timer
        if (!CT_stereo_off_timer || !CT_stereo_off_timer.isActive()) {
            CT_stereo_off_timer = actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(60), function () {
                //     events.sendCommand("CT_TV433PowerSocket", "OFF")
                //     events.sendCommand("bg_wifisocket_3_1_power", "OFF") #amp ir bridge hdmi audio extractor
                //     events.sendCommand("bg_wifisocket_1_1_power", "OFF") # kodi pi
                //     t_CTtvPowerOff = None
                // items.getItem("bg_wifisocket_3_1_power").sendCommand("OFF");//amp ir bridge hdmi audio extractor
                items.getItem("bg_wifisocket_1_1_power").sendCommand("OFF");//kodi pi
                console.error("STEREO - turned OFF kodi");
            });
        }
    },
});
