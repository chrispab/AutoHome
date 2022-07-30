// @rule("If any heaters demand, turn Boiler ON else OFF", description="If heater demand turn on Boiler else off", tags=["boiler"])
// @when("Member of gRoomHeaterStates received update") #update if ANY heater demand updated - v often
// def boiler_control(event):

//     if items["gAnyRoomHeaterOn"] == ON:
//         # get list of ON heatees
//         listOfMembers = [item for item in ir.getItem("gRoomHeaterStates").members if item.state == ON]
//         LogAction.logDebug("boiler control", "::: LIST OF HEATERS ON :::")
//         for item in listOfMembers:
//             LogAction.logDebug("boiler control", ":::Heater Item: {}, is : {}", item.name, item.state)

//         LogAction.logDebug("Boiler_Control rule", ":::-> at least 1 heater on -> Send boiler ON command")
//         events.sendCommand("Boiler_Control", "ON")

//     else:  # no rooms want heat so turn off boiler
//         LogAction.logDebug("Boiler_Control rule", "::: -> All heaters are off -> Send boiler OFF command")
//         events.sendCommand("Boiler_Control", "OFF")
rules.JSRule({
  name: 'If any heaters demand, turn Boiler ON else OFF',
  description: 'If heater demand turn on Boiler else off',
  triggers: [triggers.GroupStateUpdateTrigger('gRoomHeaterStates', 'OFF', 'ON')],
  execute: (data) => {
    //check if stereo already on - some stuff already on!
    // items.getItem('vCT_stereo').postUpdate('OFF'); //turn off stereo virt trigger button

    console.error('££££££££vv££££££££. If any heaters demand, turn Boiler ON else OFF');

    //below will list all items and states in a group
    var whatitis = '';
    items.getItem('gRoomHeaterStates').members.forEach(function (batt) {
      whatitis = whatitis + batt.label + ': ' + batt.state + '\r\n';
    });

    // foreach (var light in items.getItem('AllChristmasLights').members) {
    //     light.sendCommandIfDifferent(newState);
    //   }
    // if (whatitis != '') {
    //!
    // console.error('\r\nGroup list: \r\n' + whatitis);

    // }

    // items.getItem('bg_wifisocket_1_2_power').sendCommand('ON'); //tv
    // items.getItem('bg_wifisocket_1_1_power').sendCommand('ON'); // kodi pi,amp ir bridge hdmi audio extractor

    //if there is a request to turn off the tv in progress cancel it as we want it on!
    // if (CT_TV_off_timer && CT_TV_off_timer.isActive()) {
    //   CT_TV_off_timer.cancel();
    // }

    // actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(20), function () {
    //   items.getItem('amplifier_IR_PowerOn').sendCommand('ON'); // IR code
    //   console.error('STEREO - IR turn on amp from standby');
    // });
    // actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(30), function () {
    //   items.getItem('amplifier_IR_Video1').sendCommand('ON'); //IR code
    //   console.error('STEREO - IR amp switch to amplifier_IR_Video1 source');
    // });
  },
});
