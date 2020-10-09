from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime

offTemp = 13.2


@rule("handle MasterHeatingMode updated", description="handle MasterHeatingMode updated", tags=["Heating"])
@when("Item masterHeatingMode received update")
def monitor_master_heating_mode(event):
    LogAction.logError("monito", "---v-----------b---------cc------c----------------monitor_heating_mode {}", event.itemName)

    global offTemp
    if ir.getItem("masterHeatingMode").state.toString() == "auto":
        LogAction.logError("monitor_heating_mode", "make all rooms -AUTO - MASTER Heating Mode : {}", event.itemName)
        for item in ir.getItem("gHeatingModes").members:
            events.postUpdate(item, "auto")

    elif ir.getItem("masterHeatingMode").state.toString() == "off":
        LogAction.logError("monitor_heating_mode","processing case off MASTER Heating Mode: : {}", event.itemName)
        for item in ir.getItem("gHeatingModes").members:
            events.postUpdate(item, "off")
        # for item in ir.getItem("gTemperatureSetpoints").members:
        #     events.postUpdate(item, offTemp)

    elif ir.getItem("masterHeatingMode").state.toString() == "manual":
        LogAction.logError("monitor_heating_mode", "processing case off MASTER Heating Mode: : {}", event.itemName)
        for item in ir.getItem("gHeatingModes").members:
            events.postUpdate(item, "manual")

    else:
        LogAction.logError("monitor_heating_mode", "Heating Mode unknown:  {}", event.itemName)
