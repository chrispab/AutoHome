// @rule("outside sensor  startup", description="outside sensor ", tags=["Heating"])
// @when("System started")
// def outside_startup(event):
//     LogAction.logError("outside sensor  startup", "outside sensor  startup")
//     if items["outsideReboots"] == NULL:
//         events.postUpdate(ir.getItem("outsideReboots"), 0)
scriptLoaded = function () {
    console.error("scriptLoaded init outside sensor stuff");
    // loadedDate = Date.now();
  };

// t1 = None


// @rule("outside sensor goes offline", description="outside sensor goes offline", tags=["notification"])
// @when("Item Outside_Reachable changed to \"Offline\"")
// def OS_sensor_offline(event):
//     OS_sensor_offline.log.error("outside sensor went offline")
//     NotificationAction.sendNotification("cbattisson@gmail.com", "outside sensor gone offline")

//     global t1
//     if items["outsideReboots"] == NULL:
//         events.postUpdate("ousideReboots", 0)

//     events.sendCommand("outsideSensorPower", "OFF")
//     t1 = ScriptExecution.createTimer(DateTime.now().plusSeconds(15), lambda: events.sendCommand("outsideSensorPower", "ON"))
//     events.postUpdate(ir.getItem("outsideReboots"), items["outsideReboots"].intValue() + 1)
rules.JSRule({
    name: "outside sensor went offlineZZ",
    description: "outside sensor went offline",
    triggers: [
        triggers.ItemStateUpdateTrigger("Outside_Reachable", "Offline"),
    ],
    execute: (data) => {
        console.error("outside sensor went offline YY");
        var {alerting} = require('personal');
        alerting.sendInfo('outside sensor went offline MM');
        // alerting.sendAlert('Outside_Reachable gone Online');

        if (items.getItem("outsideReboots").state == "NULL"){
            console.error("++++++++++++++++++++++Checking outsideRebbots is NULL?");
            items.getItem("outsideReboots").postUpdate("OFF");
        }
        // items.getItem("outsideSensorPower").sendCommand("OFF");


    },
});



// @rule("outside sensor came online", description="outside sensor came online", tags=["notification"])
// @when("Item Outside_Reachable changed to \"Online\"")
// def OSOnline(event):
//     OSOnline.log.error("outside sensor came online")
//     NotificationAction.sendNotification("cbattisson@gmail.com", "outside sensor came online")
rules.JSRule({
    name: "outside sensor came online",
    description: "outside sensor came online",
    triggers: [
        triggers.ItemStateUpdateTrigger("Outside_Reachable", "Online"),
    ],
    execute: (data) => {
        console.error("Outside_Reachable gone Online");
        var {alerting} = require('personal');
        alerting.sendInfo('Outside_Reachable gone Online');
        // alerting.sendAlert('Outside_Reachable gone Online');
    },
});

