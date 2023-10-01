scriptLoaded = function () {
  console.log('zone3 notifications scriptLoaded function');
  loadedDate = Date.now();
};

const pir01_off_timer = null;
const pir02_off_timer = null;
rules.JSRule({
  name: 'zone3 lights on',
  description: 'zone3 lights on',
  triggers: [
    triggers.ItemStateChangeTrigger('testBtn1', 'OFF', 'ON'),

    triggers.ItemStateChangeTrigger('Zone3LightStatus', 'OFF', 'ON'),
    triggers.ItemStateChangeTrigger('Zone3LightStatusAlt', 'OFF', 'ON'),
  ],
  execute: (data) => {
    // console.error(
    //   `ON ON ON =======  zone3 lights on : ${data.itemName
    //   }, state: ${items.getItem(data.itemName).state
    //   }, PREV state: ${items.getItem(data.itemName).history.previousState()}`,
    // );
    currentState = items.getItem('KT_light_1_Power').state;

    items.getItem('KT_light_1_Power').sendCommand('ON');
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(1), () => {
      items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(2), () => {
      items.getItem('KT_light_1_Power').sendCommand('ON'); // IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(3), () => {
      items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(4), () => {
      items.getItem('KT_light_1_Power').sendCommand('ON'); // IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(5), () => {
      items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(6), () => {
      items.getItem('KT_light_1_Power').sendCommand('ON'); // IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(7), () => {
      items.getItem('KT_light_1_Power').sendCommand('OFF'); // IR code
      console.error('KT_light_1_Power');
    });
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(8), () => {
      items.getItem('KT_light_1_Power').sendCommand(currentState);
      console.error('KT_light_1_Power restore original state');
    });
  },
});


// t4 = None

// @rule("Zone 1 went Offline", description="Zone 1 went Offline", tags=["notification"])
// @when("Item Zone1Reachable changed to OFF")
// def zone1WentOffline(event):
//     zone1WentOffline.log.warn("Zone 1 went Offline")
//     NotificationAction.sendNotification("cbattisson@gmail.com","Zone 1 went offline")

//     global t4
//     if items["tableLamp1"] == ON:
//         events.sendCommand("tableLamp1", "OFF")
//         t4 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))

// t5 = None

// @rule("Zone 1 came Online", description="Zone 1 came Online", tags=["notification"])
// @when("Item Zone1Reachable changed to ON")
// def zone1WentOnline(event):
//     zone1WentOnline.log.warn("Zone 1 went Online")
//     NotificationAction.sendNotification("cbattisson@gmail.com","Zone 1 came Online")

//     global t5
//     if items["tableLamp1"] == ON:
//         events.sendCommand("tableLamp1", "OFF")
//         t5 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))

// t6 = None

// @rule("Zone 3 went Offline", description="Zone 3 went Offline", tags=["notification"])
// @when("Item Zone3Reachable changed to OFF")
// def zone3WentOffline(event):
//     zone3WentOffline.log.warn("Zone 1 went Offline")
//     NotificationAction.sendNotification("cbattisson@gmail.com","zone3 went offline")

//     global t6
//     if items["tableLamp1"] == ON:
//         events.sendCommand("tableLamp1", "OFF")
//         t6 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))

// t7 = None

// @rule("Zone 3 came Online", description="Zone 3 came Online", tags=["notification"])
// @when("Item Zone3Reachable changed to ON")
// def zone3WentOnline(event):
//     zone3WentOnline.log.warn("Zone 3 went Online")
//     NotificationAction.sendNotification("cbattisson@gmail.com","Zone 3 came Online")

//     global t7
//     if items["tableLamp1"] == ON:
//         events.sendCommand("tableLamp1", "OFF")
//         t7 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))
