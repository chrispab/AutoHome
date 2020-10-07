from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime


# rule "System started - INIT all KODI PROXY ITEMS"
# when
#     System started
# then
@rule("System started - INIT all KODI PROXY ITEMS", description="System started - INIT all KODI PROXY ITEMS", tags=["kodi"])
@when("System started")
def kodi_startup(event):
    LogAction.logError("System started - INIT all KODI PROXY ITEMS", "System started - INIT all KODI PROXY ITEMS")

#     if(timerStart === null) {
#         timerStart = createTimer(now.plusSeconds(5)) [|
#         logInfo("Kodi.rules", "System started rule for ALL rooms -  KODI PROXY virtual Items")
#         if (shutdownKodiFrontRoomProxy.state === NULL) {
#             shutdownKodiFrontRoomProxy.postUpdate(ON) // set power up val
#             logInfo("Kodi.rules", "System started rule - change front room KodiPi proxy from NULL to OFF")
#         }
    if ir.getItem("shutdownKodiFrontRoomProxy").state == NULL:
        events.postUpdate(ir.getItem("shutdownKodiFrontRoomProxy"), "OFF")
        LogAction.logError("INIT KODI PROXY", "System started rule - change front room KodiPi proxy from NULL to OFF")

#         if (shutdownKodiConservatoryProxy.state === NULL) {
#             shutdownKodiConservatoryProxy.postUpdate(ON) // set power up val
#             logInfo("Kodi.rules", "System started rule - change Conservatory KodiPi proxy from NULL to OFF")
#         }
    if ir.getItem("shutdownKodiConservatoryProxy").state == NULL:
        events.postUpdate(ir.getItem("shutdownKodiConservatoryProxy"), "OFF")
        LogAction.logError("INIT KODI PROXY", "System started rule - change Conservatory KodiPi proxy from NULL to OFF")


#         if (shutdownKodiBedroomProxy.state === NULL) {
#             shutdownKodiBedroomProxy.postUpdate(ON) // set power up val
#             logInfo("Kodi.rules", "System started rule - change Bed room KodiPi proxy from NULL to OFF")
#         }
    if ir.getItem("shutdownKodiBedroomProxy").state == NULL:
        events.postUpdate(ir.getItem("shutdownKodiBedroomProxy"), "OFF")
        LogAction.logError("INIT KODI PROXY", "System started rule - change Bed room KodiPi proxy from NULL to OFF")
#         timerStart = null]
#     }
# end


# //Kodi front room
# rule "Pause FrontRoom Kodi"
# when
#      Item pauseKodiFrontRoomProxy received update
# then
#     kodiFrontRoom_control.sendCommand(PAUSE)
# end
@rule("Pause FrontRoom Kodi", description="Pause FrontRoom Kodi", tags=["Kodi"])
@when("Item pauseKodiFrontRoomProxy received update")
def kodi_pause_FR(event):
    LogAction.logError("Pause FrontRoom Kodi","Pause FrontRoom Kodi: {}", event.itemName)
    events.sendCommand("kodiFrontRoom_control","PAUSE")        


# rule "Shutdown FrontRoom Kodi Pi Host"
# when
#      Item shutdownKodiFrontRoomProxy changed from ON to OFF
# then
#     kodiFrontRoom_systemcommand.sendCommand("Shutdown")
# end
@rule("Shutdown FrontRoom Kodi Pi Host", description="Shutdown FrontRoom Kodi Pi Host", tags=["Kodi"])
@when("Item shutdownKodiFrontRoomProxy changed from ON to OFF")
def kodi_shutdown_FR(event):
    LogAction.logError("Shutdown FrontRoom Kodi","Shutdown FrontRoom Kodi: {}", event.itemName)
    events.sendCommand("kodiFrontRoom_systemcommand","Shutdown") 

# //Kodi conservatory
# rule "Pause Conservatory Kodi"
# when
#      Item pauseKodiConservatoryProxy received update
# then
#     kodiConservatory_control.sendCommand(PAUSE)
# end

# rule "Shutdown Conservatory Kodi Pi Host"
# when
#      Item shutdownKodiConservatoryProxy changed from ON to OFF
# then
#     kodiConservatory_systemcommand.sendCommand("Shutdown")
# end
@rule("Shutdown Conservatory Kodi Pi Host", description="Shutdown Conservatory Kodi Pi Host", tags=["Kodi"])
@when("Item shutdownKodiConservatoryProxy changed from ON to OFF")
def kodi_shutdown_CT(event):
    LogAction.logError("Shutdown Conservatory Kodi","Shutdown Conservatory Kodi: {}", event.itemName)
    events.sendCommand("kodiConservatory_systemcommand","Shutdown") 
# //Kodi Master Bedroom
# rule "Pause Kodi bedroom"
# when
#      Item pauseKodiBerdroomProxy received update
# then
#     kodiBedroom_control.sendCommand(PAUSE)
# end

# rule "Shutdown bedroom Kodi Pi Host"
# when
#      Item shutdownKodiBedroomProxy changed from ON to OFF
# then
#     kodiBedroom_systemcommand.sendCommand("Shutdown")
# end
@rule("Shutdown bedroom Kodi Pi Host", description="Shutdown bedroom Kodi Pi Host", tags=["Kodi"])
@when("Item shutdownKodiBedroomProxy changed from ON to OFF")
def kodi_shutdown_BR(event):
    LogAction.logError("Shutdown bedroom Kodi","Shutdown bedroom Kodi: {}", event.itemName)
    events.sendCommand("kodiBedroom_systemcommand","Shutdown")