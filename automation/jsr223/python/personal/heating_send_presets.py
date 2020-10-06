from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime

offTemp=13

# rule "React on message to send target temperatures to zone setpoints"
# when
#     Item Heating_UpdateHeaters received command ON //cron job has requested we send updates to setpoints
# then
#!cron job has requested we send updates to setpoints
@rule("React on message to send target temperatures to zone setpoints", description="React on message to send target temperatures to zone setpoints", tags=["Heating"])
@when("Item Heating_UpdateHeaters received command ON")
def send_heating_presets(event):
    LogAction.logError("monitor_heating_mode","ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZsend_hea   ting_presets{}", event.itemName)
    global offTemp

#     Heating_UpdateHeaters.postUpdate(OFF) // rest update heaters flag ready for next trigger (OFF-ON)
    events.postUpdate("Heating_UpdateHeaters", "OFF")
#     logInfo("heatingNormal.rules", "MASTER Heating Mode: " + masterHeatingMode.state)
    LogAction.logError("monitor_heating_mode","MASTER Heating Mode: {}", ir.getItem("masterHeatingMode").state)

#     switch masterHeatingMode.state {
#         case "auto": { //normal mode is under master control and folows 'normal' rules
#             logInfo("heatingNormal.rules", "processing case MASTER Heating Mode : " + masterHeatingMode.state)
#             if(CT_HeatingMode.state == "auto") { //if mode is master control - 'normal' - auto - 2
#                 CT_TemperatureSetpoint.state = (CT_Heating_PresetTempNormal.state )
#             }
    if ir.getItem("masterHeatingMode").state.toString() == "auto": #normal mode is under master control and folows 'normal' rules
        LogAction.logError("monitor_heating_mode","processing case off MASTER Heating Mode: : {}", ir.getItem("masterHeatingMode").state)
        if ir.getItem("CT_HeatingMode").state.toString() == "auto":
            ir.getItem("CT_TemperatureSetpoint").state = ir.getItem("CT_Heating_PresetTempNormal").state

#             if(FR_HeatingMode.state == "auto") { //if zone mode is master control
#                    FR_TemperatureSetpoint.state = (FR_Heating_PresetTempNormal.state)
#             }
        if ir.getItem("FR_HeatingMode").state.toString() == "auto":
            ir.getItem("FR_TemperatureSetpoint").state = ir.getItem("FR_Heating_PresetTempNormal").state

#             if(HL_HeatingMode.state == "auto") { //if mode is master control
#                 HL_TemperatureSetpoint.state = (HL_Heating_PresetTempNormal.state)
#             }            
        if ir.getItem("HL_HeatingMode").state.toString() == "auto":
            ir.getItem("HL_TemperatureSetpoint").state = ir.getItem("HL_Heating_PresetTempNormal").state

#             if(OF_HeatingMode.state == "auto") { //if mode is master control
#                 OF_TemperatureSetpoint.state = (OF_Heating_PresetTempNormal.state)
#             }
        if ir.getItem("OF_HeatingMode").state.toString() == "auto":
            ir.getItem("OF_TemperatureSetpoint").state = ir.getItem("OF_Heating_PresetTempNormal").state

#             if(BR_HeatingMode.state == "auto") { //if mode is master control
#                 BR_TemperatureSetpoint.state = (BR_Heating_PresetTempNormal.state)
#             }
        if ir.getItem("BR_HeatingMode").state.toString() == "auto":
            ir.getItem("BR_TemperatureSetpoint").state = ir.getItem("BR_Heating_PresetTempNormal").state

#             if(ER_HeatingMode.state == "auto") { //if mode is master control
#                 ER_TemperatureSetpoint.state = (ER_Heating_PresetTempNormal.state)
#             }
        if ir.getItem("ER_HeatingMode").state.toString() == "auto":
            ir.getItem("ER_TemperatureSetpoint").state = ir.getItem("ER_Heating_PresetTempNormal").state

#             if(AT_HeatingMode.state == "auto") { //if mode is master control
#                 AT_TemperatureSetpoint.state = (AT_Heating_PresetTempNormal.state)
#             }
        if ir.getItem("AT_HeatingMode").state.toString() == "auto":
            ir.getItem("AT_TemperatureSetpoint").state = ir.getItem("AT_Heating_PresetTempNormal").state
#         
#         case "off": {
    elif ir.getItem("masterHeatingMode").state.toString() == "off":
#             logInfo("heatingNormal.rules", "processing case off MASTER Heating Mode: " + masterHeatingMode.state)
        LogAction.logError("monitor_heating_mode","processing case manual MASTER Heating Mode: :{}", ir.getItem("masterHeatingMode").state)

#             gHeatingModes.members.forEach[ String RoomHeatingMode | RoomHeatingMode.postUpdate("off") ] 
#             gTemperatureSetpoints.members.forEach[ TSetpoint | TSetpoint.postUpdate(offTemp) ] 
        for item in ir.getItem("gHeatingModes").members:
            events.postUpdate(item, "off")
        for item in ir.getItem("gTemperatureSetpoints").members:
            events.postUpdate(item, "offTemp")
#         }


#         case "manual": {
    elif ir.getItem("masterHeatingMode").state == "manual":
    
#             logInfo("heatingNormal.rules", "processing case manual MASTER Heating Mode: " + masterHeatingMode.state)
#         }
        LogAction.logError("monitor_heating_mode","processing case manual MASTER Heating Mode: :{}", ir.getItem("masterHeatingMode").state)

#         default : { logError("heatingNormal.rules", "Heating Mode unknown: " + masterHeatingMode.state) }
    else:
        LogAction.logError("monitor_heating_mode","Heating Mode unknown:{}", ir.getItem("masterHeatingMode").state)
       
#     }
# end
