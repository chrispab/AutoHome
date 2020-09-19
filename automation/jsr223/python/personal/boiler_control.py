from core.rules import rule
from core.triggers import when
# rule "check for Boiler Demand changed"
# when
#     Member of gRoomHeaterStates received command
# then
@rule("If heater demand turn on Boiler else off", description="If heater demand turn on Boiler else off", tags=["boiler"])
@when("Member of gRoomHeaterStates received command")
def boiler_control(event):
    boiler_control.log.info("::::::::::::::::::Boiler_Control rule -> A Heater recieved a command - updating boiler state:::::::::::::::::::::::")

#     logInfo("Boiler_Control rule", "-> A Heater recieved a command - updating boiler state")
#     logInfo("Boiler_Control rule", "-> " + triggeringItem.name + " command was " + triggeringItem.previousState.state + " now " + triggeringItem.state)
    boiler_control.log.info("Boiler_Control -> triggeritem -->")

#     if ( gRoomHeaterStates.state ==  NULL ) {  // display any NUll heater states
#             gRoomHeaterStates.members.forEach[ Heater | 
#                 logInfo("Boiler_Control rule", "-> Heating state detected with val = " + Heater.name + Heater.state) 
#             ] 
#     }






#     if ( gAnyRoomHeaterOn.state == ON ) {//if any rooms want heat - turn on boiler
#         gRoomHeaterStates.members.filter[l|l.state == ON].forEach[ Heater | 
#             logInfo("Boiler_Control rule", "-> Heater " + Heater.name + " is " + Heater.state) 
#         ] 
#         logInfo("Boiler_Control rule", "-> at least 1 heater on -> Send boiler ON command" )
#         Boiler_Control.sendCommand(ON)
#     }


#     else { // no rooms want heat so turn off boiler
#        logInfo("Boiler_Control rule", "-> All heaters are off -> Send boiler OFF command" )
#         Boiler_Control.sendCommand(OFF)
#     }
# end
