# from core.rules import rule
# from core.triggers import when
# from core.actions import LogAction
# from core.actions import ScriptExecution
# from java.time import ZonedDateTime as DateTime

# offTemp = 14

# #!cron job has requested we send updates to setpoints


# @rule("React on message to send target temperatures to zone setpoints", description="React on message to send target temperatures to zone setpoints", tags=["Heating"])
# @when("Item Heating_UpdateHeaters received command ON")
# def send_heating_presets(event):
#     LogAction.logError("monitor_heating_mode", "React on message to send target temperatures to zone setpoints: {}", event.itemName)
#     global offTemp

#     events.postUpdate("Heating_UpdateHeaters", "OFF")  #! reset update heaters flag ready for next trigger (OFF-ON)
#     LogAction.logError("monitor_heating_mode", "MASTER Heating Mode: {}", ir.getItem("masterHeatingMode").state)


#     # ! Whats the current MASTER heating mode?
#     if ir.getItem("masterHeatingMode").state.toString() == "auto":  # normal mode is under master control and folows 'normal' rules
#         LogAction.logError("monitor_heating_mode", "PPPPPPPPPPPP processing case AUTO MASTER Heating Mode: : {}", ir.getItem("masterHeatingMode").state.toString())

#         # prefix eg FR_, CT_ etc
#         for heatingModeItem in ir.getItem("gHeatingModes").members:
#             if ir.getItem(heatingModeItem.name).state.toString() == "auto":
#                 roomPrefix = heatingModeItem.name[0:heatingModeItem.name.rfind('_')+1]
#                 ir.getItem(roomPrefix+"TemperatureSetpoint").state = ir.getItem(roomPrefix+"Heating_PresetTempNormal").state
#                 # LogAction.logError("monitor_heating_mode", "TemperatureSetpoint prefix:{}", roomPrefix)

#     elif ir.getItem("masterHeatingMode").state.toString() == "off":
#         LogAction.logError("monitor_heating_mode", "PPPPPPPPPP    processing case OFF MASTER Heating Mode: :{}", ir.getItem("masterHeatingMode").state.toString())

#         for item in ir.getItem("gHeatingModes").members:
#             events.postUpdate(item, "off")
#         for item in ir.getItem("gTemperatureSetpoints").members:
#             events.postUpdate(item, offTemp)

#     elif ir.getItem("masterHeatingMode").state == "manual":
#         LogAction.logError("monitor_heating_mode", "PPPPPPPPP processing case MANUAL MASTER Heating Mode: :{}", ir.getItem("masterHeatingMode").state.toString())

#     else:
#         LogAction.logError("monitor_heating_mode", "Heating Mode unknown:{}", ir.getItem("masterHeatingMode").state.toString())
