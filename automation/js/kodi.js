// const thingStatusInfo = actions.Things.getThingStatusInfo("zwave:serial_zstick:512");
// console.log("Thing status",thingStatusInfo.getStatus());
// triggers.ThingStatusChangeTrigger('some:thing:uuid','ONLINE','OFFLINE')
scriptLoaded = function () {
    console.error("======set KodiConservatory status scriptLoaded");
    // loadedDate = Date.now();
    console.error("set KodiConservatory status ");
    const thingStatusInfo = actions.Things.getThingStatusInfo("kodi:kodi:KodiConservatory");
    console.error("Thing KodiConservatory status",thingStatusInfo.getStatus());

    if (thingStatusInfo.getStatus().toString()=="ONLINE"){
        items.getItem("KodiConservatoryStatus").postUpdate("ONLINE");
    }else{
        items.getItem("KodiConservatoryStatus").postUpdate("OFFLINE");
    }
  };

rules.JSRule({
    name: "set KodiConservatory status",
    description: "set KodiConservatory status",
    triggers: [
    triggers.ThingStatusChangeTrigger('kodi:kodi:KodiConservatory'),
    ],
    execute: (data) => {
        console.error("set KodiConservatory status");
        const thingStatusInfo = actions.Things.getThingStatusInfo("kodi:kodi:KodiConservatory");
        console.error("Thing KodiConservatory status",thingStatusInfo.getStatus());

        if (thingStatusInfo.getStatus().toString()=="ONLINE"){
            items.getItem("KodiConservatoryStatus").postUpdate("ONLINE");
        }else{
            items.getItem("KodiConservatoryStatus").postUpdate("OFFLINE");
        }

    },
});
