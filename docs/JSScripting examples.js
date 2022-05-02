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


        code usage in YAML: view of a component/widget
        visible: =items.TV_Powered.state === 'ON' && items.TV_Input.state === 'HDMI1'

        visible: =items.KodiConservatory_fanart.state


        KodiConservatory_fanart


        component: oh-slider-card
        config:
          item: KodiConservatory_currenttime
          outline: true
          title: track time
          max: =items.KodiConservatory_duration
        slots: null

        footer: =items.KodiConservatory_album.state

        =items.KodiConservatory_ctp.state.intValue()

        =items.CT_Temperature.state


        //sending emails
        var {alerting} = require('personal');
        alerting.sendInfo('CRON auto turn On conservatory lights MORNING if OFF');


        component: oh-gauge-card
        config:
          item: KodiConservatory_currenttime
          min: 0
          max: =items.KodiConservatory_duration.rawState.intValue()
          outline: true
          title: Track %
          type: circle
          valueTextColor: red
        slots: null
        component: oh-gauge-card
        config:
          item: KodiConservatory_currenttime
          min: 0
          max: =items.KodiConservatory_duration.rawState.intValue()
          outline: true
          title: Track %
          type: circle
          valueTextColor: red
        slots: null
        component: oh-gauge-card
        config:
          min: 0
          max: =items.KodiConservatory_duration.rawState.intValue()
          outline: true
          title: Track time
          type: circle
          valueTextColor: red
          value: =items.KodiConservatory_currenttime.rawState.intValue()
          valueText: =items.KodiConservatory_currenttime.state
        slots: null
        =items.KodiConservatory_duration.split(' ')[0].intValue()
        =items.KodiConservatory_duration.state.split(' ')[0]

        =(Number.parseFloat(items.MainFloor_Humidity.state.split(" ")[0]) < 35) ? "red" : (Number.parseFloat(items.MainFloor_Humidity.state.split(" ")[0]) < 75) ? "yellow" : "blue"

        =Number.parseInt(items.KodiConservatory_duration.state.split(' ')[0])
        KodiConservatory_currenttime
        =Number.parseFloat(items.KodiConservatory_currenttime.state.split(' ')[0])
        component: oh-gauge-card
        config:
          min: 0
          max: =Number.parseFloat(items.KodiConservatory_duration.state.split(' ')[0])
          outline: true
          title: Track time
          type: circle
          valueTextColor: red
          value: =Number.parseFloat(items.KodiConservatory_currenttime.state.split(' ')[0])
          valueText: =items.KodiConservatory_currenttime.state
        slots: null
        =items.KodiConservatory_ctp.state.toString()
        =Number.parseInt(items.KodiConservatory_ctp.state.split(' ')[0])
