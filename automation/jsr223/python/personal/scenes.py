from core.actions import ScriptExecution
from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from java.time import ZonedDateTime as DateTime


tsceneStartup = None


@rule("StartUp - set up Item Scene_Goodnight", description="StartUp - set up Item Scene_Goodnight", tags=["Scene"])
@when("System started")
def scene_Goodnight_init(event):
    LogAction.logInfo("StartUp - set up Item Scene_Goodnight", "StartUp - set up Item Scene_Goodnight")
    # events.postUpdate("BridgeLightSensorState", "OFF")
    global tsceneStartup
    if tsceneStartup is None:
        tsceneStartup = ScriptExecution.createTimer(DateTime.now().plusSeconds(45), lambda: events.postUpdate("Scene_Goodnight", "OFF"))


tgoodnight = None


@rule("Goodnight Going to bed", description="Goodnight Going to bed", tags=["scene"])
@when("Item Scene_Goodnight changed from OFF to ON")
def Scene_Goodnight(event):
    # Scene_Goodnight.log.info("::Boiler_Control rule -> A Heater recieved a command - updating boiler state::")
    LogAction.logInfo("Scene_Goodnight", "goodnight going to bed")
    global tgoodnight

    events.sendCommand("CT_FairyLights433Socket", "OFF")
    events.sendCommand("ZbColourBulb01Switch", "OFF")
    events.sendCommand("ZbColourBulb02Switch", "OFF")

    events.sendCommand("radio", "OFF")
    events.sendCommand("vCT_TVKodiSpeakers", "OFF")
    events.postUpdate("CT_Heating_PresetTempNormal", CT_HPSP_Night)
    events.postUpdate("FR_Heating_PresetTempNormal", FR_HPSP_Night)
    events.postUpdate("ER_Heating_PresetTempNormal", ER_HPSP_Night)
    events.postUpdate("AT_Heating_PresetTempNormal", AT_HPSP_Evening)
    events.postUpdate("BR_Heating_PresetTempNormal", BR_HPSP_Night)
    events.postUpdate("OF_Heating_PresetTempNormal", OF_HPSP_Night)
    events.postUpdate("HL_Heating_PresetTempNormal", HL_HPSP_Night)
    events.sendCommand("Heating_UpdateHeaters", "ON")
    events.postUpdate("Scene_Goodnight", "OFF")
    events.sendCommand("workLightsPowerSocket", "OFF")
    # events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc

    tgoodnight = ScriptExecution.createTimer(DateTime.now().plusSeconds(300), lambda: events.sendCommand("ZbWhiteBulb01Switch", "OFF"))
