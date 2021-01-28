from core.rules import rule
from core.triggers import when
from core.actions import LogAction


@rule("If any heaters demand, turn Boiler ON else OFF", description="If heater demand turn on Boiler else off", tags=["boiler"])
@when("Member of gRoomHeaterStates changed")
def boiler_control(event):
    boiler_control.log.error("::A Heater demand changed - updating boiler state:: ")
    LogAction.logWarn("Boiler_Control", ":::Item {} received update: {}", event.itemName, event.itemState)
    LogAction.logWarn("Boiler_Control", "-> name:{}, prev:{}, now:{}", event.itemName, event.oldItemState, event.itemState)
    boiler_control.log.warn("::Boiler_Control triggering item: " + event.itemName + ", State: " + event.itemState.toString())

    # display any NUll heater states
    # if items["gRoomHeaterStates"] == NULL:
    #     for item in ir.getItem("gTest").members:
    #         LogAction.logInfo("boiler control", ":::Heater Item: {}, state: {}", item.itemName, item.itemState)

    if items["gAnyRoomHeaterOn"] == ON:
        # get list of ON heatees
        listOfMembers = [item for item in ir.getItem("gRoomHeaterStates").members if item.state == ON]
        LogAction.logWarn("boiler control", "::: LIST OF HEATERS ON :::")
        for item in listOfMembers:
            LogAction.logWarn("boiler control", ":::Heater Item: {}, is : {}", item.name, item.state)

        LogAction.logInfo("Boiler_Control rule", "::-> at least 1 heater on -> Send boiler ON command")
        events.sendCommand("Boiler_Control", "ON")
    else:  # no rooms want heat so turn off boiler
        LogAction.logInfo("Boiler_Control rule", ":: -> All heaters are off -> Send boiler OFF command")
        events.sendCommand("Boiler_Control", "OFF")
