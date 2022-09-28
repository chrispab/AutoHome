# from core.rules import rule
# from core.triggers import when
# from core.actions import LogAction

# @rule("If any heaters demand, turn Boiler ON else OFF", description="If heater demand turn on Boiler else off", tags=["boiler"])
# @when("Member of gRoomHeaterStates received update") #update if ANY heater demand updated - v often
# def boiler_control(event):

#     if items["gAnyRoomHeaterOn"] == ON:
#         # get list of ON heatees
#         listOfMembers = [item for item in ir.getItem("gRoomHeaterStates").members if item.state == ON]
#         LogAction.logDebug("boiler control", "::: LIST OF HEATERS ON :::")
#         for item in listOfMembers:
#             LogAction.logDebug("boiler control", ":::Heater Item: {}, is : {}", item.name, item.state)


#         LogAction.logDebug("Boiler_Control rule", ":::-> at least 1 heater on -> Send boiler ON command")
#         events.sendCommand("Boiler_Control", "ON")

#     else:  # no rooms want heat so turn off boiler
#         LogAction.logDebug("Boiler_Control rule", "::: -> All heaters are off -> Send boiler OFF command")
#         events.sendCommand("Boiler_Control", "OFF")
