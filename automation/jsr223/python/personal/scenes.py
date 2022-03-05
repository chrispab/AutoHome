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
    LogAction.logError("Scene_Goodnight", "goodnight going to bed")
    global tgoodnight
    global CT_HPSP_Night

    events.sendCommand("CT_FairyLights433Socket", "OFF")
    events.sendCommand("ZbColourBulb01Switch", "OFF")
    events.sendCommand("ZbColourBulb02Switch", "OFF")

    events.sendCommand("radio", "OFF")
    events.sendCommand("vCT_TVKodiSpeakers", "OFF")
    events.postUpdate("CT_Heating_PresetTempNormal", items["CT_HPSP_Night"].toString())
    # events.sendCommand("CT_Heating_PresetTempNormal", items["CT_HPSP_Night"].toString())
    events.postUpdate("FR_Heating_PresetTempNormal", items["FR_HPSP_Night"].toString())
    events.postUpdate("ER_Heating_PresetTempNormal", items["ER_HPSP_Night"].toString())
    events.postUpdate("AT_Heating_PresetTempNormal", items["AT_HPSP_Night"].toString())
    events.postUpdate("BR_Heating_PresetTempNormal", items["BR_HPSP_Night"].toString())
    events.postUpdate("OF_Heating_PresetTempNormal", items["OF_HPSP_Night"].toString())
    events.postUpdate("HL_Heating_PresetTempNormal", items["HL_HPSP_Night"].toString())
    events.sendCommand("Heating_UpdateHeaters", "OFF")
    events.sendCommand("Heating_UpdateHeaters", "ON")
    events.postUpdate("Scene_Goodnight", "OFF")
    events.sendCommand("workLightsPowerSocket", "OFF")
    events.sendCommand("workLightsPowerSocket", "OFF")
    # events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc

    tgoodnight = ScriptExecution.createTimer(DateTime.now().plusSeconds(300), lambda: events.sendCommand("ZbWhiteBulb01Switch", "OFF"))
