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
