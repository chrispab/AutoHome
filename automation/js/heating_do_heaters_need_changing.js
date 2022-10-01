// from core.rules import rule
// from core.triggers import when
// from core.actions import LogAction
// from core.actions import ScriptExecution
// from java.time import ZonedDateTime as DateTime
const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('BG_Availability.js');
const { timeUtils } = require('openhab_rules_tools');
// @rule("Check if Heaters need changing etc", description="Check if Heaters need changing etc", tags=["heating"])
// @when("Member of gHeatingModes received update")
// @when("Member of gTemperatureSetpoints received update")
// @when("Member of gRoomTemperatures received update")
// def checkIfHeatersNeedUpdating(event):
rules.JSRule({
  name: 'Check if Heaters need changing etc',
  description: 'Check if Heaters need changing etc',
  triggers: [
    triggers.GroupStateUpdateTrigger('gHeatingModes'),
    triggers.GroupStateUpdateTrigger('gTemperatureSetpoints'),
    triggers.GroupStateUpdateTrigger('gRoomTemperatures'),
  ],
  execute: (event) => {
    logger.warn(`Check if Heaters need changing etc, triggering item name: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
    //     # get prefix eg FR, CT etc
    //     prefix = event.itemName[:event.itemName.rfind('_')]
    //     LogAction.logDebug("Check if Heaters need changing", "HHH Check if Heaters need changing etc due to Item: {}, received  update: {}", event.itemName, event.itemState)
    const stub = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    //     HeatingMode = ir.getItem(prefix + "_HeatingMode")
    //     LogAction.logDebug("Check if Heaters need changing", "HHH HeatingMode {} : {}", prefix, HeatingMode.state)
    const HeatingMode = items.getItem(`${stub}_HeatingMode`);
    logger.error(`---HHH HeatingMode: ${stub} : ,  HeatingMode.state: ${HeatingMode.state}`);

    //     TSetpoint = ir.getItem(prefix + "_TemperatureSetpoint")
    //     LogAction.logDebug("Check if Heaters need changing", "HHH Setpoint    {} : {}", prefix, TSetpoint.state)
    const TSetpoint = items.getItem(`${stub}_TemperatureSetpoint`);
    logger.error(`---HHH setpoint: ${stub} : ,  Setpoint.state: ${TSetpoint.state}`);

    //     Temperature = ir.getItem(prefix + "_Temperature")
    //     LogAction.logDebug("Check if Heaters need changing", "HHH Temperature {} : {}", prefix, Temperature.state)
    const Temperature = items.getItem(`${stub}_Temperature`);
    logger.error(`---HHH Temperature: ${stub} : ,  Temperature.state: ${Temperature.state}`);

    //     Heater = ir.getItem(prefix + "_Heater")
    //     LogAction.logDebug("Check if Heaters need changing", "HHH Heater      {} : {}", prefix, Heater.state)
    const Heater = items.getItem(`${stub}_Heater`);
    logger.error(`---HHH Heater: ${stub} : ,  Heater.state: ${Heater.state}`);

    //     Reachable = ir.getItem(prefix + "_RTVReachable")
    //     LogAction.logDebug("Check if Heaters need changing", "HHH Reachable   {} : {}", prefix, Reachable.state)
    const Reachable = items.getItem(`${stub}_RTVReachable`);
    logger.error(`x---HHH Reachable: ${stub} : ,  Reachable.state: ${Reachable.state}`);

    //     #!handle an offline TRV
    //     if Reachable.state.toString() != "Online":  # is the trv actually online??
    //        LogAction.logDebug("Check if Heaters need changing", "HHH ZZZZ---ZZZZ Reachable-Offline - sending OFF, leaving!!!!!   prefix: {} ", prefix)
    //        #turn this one off
    //        events.sendCommand(Heater, "OFF")
    //        return #dont continue on and update the bolier control if this RTV is Offline
    if (Reachable.state.toString() !== 'Online') {
      logger.error(`---HHH ZZZZ---ZZZZ Reachable-Offline - sending OFF, leaving!!!!! : ${stub} : ,  Reachable.state: ${Reachable.state}`);
      // turn it off
      Heater.sendCommand('OFF');
      // #dont continue on and update the bolier control if this RTV is Offline
    }

    //     if (HeatingMode.state.toString() == "off") or (ir.getItem("masterHeatingMode").state.toString() == "off"):
    //         if (ir.getItem("masterHeatingMode").state.toString() == "off"):
    //             LogAction.logDebug("Check if Heaters need changing", "HHH Master Heating Mode is OFF")
    //         LogAction.logDebug("Check if Heaters need changing", "HHH Turn heater OFF for {}  cos its Heating Mode is {}", prefix, HeatingMode.state)
    //         events.sendCommand(Heater, "OFF")

    //         LogAction.logDebug("Check if Heaters need changing", "HHH Turn heater OFF for {}  cos its Heating Mode is {}", prefix, HeatingMode.state)
    //         events.sendCommand(Heater, "OFF")
    logger.error(`---HHH HeatingMode.state.toString() : ${HeatingMode.state.toString()}`);
    logger.error(`---HHH items.getItem('masterHeatingMode').state.toString() : ${items.getItem('masterHeatingMode').state.toString()}`);

    if ((HeatingMode.state.toString() == 'off') || (items.getItem('masterHeatingMode').state.toString() == 'off')) {
      if ((items.getItem('masterHeatingMode').state.toString() === 'off')) {
        logger.error('---HHH ZZZZ---ZZZZ HHH Master Heating Mode is OFF!!!!! :');
      }
      logger.error(`---HHH Turn heater OFF for  ${stub}  cos its Heating Mode is  ${HeatingMode.state}`);
      Heater.sendCommand('OFF');
    }

    //     #* if alowwed to be on, check if need to turn on heater
    //     elif (HeatingMode.state.toString() == "auto") or (HeatingMode.state.toString() == "manual"):
    //         LogAction.logDebug("Check if Heaters need changing", "HHH mode is auto or manual")
    //         LogAction.logDebug("Check if Heaters need changing", "HHH Heater.itemName: {}", Heater)
    //         checkIfHeatersNeedUpdating.log.debug(":::-> Check if Heaters need changing  HHH mode is auto or manual")
    //         setpoint = TSetpoint.state
    //         turnOnTemp = setpoint  # - 0.2// calculate the turn on/off temperatures
    //         turnOffTemp = setpoint  # + 0.1
    //         temp = Temperature.state  # get the current temperature
    //         if temp >= turnOffTemp:  # {  // determine whether we need to turn on/off the heater
    //             LogAction.logDebug("Check if Heaters need changing", "HHH SendCommand to {}, Heater OFF", prefix)
    //             events.sendCommand(Heater, "OFF")
    //         elif temp < turnOnTemp:
    //             LogAction.logDebug("Check if Heaters need changing", "HHH SendCommand to {}, Heater ON", prefix)
    //             events.sendCommand(Heater, "ON")

    // if alowwed to be on, check if need to turn on heater
    else if (((HeatingMode.state.toString() === 'auto')) || ((HeatingMode.state.toString() === 'manual'))) {
      logger.error('---HHH mode is auto or manual');
      const setpoint = TSetpoint.state;
      const turnOnTemp = setpoint; // # - 0.2// calculate the turn on/off temperatures
      const turnOffTemp = setpoint; //  # + 0.1
      const temp = Temperature.state; //  # get the current temperature
      if (temp >= turnOffTemp) {
        logger.error(`---HHH SendCommand to ${stub}, Heater OFF`);
        Heater.sendCommand('OFF');
      } else if (temp < turnOnTemp) {
        logger.error(`---HHH SendCommand to ${stub}, Heater On`);
        Heater.sendCommand('ON');
      }
    }
  },
});
