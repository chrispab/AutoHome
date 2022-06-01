scriptLoaded = function () {
    console.error("scriptLoaded init outside sensor stuff");
    // loadedDate = Date.now();
  };


rules.JSRule({
    name: "outside sensor went offlineZZ",
    description: "outside sensor went offline",
    triggers: [
        triggers.ItemStateUpdateTrigger("Outside_Reachable", "Offline"),
    ],
    execute: (data) => {
        console.error("outside sensor went offline YY");
        var {alerting} = require('personal');
        // alerting.sendInfo('outside sensor went offline');
        // alerting.sendAlert('Outside_Reachable gone Online');

        if (items.getItem("outsideReboots").state == "NULL"){
            console.error("++++++++++++++++++++++Checking outsideRebbots is NULL?");
            items.getItem("outsideReboots").postUpdate("OFF");
        }
        // items.getItem("outsideSensorPower").sendCommand("OFF");
    },
});


rules.JSRule({
    name: "outside sensor came online",
    description: "outside sensor came online",
    triggers: [
        triggers.ItemStateUpdateTrigger("Outside_Reachable", "Online"),
    ],
    execute: (data) => {
        console.error("outside sensor came online");
        var {alerting} = require('personal');
        // alerting.sendInfo('outside sensor came online');
        // alerting.sendAlert('Outside_Reachable gone Online');
    },
});

