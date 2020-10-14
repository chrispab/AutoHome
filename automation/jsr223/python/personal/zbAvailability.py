from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime

# zbRouterTimer = None
# routerTimeout = 61
# https://community.openhab.org/t/design-pattern-motion-sensor-timer/14954
timers = {}
timeoutMinutes = 50 # use an appropriate value

@rule("monitor ZB  temp sensor availability", description="monitor ZB  availability", tags=["zigbee"])
@when("Member of gTHSensorTemperatures received update")
def zbAvail(event):
    # zbAvail.log.info("zbzb ccgTHSensorTemperatures     Avail::")
    LogAction.logInfo("gTHSensorTemperatures", "== gTHSensorTemperatures  Item {} received  update: {}", event.itemName, event.itemState)

    # LogAction.logError("gTHSensorTemperatures", "?????ZgTHSensorTemperatures  TRYING to mark as ONLINE???????")


    newname = event.itemName[:event.itemName.rfind('_')+1] + "reachable"
    events.postUpdate(newname,"Online") #use reachable not triggering event cos its temp

    zbAvail.log.info("== item marked  ONLINE::")

    if event.itemName not in timers or timers[event.itemName].hasTerminated():
        timers[event.itemName] = ScriptExecution.createTimer(DateTime.now().plusMinutes(timeoutMinutes), lambda: events.postUpdate(newname, "Offline"))
    else:
        timers[event.itemName].reschedule(DateTime.now().plusMinutes(timeoutMinutes))

