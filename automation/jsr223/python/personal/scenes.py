from core.actions import ScriptExecution
from core.rules import rule
from core.triggers import when
from core.actions import LogAction
import org.joda.time.DateTime as DateTime

# rule "StartUp - set up Item Scene_Goodnight"
# when
#     System started
# then
#     Scene_Goodnight.postUpdate(OFF)
# end
# //FrontRoom Pi Kodi and TV on/off control
tsceneStartup = None

@rule("StartUp - set up Item Scene_Goodnight", description="StartUp - set up Item Scene_Goodnight", tags=["Scene"])
@when("System started")
def scene_Goodnight_init(event):
    LogAction.logInfo("StartUp - set up Item Scene_Goodnight","StartUp - set up Item Scene_Goodnight")
    # events.postUpdate("BridgeLightSensorState", "OFF")
    global tsceneStartup
    if tsceneStartup is None:
        tsceneStartup = ScriptExecution.createTimer(DateTime.now().plusSeconds(45), lambda: events.postUpdate("Scene_Goodnight", "OFF"))



# rule "Goodnight Going to bed"
# when
# 	Item Scene_Goodnight changed from OFF to ON
# then
tgoodnight=None
@rule("Goodnight Going to bed", description="Goodnight Going to bed", tags=["scene"])
@when("Item Scene_Goodnight changed from OFF to ON")
def Scene_Goodnight(event):
    # Scene_Goodnight.log.info("::Boiler_Control rule -> A Heater recieved a command - updating boiler state::")
    LogAction.logInfo("Scene_Goodnight", "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\goodnight going to bed")
    global tgoodnight

#     logInfo("RULE", "goodnight going to bed")
#     {sendCommand(CT_FairyLights433Socket, OFF)} //con lights
#     {postUpdate(CT_FairyLights433Socket, OFF)}
#     ZbColourBulb01Switch.sendCommand(OFF)
    events.sendCommand("CT_FairyLights433Socket", "OFF")
    events.postUpdate("CT_FairyLights433Socket", "OFF")
    events.sendCommand("ZbColourBulb01Switch", "OFF")


#     {sendCommand(radio, OFF)} //radio
#     {postUpdate(radio, OFF)}
#     vCT_TVKodiSpeakers.sendCommand(OFF)
    events.sendCommand("radio", "OFF")
    events.postUpdate("radio", "OFF")
    events.sendCommand("vCT_TVKodiSpeakers", "OFF")

#     gZbAllBulbs.sendCommand(OFF)
#     gZbAllBulbs.postUpdate(OFF)
    # events.sendCommand("gZbAllBulbs", "OFF")
    # events.postUpdate("gZbAllBulbs", "OFF")

#     //set rads temps to off
#     CT_Heating_PresetTempNormal.postUpdate(17.0)
    events.postUpdate("CT_Heating_PresetTempNormal", "17.0")

#     FR_Heating_PresetTempNormal.postUpdate(14.0)
    events.postUpdate("FR_Heating_PresetTempNormal", "14.0")

#     ER_Heating_PresetTempNormal.postUpdate(17.0)
    events.postUpdate("ER_Heating_PresetTempNormal", "17.0")

#     AT_Heating_PresetTempNormal.postUpdate(14.0)
    events.postUpdate("AT_Heating_PresetTempNormal", "14.0")

#     BR_Heating_PresetTempNormal.postUpdate(17.0)
    events.postUpdate("BR_Heating_PresetTempNormal", "17.0")

#     OF_Heating_PresetTempNormal.postUpdate(17.0)
    events.postUpdate("OF_Heating_PresetTempNormal", "17.0")

#     HL_Heating_PresetTempNormal.postUpdate(17.0)
    events.postUpdate("HL_Heating_PresetTempNormal", "17.0")

#     Heating_UpdateHeaters.sendCommand(ON)
    events.sendCommand("Heating_UpdateHeaters", "ON")
    
#     logInfo("RULE", "Item Scene_Goodnight received command ON")

#     createTimer(now.plusSeconds(240), [|
#         {sendCommand(DR_FairyLights433Socket, OFF)} // d room lights
#         {postUpdate(DR_FairyLights433Socket, OFF)}
#         logInfo("RULE", "Item Scene_Goodnight now set to OFF again")
#     ])
    tgoodnight = ScriptExecution.createTimer(DateTime.now().plusSeconds(240), lambda: events.sendCommand("DR_FairyLights433Socket", "OFF"))

#     Scene_Goodnight.postUpdate(OFF)
    events.postUpdate("Scene_Goodnight", "OFF")