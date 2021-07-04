from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from java.time import ZonedDateTime as DateTime

# https://community.openhab.org/t/design-pattern-motion-sensor-timer/14954
timers = {}
timeoutMinutes = 45  # use an appropriate value


@rule("zb temp sensors init", description="zb temp sensors init", tags=["heating"])
@when("System started")
def zb_sensor_init(event):
    zb_sensor_init.log.info("zb_sensor_init")
    for item in ir.getItem("gZbTHSensorsReachable").members:
        events.postUpdate(item, "offline")

    events.postUpdate(ir.getItem("ZbRouter_01_Reachable"), "offline")



@rule("monitor ZB  temp sensor availability", description="monitor ZB  availability", tags=["zigbee"])
@when("Member of gTHSensorTemperatures received update")
def zbAvail(event):
    LogAction.logInfo("gTHSensorTemperatures", "== gTHSensorTemperatures  Item {} received  update: {}", event.itemName, event.itemState)
    newname = event.itemName[:event.itemName.rfind('_')+1] + "reachable"
    events.postUpdate(newname, "Online")  # use reachable not triggering event cos its temp
    zbAvail.log.info("== ZB  temp sensor availability marked  ONLINE::")

    if event.itemName not in timers or timers[event.itemName].hasTerminated():
        timers[event.itemName] = ScriptExecution.createTimer(DateTime.now().plusMinutes(timeoutMinutes), lambda: events.postUpdate(newname, "Offline"))
    else:
        timers[event.itemName].reschedule(DateTime.now().plusMinutes(timeoutMinutes))
