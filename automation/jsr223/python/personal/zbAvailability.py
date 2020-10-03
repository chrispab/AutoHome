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
    zbAvail.log.warn("== zb   ..ccgTHSensorTemperatures     Avail::")
    LogAction.logError("gTHSensorTemperatures", "== >>>>>>>>>>>>>>>>>>>>>>>gTHSensorTemperatures  Item {} received  update: {}", event.itemName, event.itemState)
    # events.postUpdate("ZbRouter_01_Reachable","Online")
    #log.debug("Battery charging monitor: {}: start".format(event.itemState))

    # global zbRouterTimer
    # if zbRouterTimer is not None and not zbRouterTimer.hasTerminated():
    #     zbRouterTimer.cancel()
    # zbRouterTimer = ScriptExecution.createTimer(DateTime.now().plusSeconds(routerTimeout), lambda: events.postUpdate("ZbRouter_01_Reachable","Offline"))
    # zbRouterAvail.log.warn("==== zbRouterAvail timer started!!!!!!!!!!!::")
# rule "monitor ZB Zb_THSensor_01 availability"
# when
#     Item Zb_THSensor_01_temperature received update
# then
    LogAction.logError("gTHSensorTemperatures", "?????ZgTHSensorTemperatures  TRYING to mark as ONLINE???????")

#    var boolean gotLock = THSensor_01_Lock.tryLock() // get the lock if we can, but as quick as we can
#    if (gotLock) {   // if we did get the lock
#         logInfo("monitor Zb_THSensor_01", "Zb_THSensor_01 mqtt received - mark as ONLINE")

        # Zb_THSensor_01_reachable.postUpdate("Online")
    # events.postUpdate(event.itemName.rfind('_')),"Online") #use reachable not triggering event cos its temp
    # name = 
    newname = event.itemName[:event.itemName.rfind('_')+1] + "reachable"
    events.postUpdate(newname,"Online") #use reachable not triggering event cos its temp

    zbAvail.log.error("== item marked  ONLINE::")

    if event.itemName not in timers or timers[event.itemName].hasTerminated():
        timers[event.itemName] = ScriptExecution.createTimer(DateTime.now().plusMinutes(timeoutMinutes), lambda: events.postUpdate(newname, "Offline"))
    else:
        timers[event.itemName].reschedule(DateTime.now().plusMinutes(timeoutMinutes))


    # if zbRouterTimer is not None and not zbRouterTimer.hasTerminated():
    #     zbRouterTimer.cancel()

#         Zb_THSensor_01_Timer?.cancel    //if timer is active, cancel it

#         logInfo("monitor Zb_THSensor_01", "Zb_THSensor_01 Starting a new Timer")
#         Zb_THSensor_01_Timer = createTimer(now.plusSeconds(Zb_TempSensor_Timeout), [| 
#             Zb_THSensor_01_reachable.postUpdate("Offline")//execute if timer not cancelled - set as "Offline"
#             logInfo("monitor ZB Zb_THSensor_01", "Zb_THSensor_01 timed out - mark as OFFLINE")
#             Zb_THSensor_01_Timer = null
#         ])
#         THSensor_01_Lock.unlock()  // MUST release the lock
#    }
# end
