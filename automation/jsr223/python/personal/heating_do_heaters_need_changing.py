from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime

# rule "Check if Heaters need changing etc"
# when
#     Member of gHeatingModes received update or
#     Member of gTemperatureSetpoints received update or
#     Member of gRoomTemperatures received update
# then


@rule("Check if Heaters need changing etc", description="Check if Heaters need changing etc", tags=["heating"])
@when("Member of gHeatingModes received update")
@when("Member of gTemperatureSetpoints received update")
@when("Member of gRoomTemperatures received update")
def checkIfHeatersNeedUpdating(event):
    checkIfHeatersNeedUpdating.log.error("+++++ HeatingMode, Setpoint or Temperature updated +++++++++++++++++++++++++")
#     // https://community.openhab.org/t/solved-using-a-variable-to-obtain-an-item-state/61500/3
#     logWarn("Heaters rules", "===> HeatingMode, Setpoint or Temperature updated-")
# //
#     val prefix = triggeringItem.name.split("_").get(0)
    # prefix eg FR_, CT_ etc
    prefix = event.itemName[:event.itemName.rfind('_')]
    LogAction.logError("Check if Heaters need changing", "+++++ Check if Heaters need changing etc  Item {} received  update: {}", event.itemName, event.itemState)

#     //val  heatingModeName = "" + prefix + "_HeatingMode"
#     logInfo("Heaters rules", "===> Triggering item: " + triggeringItem.name )


#     val HeatingMode = gHeatingModes.members.findFirst[ t | t.name == prefix + "_HeatingMode"]
#     logInfo("Heaters rules", "===> HeatingMode " + prefix + " : " + HeatingMode.state )
    HeatingMode = ir.getItem(prefix + "_HeatingMode")
    LogAction.logError("Check if Heaters need changing", "+++++ HeatingMode {} : {}", prefix, HeatingMode.state)


#     val TSetpoint = gTemperatureSetpoints.members.findFirst[ t | t.name == prefix + "_TemperatureSetpoint" ] as NumberItem
#     logInfo("Heaters rules", "===> Setpoint    " + prefix + " : " + TSetpoint.state )
    TSetpoint = ir.getItem(prefix + "_TemperatureSetpoint")
    LogAction.logError("Check if Heaters need changing", "+++++ Setpoint    {} : {}", prefix, TSetpoint.state)


#     val Temperature = gRoomTemperatures.members.findFirst[ t | t.name == prefix + "_Temperature" ] as NumberItem
#     logInfo("Heaters rules", "===> Temperature " + prefix + " : " + Temperature.state )
    Temperature = ir.getItem(prefix + "_Temperature")
    LogAction.logError("Check if Heaters need changing", "+++++ Temperature {} : {}", prefix, Temperature.state)

#     val Heater = gRoomHeaterStates.members.findFirst[ t | t.name == prefix + "_Heater" ]
#     logInfo("Heaters rules", "===> Heater      " + prefix + " : " + Heater.state )
    Heater = ir.getItem(prefix + "_Heater")
    LogAction.logError("Check if Heaters need changing", "+++++ Heater      {} : {}", prefix, Heater.state)

# //get state of triggering item 'reachable'- is the rtv reachable?
#     val Reachable = gRTVsReachable.members.findFirst[ t | t.name == prefix + "_RTVReachable" ]
    Reachable = ir.getItem(prefix + "_RTVReachable")

#     logInfo("Heaters rules", "===> Reachable   " + prefix + " : " + Reachable.state )
    LogAction.logError("Check if Heaters need changing", "+++++ Reachable   {} : {}", prefix, Reachable.state)

#     if (Reachable.state.toString  != "Online") {
#         logInfo("Heaters rules", "===> Reachable-Offline - leaving!!!   " + prefix )
#         return //dont continue on and update the bolier control if this RTV is Offline
#     }
    if Reachable.state.toString() != "Online":  # is the trv actually online??
        LogAction.logError("Check if Heaters need changing", "+++++ Reachable-Offline - leaving!!!   prefix: {} ", prefix)
        return
#     // else{
#     //     // logInfo("Heaters rules", "===> Reachable   " + prefix + " : OFFLINE or NULL: " + Reachable )
#     //    //logInfo("Heaters rules", "===> Reachable   " + prefix + " : " + Reachable )
#     // }

#   if ((HeatingMode.state == "off") || (masterHeatingMode.state == "off")) {
    LogAction.logError("Check if Heaters need changing", "+++++ SHOW HeatingMode.state: {}  masterHeatingMode.state {}", HeatingMode.state, ir.getItem("masterHeatingMode").state)

    if (HeatingMode.state.toString() == "off") or (ir.getItem("masterHeatingMode").state.toString() == "off"):
    #   if (masterHeatingMode.state == "off") {
        if (ir.getItem("masterHeatingMode").state.toString() == "off"):
        #   logInfo("Heaters rules", "===> Master Heating Mode is OFF")
            LogAction.logError("Check if Heaters need changing", "+++++ Master Heating Mode is OFF")

#       }
#       logInfo("Heaters rules", "===> Turn heater OFF for " + prefix + " cos Heating Mode is " + HeatingMode.state)
        LogAction.logError("Check if Heaters need changing", "+++++ Turn heater OFF for {}  cos its Heating Mode is {}", prefix, HeatingMode.state)

#       Heater.sendCommand(OFF)
#       Heater.postUpdate(OFF)
        events.sendCommand(Heater, "OFF")
        events.postUpdate(Heater, "OFF")

#   }
#   else if ( (HeatingMode.state == "auto") || (HeatingMode.state == "manual") )  { //auto
    elif (HeatingMode.state.toString() == "auto") or (HeatingMode.state.toString() == "manual"):
        LogAction.logError("Check if Heaters need changing", "+++++ mode is auto or manual")
        LogAction.logError("Check if Heaters need changing", "+++++ Heater.itemName: {}", Heater)

#       var Number setpoint = TSetpoint.state as DecimalType
#       var Number turnOnTemp = setpoint //- 0.2// calculate the turn on/off temperatures
#       var Number turnOffTemp = setpoint //+ 0.1
#       var Number temp = Temperature.state as DecimalType // get the current temperature
        setpoint = TSetpoint.state
        turnOnTemp = setpoint #- 0.2// calculate the turn on/off temperatures
        turnOffTemp = setpoint #+ 0.1
        temp = Temperature.state # get the current temperature


#       if (temp >= turnOffTemp) {  // determine whether we need to turn on/off the heater
#           logInfo("Heaters rules", "===> SendCommand " + prefix + " : " + "Heater OFF")
#           Heater.sendCommand(OFF)
#           Heater.postUpdate(OFF)
        if temp >= turnOffTemp: # {  // determine whether we need to turn on/off the heater
            LogAction.logError("Check if Heaters need changing", "+++++ SendCommand to {}, Heater OFF", prefix)
            events.sendCommand(Heater, "OFF")
            events.postUpdate(Heater, "OFF")
#       }else if (temp < turnOnTemp) {
        elif temp < turnOnTemp:
#           logInfo("Heaters rules", "===> SendCommand " + prefix + " : " + "Heater ON")
            LogAction.logError("Check if Heaters need changing", "+++++ SendCommand to {}, Heater ON", prefix)
#           Heater.sendCommand(ON)
#           Heater.postUpdate(ON)
            events.sendCommand(Heater, "ON")
            events.postUpdate(Heater, "ON")
#       }
#   }
# end
