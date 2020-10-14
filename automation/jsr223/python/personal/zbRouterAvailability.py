from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime

zbRouterTimer = None
routerTimeout = 61

@rule("monitor ZB Router availability", description="monitor ZB Router availability", tags=["zigbee"])
@when("Item ZbRouter_01_Quality received update")
def zbRouterAvail(event):
    zbRouterAvail.log.info("== zbRouterAvail::")
    LogAction.logInfo("zbRouterAvail", "==xxxccc Item {} received update: {}", event.itemName, event.itemState)
    events.postUpdate("ZbRouter_01_Reachable","Online")
    #log.debug("Battery charging monitor: {}: start".format(event.itemState))
    global zbRouterTimer
    if zbRouterTimer is not None and not zbRouterTimer.hasTerminated():
        zbRouterTimer.cancel()
    zbRouterTimer = ScriptExecution.createTimer(DateTime.now().plusSeconds(routerTimeout), lambda: events.postUpdate("ZbRouter_01_Reachable","Offline"))
    zbRouterAvail.log.info("==== zbRouterAvail timer started!!!!!!!!!!!::")

