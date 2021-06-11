from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from java.time import ZonedDateTime as DateTime

# offTemp = 13.2


@rule("handle MasterHeatingMode updated", description="handle MasterHeatingMode updated", tags=["Heating"])
@when("Item masterHeatingMode received update")
def monitor_master_heating_mode(event):
    LogAction.logError("monitoR", "handle MasterHeatingMode updated {}", ir.getItem("masterHeatingMode").state.toString())

    global offTemp
    if ir.getItem("masterHeatingMode").state.toString() == "auto":
        LogAction.logError("monitor_heating_mode", "HMH .. make all rooms - AUTO - MASTER Heating Mode : {}", ir.getItem("masterHeatingMode").state.toString())
        for item in ir.getItem("gHeatingModes").members:
            events.postUpdate(item, "auto")

    elif ir.getItem("masterHeatingMode").state.toString() == "off":
        LogAction.logError("monitor_heating_mode","HMH .. processing case OFF MASTER Heating Mode: : {}", ir.getItem("masterHeatingMode").state.toString())
        for item in ir.getItem("gHeatingModes").members:
            events.postUpdate(item, "off")
        # for item in ir.getItem("gTemperatureSetpoints").members:
        #     events.postUpdate(item, offTemp)

    elif ir.getItem("masterHeatingMode").state.toString() == "manual":
        LogAction.logError("monitor_heating_mode", "HMH .. processing case MANUAL MASTER Heating Mode: : {}", ir.getItem("masterHeatingMode").state.toString())
        for item in ir.getItem("gHeatingModes").members:
            events.postUpdate(item, "manual")

    else:
        LogAction.logError("monitor_heating_mode", "HMH .. Heating Mode unknown:  {}", ir.getItem("masterHeatingMode").state.toString())

    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc
