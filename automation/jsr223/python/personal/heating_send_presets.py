from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime

offTemp = 13

#!cron job has requested we send updates to setpoints


@rule("React on message to send target temperatures to zone setpoints", description="React on message to send target temperatures to zone setpoints", tags=["Heating"])
@when("Item Heating_UpdateHeaters received command ON")
def send_heating_presets(event):
    LogAction.logError("monitor_heating_mode", "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZsend_hea   ting_presets{}", event.itemName)
    global offTemp

    events.postUpdate("Heating_UpdateHeaters", "OFF")  # rest update heaters flag ready for next trigger (OFF-ON)
    LogAction.logError("monitor_heating_mode", "MASTER Heating Mode: {}", ir.getItem("masterHeatingMode").state)

    if ir.getItem("masterHeatingMode").state.toString() == "auto":  # normal mode is under master control and folows 'normal' rules
        LogAction.logError("monitor_heating_mode", "processing case off MASTER Heating Mode: : {}", ir.getItem("masterHeatingMode").state)

        # prefix eg FR_, CT_ etc    
        for heatingModeItem in ir.getItem("gHeatingModes").members:
            if ir.getItem(heatingModeItem.name).state.toString() == "auto":
                heaterPrefix = heatingModeItem.name[0:heatingModeItem.name.rfind('_')+1]
                ir.getItem(heaterPrefix+"TemperatureSetpoint").state = ir.getItem(heaterPrefix+"Heating_PresetTempNormal").state
                LogAction.logError("monitor_heating_mode", "TemperatureSetpoint prefix:{}", heaterPrefix)

    elif ir.getItem("masterHeatingMode").state.toString() == "off":
        LogAction.logError("monitor_heating_mode", "processing case manual MASTER Heating Mode: :{}", ir.getItem("masterHeatingMode").state)

        for item in ir.getItem("gHeatingModes").members:
            events.postUpdate(item, "off")
        for item in ir.getItem("gTemperatureSetpoints").members:
            events.postUpdate(item, "offTemp")

    elif ir.getItem("masterHeatingMode").state == "manual":
        LogAction.logError("monitor_heating_mode", "processing case manual MASTER Heating Mode: :{}", ir.getItem("masterHeatingMode").state)

    else:
        LogAction.logError("monitor_heating_mode", "Heating Mode unknown:{}", ir.getItem("masterHeatingMode").state)
