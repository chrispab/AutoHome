from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from java.time import ZonedDateTime as DateTime


@rule("System started - INIT all KODI PROXY ITEMS", description="System started - INIT all KODI PROXY ITEMS", tags=["kodi"])
@when("System started")
def kodi_startup(event):
    LogAction.logError("System started - INIT all KODI PROXY ITEMS", "System started - INIT all KODI PROXY ITEMS")

    if ir.getItem("shutdownKodiFrontRoomProxy").state == NULL:
        events.postUpdate(ir.getItem("shutdownKodiFrontRoomProxy"), "OFF")
        LogAction.logError("INIT KODI PROXY", "System started rule - change front room KodiPi proxy from NULL to OFF")

    if ir.getItem("shutdownKodiConservatoryProxy").state == NULL:
        events.postUpdate(ir.getItem("shutdownKodiConservatoryProxy"), "OFF")
        LogAction.logError("INIT KODI PROXY", "System started rule - change Conservatory KodiPi proxy from NULL to OFF")

    if ir.getItem("shutdownKodiBedroomProxy").state == NULL:
        events.postUpdate(ir.getItem("shutdownKodiBedroomProxy"), "OFF")
        LogAction.logError("INIT KODI PROXY", "System started rule - change Bed room KodiPi proxy from NULL to OFF")

    if ir.getItem("shutdownKodiAtticProxy").state == NULL:
        events.postUpdate(ir.getItem("shutdownKodiAtticProxy"), "OFF")
        LogAction.logError("INIT KODI PROXY", "System started rule - change attic KodiPi proxy from NULL to OFF")# end




@rule("Pause FrontRoom Kodi", description="Pause FrontRoom Kodi", tags=["Kodi"])
@when("Item pauseKodiFrontRoomProxy received update")
def kodi_pause_FR(event):
    LogAction.logError("Pause FrontRoom Kodi","Pause FrontRoom Kodi: {}", event.itemName)
    events.sendCommand("kodiFrontRoom_control","PAUSE")        

@rule("Shutdown FrontRoom Kodi Pi Host", description="Shutdown FrontRoom Kodi Pi Host", tags=["Kodi"])
@when("Item shutdownKodiFrontRoomProxy changed from ON to OFF")
def kodi_shutdown_FR(event):
    LogAction.logError("Shutdown FrontRoom Kodi","Shutdown FrontRoom Kodi: {}", event.itemName)
    events.sendCommand("kodiFrontRoom_systemcommand","Shutdown") 



@rule("Shutdown Conservatory Kodi Pi Host", description="Shutdown Conservatory Kodi Pi Host", tags=["Kodi"])
@when("Item shutdownKodiConservatoryProxy changed from ON to OFF")
def kodi_shutdown_CT(event):
    LogAction.logError("Shutdown Conservatory Kodi","Shutdown Conservatory Kodi: {}", event.itemName)
    events.sendCommand("kodiConservatory_systemcommand","Shutdown") 


@rule("Shutdown bedroom Kodi Pi Host", description="Shutdown bedroom Kodi Pi Host", tags=["Kodi"])
@when("Item shutdownKodiBedroomProxy changed from ON to OFF")
def kodi_shutdown_BR(event):
    LogAction.logError("Shutdown bedroom Kodi","Shutdown bedroom Kodi: {}", event.itemName)
    events.sendCommand("kodiBedroom_systemcommand","Shutdown")


@rule("Shutdown Attic Kodi Pi Host", description="Shutdown Attic Kodi Pi Host", tags=["Kodi"])
@when("Item shutdownKodiAtticProxy changed from ON to OFF")
def kodi_shutdown_AT(event):
    LogAction.logError("Shutdown Attic Kodi","Shutdown Attic Kodi: {}", event.itemName)
    events.sendCommand("kodiAttic_systemcommand","Shutdown")