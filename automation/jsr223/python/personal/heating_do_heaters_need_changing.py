from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from java.time import ZonedDateTime as DateTime

@rule("Check if Heaters need changing etc", description="Check if Heaters need changing etc", tags=["heating"])
@when("Member of gHeatingModes received update")
@when("Member of gTemperatureSetpoints received update")
@when("Member of gRoomTemperatures received update")
def checkIfHeatersNeedUpdating(event):
    # checkIfHeatersNeedUpdating.log.info("HHH HeatingMode, Setpoint or Temperature updated")
    LogAction.logInfo("Check if Heaters need changing", "HHH HeatingMode, Setpoint or Temperature updated")

    # get prefix eg FR, CT etc
    prefix = event.itemName[:event.itemName.rfind('_')]
    LogAction.logDebug("Check if Heaters need changing", "HHH Check if Heaters need changing etc due to Item: {}, received  update: {}", event.itemName, event.itemState)

    HeatingMode = ir.getItem(prefix + "_HeatingMode")
    LogAction.logDebug("Check if Heaters need changing", "HHH HeatingMode {} : {}", prefix, HeatingMode.state)

    TSetpoint = ir.getItem(prefix + "_TemperatureSetpoint")
    LogAction.logDebug("Check if Heaters need changing", "HHH Setpoint    {} : {}", prefix, TSetpoint.state)

    Temperature = ir.getItem(prefix + "_Temperature")
    LogAction.logDebug("Check if Heaters need changing", "HHH Temperature {} : {}", prefix, Temperature.state)

    Heater = ir.getItem(prefix + "_Heater")
    LogAction.logDebug("Check if Heaters need changing", "HHH Heater      {} : {}", prefix, Heater.state)

    Reachable = ir.getItem(prefix + "_RTVReachable")
    LogAction.logDebug("Check if Heaters need changing", "HHH Reachable   {} : {}", prefix, Reachable.state)

    #!handle an offline TRV
    if Reachable.state.toString() != "Online":  # is the trv actually online??
       LogAction.logDebug("Check if Heaters need changing", "HHH ZZZZ---ZZZZ Reachable-Offline - sending OFF, leaving!!!!!   prefix: {} ", prefix)
       #turn this one off
       events.sendCommand(Heater, "OFF")
       return #dont continue on and update the bolier control if this RTV is Offline

    LogAction.logDebug("Check if Heaters need changing", "HHH current HeatingMode.state: {}  masterHeatingMode.state: {}",
                       HeatingMode.state, ir.getItem("masterHeatingMode").state)

    if (HeatingMode.state.toString() == "off") or (ir.getItem("masterHeatingMode").state.toString() == "off"):
        if (ir.getItem("masterHeatingMode").state.toString() == "off"):
            LogAction.logDebug("Check if Heaters need changing", "HHH Master Heating Mode is OFF")

        LogAction.logDebug("Check if Heaters need changing", "HHH Turn heater OFF for {}  cos its Heating Mode is {}", prefix, HeatingMode.state)
        events.sendCommand(Heater, "OFF")

    #* if alowwed to be on, check if need to turn on heater
    elif (HeatingMode.state.toString() == "auto") or (HeatingMode.state.toString() == "manual"):
        LogAction.logDebug("Check if Heaters need changing", "HHH mode is auto or manual")
        LogAction.logDebug("Check if Heaters need changing", "HHH Heater.itemName: {}", Heater)
        checkIfHeatersNeedUpdating.log.debug(":::-> Check if Heaters need changing  HHH mode is auto or manual")
        setpoint = TSetpoint.state
        turnOnTemp = setpoint  # - 0.2// calculate the turn on/off temperatures
        turnOffTemp = setpoint  # + 0.1
        temp = Temperature.state  # get the current temperature

        if temp >= turnOffTemp:  # {  // determine whether we need to turn on/off the heater
            LogAction.logDebug("Check if Heaters need changing", "HHH SendCommand to {}, Heater OFF", prefix)
            events.sendCommand(Heater, "OFF")
        elif temp < turnOnTemp:
            LogAction.logDebug("Check if Heaters need changing", "HHH SendCommand to {}, Heater ON", prefix)
            events.sendCommand(Heater, "ON")

