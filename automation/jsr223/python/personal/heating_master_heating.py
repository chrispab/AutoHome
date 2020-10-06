from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime
# var Number offTemp = 13

offTemp=13
# rule "handle MasterHeatingMode updated"
# when
#     Item masterHeatingMode received update
# then
@rule("handle MasterHeatingMode updated", description="handle MasterHeatingMode updated", tags=["Heating"])
@when("Item masterHeatingMode received update")
def monitor_master_heating_mode(event):
    LogAction.logError("monito","---v-----------b---------cc------c----------------monitor_heating_mode {}", event.itemName)
#     logInfo("heatingNormal.rules", "MASTER Heating Mode: " + masterHeatingMode.state)
#     switch masterHeatingMode.state {
#         case "auto": { //normal mode is under master control and folows 'normal' rules
#             logInfo("heatingNormal.rules", "make all rooms -AUTO - MASTER Heating Mode : " + masterHeatingMode.state)
#             gHeatingModes.members.forEach[  String HeatingMode | HeatingMode.postUpdate("auto") ] 
    global offTemp
    if ir.getItem("masterHeatingMode").state.toString() == "auto":
        LogAction.logError("monitor_heating_mode","make all rooms -AUTO - MASTER Heating Mode : {}", event.itemName)
        for item in ir.getItem("gHeatingModes").members:
            # do stuff
            events.postUpdate(item,"auto")

#         case "off": {
#             logInfo("heatingNormal.rules", "processing case off MASTER Heating Mode: " + masterHeatingMode.state)
#             gHeatingModes.members.forEach[  String RoomHeatingMode | RoomHeatingMode.postUpdate("off") ] 
#             gTemperatureSetpoints.members.forEach[  TemperatureSetpoint | TemperatureSetpoint.postUpdate(offTemp) ] 
#         }
    elif ir.getItem("masterHeatingMode").state.toString() == "off":
        LogAction.logError("monitor_heating_mode","?????????????????????????????????????????????????????????processing case off MASTER Heating Mode: : {}", event.itemName)
        for item in ir.getItem("gHeatingModes").members:
            events.postUpdate(item,"off")
        for item in ir.getItem("gTemperatureSetpoints").members:
            events.postUpdate(item,offTemp)

#         case "manual": {
#             logInfo("heatingNormal.rules", "processing case manual MASTER Heating Mode: " + masterHeatingMode.state)
#             gHeatingModes.members.forEach[  String RoomHeatingMode | RoomHeatingMode.postUpdate("manual") ] 
#         }
    elif ir.getItem("masterHeatingMode").state.toString() == "manual":
        LogAction.logError("monitor_heating_mode","processing case off MASTER Heating Mode: : {}", event.itemName)
        for item in ir.getItem("gHeatingModes").members:
            events.postUpdate(item, "manual")
            # for item in ir.getItem("gTemperatureSetpoints").members:
            #     item.postUpdate(offTemp)
    else:
        LogAction.logError("monitor_heating_mode","Heating Mode unknown:  {}", event.itemName)

#         default : { logError("heatingNormal.rules", "Heating Mode unknown: " + masterHeatingMode.state) }


