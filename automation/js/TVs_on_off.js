// tStartup = None

// @rule("System started - set all rooms TV startup settings", description="System started - set all rooms TV settings", tags=["tv"])
// @when("System started")
// def tvs_init(event):
//     tvs_init.log.info("System started - set all rooms TV startup settings")
//     events.postUpdate("BridgeLightSensorState", "OFF")
//     global tStartup
//     if tStartup is None:
//         tStartup = ScriptExecution.createTimer(DateTime.now().plusSeconds(5), lambda: tv_startup_tbody())

// def tv_startup_tbody():
//     tvs_init.log.info(
//         "TV.rules Executing 'System started' rule for ALL Kodi's and TVs -  Kodi, TVs Initialize uninitialized virtual Items")
//     if items["vFR_TVKodi"] == NULL:
//         events.postUpdate("vFR_TVKodi", "OFF")  # // set power up val
//         tvs_init.log.info("TV.rules System started rule, change front room tv power state from NULL to OFF")
//     if items["vBR_TVKodi"] == NULL:
//         events.postUpdate("vBR_TVKodi", "OFF")  # // set power up val
//         tvs_init.log.info("System started' rule, change bedroom tv power state from NULL to OFF")
//     if items["vCT_TVKodiSpeakers"] == NULL:
//         events.postUpdate("vCT_TVKodiSpeakers", "OFF")  # // set power up val
//         tvs_init.log.info("'System started' rule, change conservatory tv power state from NULL to OFF")
//     if items["vAT_TVKodi"] == NULL:
//         events.postUpdate("vAT_TVKodi", "OFF")  # // set power up val
//         tvs_init.log.info("TV.rules System started rule, change Attic TV and kodi power state from NULL to OFF")

scriptLoaded = function () {
  console.error('System started - set all rooms TV startup settings');

  console.error('startup- set Kodi_CT_Online_Status status ');
  const thingStatusInfo = actions.Things.getThingStatusInfo('kodi:kodi:4cc97fc0-c074-917d-e452-aed8219168eb');
  console.error('Thing Kodi_CT_Online_Status status', thingStatusInfo.getStatus());

  if (thingStatusInfo.getStatus().toString() == 'ONLINE') {
    items.getItem('Kodi_CT_Online_Status').postUpdate('ONLINE');
  } else {
    items.getItem('Kodi_CT_Online_Status').postUpdate('OFFLINE');
  }
};

// #######################################
// t_CTtvPowerOff = None

// @rule("Conservatory Pi Kodi and TV amp on", description="System started - set all rooms TV settings", tags=["tv"])
// @when("Item vCT_TVKodiSpeakers received update ON")
// @when("Item vCT_TVKodiSpeakers2 received update ON")
// def conservatory_tv_on(event):
//     global t_CTtvPowerOff
//     conservatory_tv_on.log.info("conservatory_tv_on")
//     Voice.say("Turning on conservatory TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))

//     events.sendCommand("bg_wifisocket_1_2_power", "ON") #tv
//     events.sendCommand("bg_wifisocket_1_1_power", "ON") # kodi pi,amp ir bridge hdmi audio extractor

//     if t_CTtvPowerOff is not None:
//         t_CTtvPowerOff = None

//     t_ampStandbyON = ScriptExecution.createTimer(DateTime.now().plusSeconds(45), lambda: events.sendCommand("amplifier_IR_PowerOn", "ON"))
//     t_ampVideo01 = ScriptExecution.createTimer(DateTime.now().plusSeconds(60), lambda: events.sendCommand("amplifier_IR_Video1", "ON"))

var CT_TV_off_timer = null;
rules.JSRule({
  name: 'turn ON conservatory TV',
  description: 'turn ON conservatory TV',
  triggers: [triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers', 'OFF', 'ON')],
  execute: (data) => {
    //check if stereo already on - some stuff already on!
    items.getItem('vCT_stereo').postUpdate('OFF'); //turn off stereo virt trigger button

    console.error('Turning on CT - TV - kodi, amp, ir bridge');
    items.getItem('bg_wifisocket_1_2_power').sendCommand('ON'); //tv
    items.getItem('bg_wifisocket_1_1_power').sendCommand('ON'); // kodi pi,amp ir bridge hdmi audio extractor

    //if there is a request to turn off the tv in progress cancel it as we want it on!
    if (CT_TV_off_timer && CT_TV_off_timer.isActive()) {
      CT_TV_off_timer.cancel();
    }

    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(20), function () {
      items.getItem('amplifier_IR_PowerOn').sendCommand('ON'); // IR code
      console.error('STEREO - IR turn on amp from standby');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(30), function () {
      items.getItem('amplifier_IR_Video1').sendCommand('ON'); //IR code
      console.error('STEREO - IR amp switch to amplifier_IR_Video1 source');
    });
  },
});

// #------------------------------------
// @rule("Conservatory Pi Kodi and TV amp off", description="System started - set all rooms TV settings", tags=["tv"])
// @when("Item vCT_TVKodiSpeakers received update OFF")
// @when("Item vCT_TVKodiSpeakers2 received update OFF")
// def conservatory_tv_off(event):
//     conservatory_tv_off.log.info("conservatory_tv_off")
//     global t_CTtvPowerOff

//     Voice.say("Turning off Conservatory TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))

//     # events.postUpdate("shutdownKodiConservatoryProxy", "OFF") - this routine can be removed if this works
//     LogAction.logError("Shutdown Conservatory Kodi","Shutdown Conservatory Kodi: {}", event.itemName)
//     events.sendCommand("Kodi_CT_SendSystemCommand","Shutdown")
//     events.sendCommand("amplifier_IR_PowerOff", "ON")
//     events.sendCommand("bg_wifisocket_1_2_power", "OFF") #tv

//     if t_CTtvPowerOff is None:
//         t_CTtvPowerOff = ScriptExecution.createTimer(DateTime.now().plusSeconds(60), lambda: tvoffbody())
rules.JSRule({
  name: 'turn OFF conservatory tv',
  description: 'turn OFF conservatory tv',
  triggers: [triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers', 'ON', 'OFF')],
  execute: (data) => {
    console.error('Turning OFF tv - kodi, amp, and bridges');
    items.getItem('Kodi_CT_SendSystemCommand').sendCommand('Shutdown'); //shutdown CT Pi
    console.error('sent command - shutdown kodi');
    items.getItem('amplifier_IR_PowerOff').sendCommand('ON');
    items.getItem('bg_wifisocket_1_2_power').sendCommand('OFF'); //tv

    console.error('tv - turned OFF amp, and bridges');
    //if stereo off timer is not defined or completed, restart the stereo off timer
    if (!CT_TV_off_timer || !CT_TV_off_timer.isActive()) {
      CT_TV_off_timer = actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(30), function () {
        items.getItem('bg_wifisocket_1_1_power').sendCommand('OFF'); //CT kodi, amp, ir bridge, hdmi audio extractor
        // items.getItem('bg_wifisocket_1_2_power').sendCommand('OFF'); //tv

        items.getItem('vCT_TVKodiSpeakers').postUpdate('OFF'); //turn off virt trigger
        console.error('turned off kodi power');
      });
    }
  },
});
