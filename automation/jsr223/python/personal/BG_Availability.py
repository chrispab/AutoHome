from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from java.time import ZonedDateTime as DateTime

# https://community.openhab.org/t/design-pattern-motion-sensor-timer/14954
timers = {}
timeoutSeconds = 31  # use an appropriate value


@rule("init BG avail status", description="zb temp sensors init", tags=["heating"])
@when("System started")
def init_BG_status(event):
    init_BG_status.log.debug("init_BG_status")
    for item in ir.getItem("gBG_sockets_reachable").members:
        events.postUpdate(item, "Offline")

    # events.postUpdate(ir.getItem("ZbRouter_01_Reachable"), "offline")


# when a BG socket MQTT 'maxworktime' update comes in from device - updates frequency determined by broadlink2mqtt
# use maxworktime as the value to monitor as using a pwr state may also come from rule updates etc and be a false presence
@rule("update BG sockets Online/Offline status", description="monitor BG MQTT updates", tags=["BG"])
@when("Member of gBG_socket_maxworktime_updates received update")
def bgAvail(event):
    LogAction.logDebug("gBG_socket_maxworktime_updates", "!!!! gBG_socket_maxworktime_updates  Item {} received  update: {}", event.itemName, event.itemState)
    # create the 'reachable' item name e.g bg_wifisocket_4_maxworktime to bg_wifisocket_4_reachable
    newname = event.itemName[:event.itemName.rfind('_')+1] + "reachable"
    events.postUpdate(newname, "Online")  # use reachable not triggering event cos its temp
    bgAvail.log.debug("== BG sockets Online/Offline status marked  ONLINE::")

    if event.itemName not in timers or timers[event.itemName].hasTerminated():
        timers[event.itemName] = ScriptExecution.createTimer(DateTime.now().plusSeconds(timeoutSeconds), lambda: events.postUpdate(newname, "Offline"))
    else:
        timers[event.itemName].reschedule(DateTime.now().plusSeconds(timeoutSeconds))
