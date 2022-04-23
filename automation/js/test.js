const email = "cbattisson@gmail.com"


scriptLoaded = function () {
    console.log("script loaded");
    loadedDate = Date.now();
}

// rules.JSRule({
//   name: "ZbWhiteBulb01Switch  OFF",
//   description: "Light will turn on when it's 5:00pm",
//   triggers: [triggers.GenericCronTrigger("0 0/1 * * * ?")],
//   execute: data => {
//     // items.getItem("ZbWhiteBulb01Switch").sendCommand("OFF");
//     // items.getItem("ZbWhiteBulb02Switch").sendCommand("OFF");
//     // actions.NotificationAction.sendNotification(email, "Balcony lights are  OFF");
//     console.info("*********************************  ZbWhiteBulb01Switch  OFF");
//     console.debug("*********************************  ZbWhiteBulb01Switch  OFF")

//   }
// });


