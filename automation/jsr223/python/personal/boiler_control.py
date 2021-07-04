from core.rules import rule
from core.triggers import when
from core.actions import LogAction



@rule("If any heaters demand, turn Boiler ON else OFF", description="If heater demand turn on Boiler else off", tags=["boiler"])
# @when("Member of gRoomHeaterStates changed") #only update if a heater demand changed - not often
@when("Member of gRoomHeaterStates received update") #update if ANY heater demand updated - v often
def boiler_control(event):
    boiler_control.log.debug("::A Heater demand changed - updating boiler state:: ")
    LogAction.logDebug("Boiler_Control", ":::Item {} received update: {}", event.itemName, event.itemState)
    # LogAction.logWarn("Boiler_Control", "-> name:{}, prev:{}, now:{}", event.itemName, event.oldItemState, event.itemState)
    boiler_control.log.debug("::Boiler_Control triggering item: " + event.itemName + ", State: " + event.itemState.toString())

    # display any NUll heater states
    # if items["gRoomHeaterStates"] == NULL:
    #     for item in ir.getItem("gTest").members:
    #         LogAction.logInfo("boiler control", ":::Heater Item: {}, state: {}", item.itemName, item.itemState)

    if items["gAnyRoomHeaterOn"] == ON:
        # get list of ON heatees
        listOfMembers = [item for item in ir.getItem("gRoomHeaterStates").members if item.state == ON]
        LogAction.logDebug("boiler control", "::: LIST OF HEATERS ON :::")
        for item in listOfMembers:
            LogAction.logDebug("boiler control", ":::Heater Item: {}, is : {}", item.name, item.state)


        # is th trv online?
        # get prefix eg FR, CT etc
        # prefix = event.itemName[:event.itemName.rfind('_')]
        # Reachable = ir.getItem(prefix + "_RTVReachable")
        # LogAction.logInfo("boiler control", "::::: Reachable   {} : {}", prefix, Reachable.state)
        # if Reachable.state.toString() != "Online":  # is the trv actually online??
        #     LogAction.logError("boiler control", "::::: ZZZZ---ZZZZ Reachable-Offline - leaving!!!!!   prefix: {} ", prefix)
        #     LogAction.logError("Boiler_Control", ":: -> This TRV is offline -> Send boiler OFF command")
        #     events.sendCommand("Boiler_Control", "OFF")
        #     return #dont continue on and update the bolier control if this RTV is Offline


        LogAction.logDebug("Boiler_Control rule", "::-> at least 1 heater on -> Send boiler ON command")
        events.sendCommand("Boiler_Control", "ON")
    else:  # no rooms want heat so turn off boiler
        LogAction.logDebug("Boiler_Control rule", ":: -> All heaters are off -> Send boiler OFF command")
        events.sendCommand("Boiler_Control", "OFF")
