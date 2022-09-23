// from core.rules import rule
// from core.triggers import when
// from core.actions import LogAction
// from core.actions import ScriptExecution
// from java.time import ZonedDateTime as DateTime

// # https://community.openhab.org/t/design-pattern-motion-sensor-timer/14954
// timers = {}
// timeoutSeconds = 31  # use an appropriate value

// @rule("init BG avail status", description="zb temp sensors init", tags=["heating"])
// @when("System started")
// def init_BG_status(event):
//     init_BG_status.log.debug("init_BG_status")
//     for item in ir.getItem("gBG_sockets_reachable").members:
//         events.postUpdate(item, "Offline")

// const { time, items } = require('openhab-js');
const {
  log, items,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('BG_Availability.js');

scriptLoaded = function () {
  // const { items } = require('@runtime');#
  console.log(items);
  logger.warn('scriptLoaded -   init  BG avail statusesss');
  myutils.showGroupMembers('gBG_sockets_reachable');

  items.getItem('gBG_sockets_reachable').members.forEach((item) => {
    // whatitis = `${whatitis + batt.label}: ${batt.state}\r\n`;
    item.postUpdate('Offline');
  });

  myutils.showGroupMembers('gBG_sockets_reachable');
};

// # when a BG socket MQTT 'maxworktime' update comes in from device - updates frequency determined by broadlink2mqtt
// # use maxworktime as the value to monitor as using a pwr state may also come from rule updates etc and be a false presence
// @rule("update BG sockets Online/Offline status", description="monitor BG MQTT updates", tags=["BG"])
// @when("Member of gBG_socket_maxworktime_updates received update")
// def bgAvail(event):
//    ## # LogAction.logDebug("gBG_socket_maxworktime_updates", "!!!! gBG_socket_maxworktime_updates  Item {} received  update: {}", event.itemName, event.itemState)

//     # bgAvail.log.debug("!!!!bbb gBG_socket_maxworktime_updates  Item " + event.itemName + "received  update: " + event.itemState.toString())
//     # create the 'reachable' item name e.g bg_wifisocket_4_maxworktime to bg_wifisocket_4_reachable
//     item_name_reachable = event.itemName[:event.itemName.rfind('_')+1] + "reachable"
//     events.postUpdate(item_name_reachable, "Online")  # use reachable not triggering event cos its temp
//     # bgAvail.log.debug("== BG sockets Online/Offline status marked  ONLINE::")

//     if event.itemName not in timers or timers[event.itemName].hasTerminated():
//         timers[event.itemName] = ScriptExecution.createTimer(DateTime.now().plusSeconds(timeoutSeconds), lambda: events.postUpdate(item_name_reachable, "Offline"))
//     else:
//         timers[event.itemName].reschedule(DateTime.now().plusSeconds(timeoutSeconds))
rules.JSRule({
  name: 'update BG sockets Online/Offline status',
  description: 'monitor BG MQTT updates',
  triggers: [triggers.GroupStateUpdateTrigger('gBG_socket_maxworktime_updates')],
  execute: (data) => {
    // check if stereo already on - some stuff already on!
    // items.getItem('vCT_stereo').postUpdate('OFF'); //turn off stereo virt trigger button
    console.warn(`triggering item name: ${data.itemName}`);
    myutils.showGroupMembers('gBG_socket_maxworktime_updates');

    // console.error('££££££££============££££££££. If any heaters demand, turn Boiler ON else OFF');

    // below will list all items and states in a group
    // var whatitis = '';
    // items.getItem('gRoomHeaterStates').members.forEach(function (batt) {
    //   whatitis = whatitis + batt.label + ': ' + batt.state + '\r\n';
    // });

    // foreach (var light in items.getItem('AllChristmasLights').members) {
    //     light.sendCommandIfDifferent(newState);
    //   }
    // if (whatitis != '') {
    //!
    // console.error('\r\nGroup list: \r\n' + whatitis);

    // }

    // items.getItem('bg_wifisocket_1_2_power').sendCommand('ON'); //tv
    // items.getItem('bg_wifisocket_1_1_power').sendCommand('ON'); // kodi pi,amp ir bridge hdmi audio extractor

    // if there is a request to turn off the tv in progress cancel it as we want it on!
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
