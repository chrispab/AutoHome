from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime

@rule("Check if Heaters need changing etc", description="Check if Heaters need changing etc", tags=["heating"])
@when("Member of gHeatingModes received update")
@when("Member of gTemperatureSetpoints received update")
@when("Member of gRoomTemperatures received update")
def checkIfHeatersNeedUpdating(event):
    checkIfHeatersNeedUpdating.log.error("+++++ HeatingMode, Setpoint or Temperature updated +++++++++++++++++++++++++")

    # prefix eg FR_, CT_ etc
    prefix = event.itemName[:event.itemName.rfind('_')]
    LogAction.logError("Check if Heaters need changing", "+++++ Check if Heaters need changing etc  Item {} received  update: {}", event.itemName, event.itemState)

    HeatingMode = ir.getItem(prefix + "_HeatingMode")
    LogAction.logError("Check if Heaters need changing", "+++++ HeatingMode {} : {}", prefix, HeatingMode.state)

    TSetpoint = ir.getItem(prefix + "_TemperatureSetpoint")
    LogAction.logError("Check if Heaters need changing", "+++++ Setpoint    {} : {}", prefix, TSetpoint.state)

    Temperature = ir.getItem(prefix + "_Temperature")
    LogAction.logError("Check if Heaters need changing", "+++++ Temperature {} : {}", prefix, Temperature.state)

    Heater = ir.getItem(prefix + "_Heater")
    LogAction.logError("Check if Heaters need changing", "+++++ Heater      {} : {}", prefix, Heater.state)

    Reachable = ir.getItem(prefix + "_RTVReachable")

    LogAction.logError("Check if Heaters need changing", "+++++ Reachable   {} : {}", prefix, Reachable.state)

    if Reachable.state.toString() != "Online":  # is the trv actually online??
        LogAction.logError("Check if Heaters need changing", "+++++ Reachable-Offline - leaving!!!   prefix: {} ", prefix)
        return #dont continue on and update the bolier control if this RTV is Offline

    LogAction.logError("Check if Heaters need changing", "+++++ SHOW HeatingMode.state: {}  masterHeatingMode.state {}",
                       HeatingMode.state, ir.getItem("masterHeatingMode").state)

    if (HeatingMode.state.toString() == "off") or (ir.getItem("masterHeatingMode").state.toString() == "off"):
        if (ir.getItem("masterHeatingMode").state.toString() == "off"):
            LogAction.logError("Check if Heaters need changing", "+++++ Master Heating Mode is OFF")

        LogAction.logError("Check if Heaters need changing", "+++++ Turn heater OFF for {}  cos its Heating Mode is {}", prefix, HeatingMode.state)
        events.sendCommand(Heater, "OFF")

    elif (HeatingMode.state.toString() == "auto") or (HeatingMode.state.toString() == "manual"):
        LogAction.logError("Check if Heaters need changing", "+++++ mode is auto or manual")
        LogAction.logError("Check if Heaters need changing", "+++++ Heater.itemName: {}", Heater)

        setpoint = TSetpoint.state
        turnOnTemp = setpoint  # - 0.2// calculate the turn on/off temperatures
        turnOffTemp = setpoint  # + 0.1
        temp = Temperature.state  # get the current temperature

        if temp >= turnOffTemp:  # {  // determine whether we need to turn on/off the heater
            LogAction.logError("Check if Heaters need changing", "+++++ SendCommand to {}, Heater OFF", prefix)
            events.sendCommand(Heater, "OFF")
        elif temp < turnOnTemp:
            LogAction.logError("Check if Heaters need changing", "+++++ SendCommand to {}, Heater ON", prefix)
            events.sendCommand(Heater, "ON")

