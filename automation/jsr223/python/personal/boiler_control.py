from core.rules import rule
from core.triggers import when
from core.actions import LogAction
# rule "check for Boiler Demand changed"
# when
#     Member of gRoomHeaterStates received command
# then
@rule("If heater demand turn on Boiler else off", description="If heater demand turn on Boiler else off", tags=["boiler"])
@when("Member of gRoomHeaterStates received update")
def boiler_control(event):
    boiler_control.log.warn("::Boiler_Control rule -> A Heater recieved a command - updating boiler state::")
    LogAction.logWarn("Boiler_Control", ":::Item {} received update: {}", event.itemName, event.itemState)
#     logInfo("Boiler_Control rule", "-> A Heater recieved a command - updating boiler state")
    LogAction.logInfo("::Boiler_Control rule", "-> name:{}, prev:{}, now:{}", event.itemName, event.itemName , event.itemState)
    boiler_control.log.info("::Boiler_Control -> -> A Heater recieved a command - updating boiler state")
    boiler_control.log.info("::Boiler_Control triggering item: " + event.itemName + ", State: " + event.itemState.toString())
    # boiler_control.log.info("::Boiler_Control triggering item : " + event.itemName )



# display any NUll heater states
#     if ( gRoomHeaterStates.state ==  NULL ) {  // display any NUll heater states
#             gRoomHeaterStates.members.forEach[ Heater | 
#                 logInfo("Boiler_Control rule", "-> Heating state detected with val = " + Heater.name + Heater.state) 
#             ] 
#     }
    if items["gRoomHeaterStates"] == NULL:
        for item in ir.getItem("gTest").members:
               LogAction.logInfo("boiler control", ":::Heater Item: {}, state: {}", item.itemName, item.itemState)
 





#     if ( gAnyRoomHeaterOn.state == ON ) {//if any rooms want heat - turn on boiler
#         gRoomHeaterStates.members.filter[l|l.state == ON].forEach[ Heater | 
#             logInfo("Boiler_Control rule", "-> Heater " + Heater.name + " is " + Heater.state) 
#         ] 
#         logInfo("Boiler_Control rule", "-> at least 1 heater on -> Send boiler ON command" )
#         Boiler_Control.sendCommand(ON)
#     }
    if items["gAnyRoomHeaterOn"] == ON:
        # for item in ir.getItem("gAnyRoomHeaterOn").members:
            #    LogAction.logInfo("boiler control", ":::Heater Item: {}, state: {}", item.itemName, item.itemState)
        LogAction.logInfo("Boiler_Control rule", "::-> at least 1 heater on -> Send boiler ON command" )
        # Boiler_Control.sendCommand(ON)
        events.sendCommand("Boiler_Control", "ON")




#     else { // no rooms want heat so turn off boiler
#        logInfo("Boiler_Control rule", "-> All heaters are off -> Send boiler OFF command" )
#         Boiler_Control.sendCommand(OFF)
#     }
# end
    else:
        LogAction.logInfo("Boiler_Control rule", ":: -> All heaters are off -> Send boiler OFF command" )
        events.sendCommand("Boiler_Control", "OFF")

