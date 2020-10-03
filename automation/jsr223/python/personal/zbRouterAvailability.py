from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime
# rule "monitor ZB Router availability"
# when
#     Item ZbRouter_01_Quality received update
# then
#    var boolean gotLock = Router_Lock.tryLock() // get the lock if we can, but as quick as we can
#    if (gotLock) {   // if we did get the lock
#     logWarn("monitor ZB Router", "ZB Router received mqtt - mark as ONLINE")
#     ZbRouter_01_Reachable.postUpdate("Online")
#     RouterTimer?.cancel
#     logWarn("monitor ZB Router", "ZB Router Starting a new Timer")
#     RouterTimer = createTimer(now.plusSeconds(routerTimeout), [| 
#         ZbRouter_01_Reachable.postUpdate("Offline")//execute if timer not reset - set as "Offline"
#         logWarn("monitor ZB Router", "ZB Router timed out - mark as OFFLINE")
#         RouterTimer = null
#     ])
#     Router_Lock.unlock()  // MUST release the lock
#    }
# end

zbRouterTimer = None
routerTimeout = 61

@rule("monitor ZB Router availability", description="monitor ZB Router availability", tags=["zigbee"])
@when("Item ZbRouter_01_Quality received update")
def zbRouterAvail(event):
    zbRouterAvail.log.warn("== zbRouterAvail::")
    LogAction.logWarn("zbRouterAvail", "==xxxccc Item {} received update: {}", event.itemName, event.itemState)
    events.postUpdate("ZbRouter_01_Reachable","Online")
    #log.debug("Battery charging monitor: {}: start".format(event.itemState))
    global zbRouterTimer
    if zbRouterTimer is not None and not zbRouterTimer.hasTerminated():
        zbRouterTimer.cancel()
    zbRouterTimer = ScriptExecution.createTimer(DateTime.now().plusSeconds(routerTimeout), lambda: events.postUpdate("ZbRouter_01_Reachable","Offline"))
    zbRouterAvail.log.warn("==== zbRouterAvail timer started!!!!!!!!!!!::")

    # if items["Outlet9"] == ON and event.itemState <= DecimalType(8) and event.oldItemState <= DecimalType(8):
    #     if chargerTimer2 is None or chargerTimer2.hasTerminated():
    #         chargerTimer2 = ScriptExecution.createTimer(DateTime.now().plusMinutes(5), lambda: events.sendCommand("Outlet9","OFF"))
    #         batteryChargingMonitor2.log.info("Battery charging monitor: Started battery charging turn off timer: Outlet9_Power=[{}], oldItemState=[{}]".format(event.itemState, event.oldItemState))
    # elif chargerTimer2 is not None and not chargerTimer2.hasTerminated():
    #     chargerTimer2.cancel()
    #     batteryChargingMonitor2.log.info("Battery charging monitor: Cancelled battery charging turn off timer: Outlet9_Power=[{}], oldItemState=[{}]".format(event.itemState, event.oldItemState))
