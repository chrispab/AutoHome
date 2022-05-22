var CT_stereo_off_timer = null;
rules.JSRule({
    name: "turn ON conservatory stereo",
    description: "turn ON conservatory stereo",
    triggers: [
    triggers.ItemStateChangeTrigger("vCT_stereo", "OFF", "ON"),
    ],
    execute: (data) => {
        console.error("STEREO Turning on stereo - kodi, amp" );
        items.getItem("bg_wifisocket_1_1_power").sendCommand("ON");//kodi, amp, ir bridge, hdmi audio extractor
        // items.getItem("bg_wifisocket_1_1_power").sendCommand("ON");//kodi pi

        //if there is a request to turn off the stereo in progress cancel it as we want it on!
        if (CT_stereo_off_timer && CT_stereo_off_timer.isActive()) {
            CT_stereo_off_timer.cancel();
        }

        //     t_ampStandbyON = ScriptExecution.createTimer(DateTime.now().plusSeconds(45), lambda: events.sendCommand("amplifierPowerOn", "ON"))
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(20), function () {
            items.getItem("amplifier_IR_PowerOn").sendCommand("ON");// IR code
            console.error("STEREO - IR turn on amp from standby");
        });
        //     t_ampVideo01 = ScriptExecution.createTimer(DateTime.now().plusSeconds(60), lambda: events.sendCommand("amplifierVideo1", "ON"))
        actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(30), function () {
            items.getItem("amplifier_IR_Aux").sendCommand("ON");//IR code
            console.error("STEREO - IR amp switch to AUX source");
        });
    },
});


rules.JSRule({
    name: "turn OFF conservatory stereo",
    description: "turn OFF conservatory stereo",
    triggers: [
    // triggers.ItemStateUpdateTrigger("vCT_stereo", "OFF"),
    triggers.ItemStateChangeTrigger("vCT_stereo", "ON", "OFF"),

    ],
    execute: (data) => {
        console.error("Turning OFF stereo - kodi, amp, and bridges");
        items.getItem("Kodi_CT_SendSystemCommand").sendCommand("Shutdown");//shutdown CT Pi
        // console.error("err 2");
        items.getItem("amplifier_IR_PowerOff").sendCommand("ON");

        // items.getItem("bg_wifisocket_3_1_power").sendCommand("OFF");//amp ir bridge hdmi audio extractor
        console.error("STEREO - turned OFF amp, and bridges");
        //if stereo off timer is not defined or completed, restart the stereo off timer
        if (!CT_stereo_off_timer || !CT_stereo_off_timer.isActive()) {
            CT_stereo_off_timer = actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(60), function () {
                items.getItem("bg_wifisocket_1_1_power").sendCommand("OFF");//CT kodi, amp, ir bridge, hdmi audio extractor
                items.getItem("vCT_stereo").postUpdate("OFF");//turn off virt trigger

                console.error("STEREO - turned OFF kodi");
            });
        }
    },
});
