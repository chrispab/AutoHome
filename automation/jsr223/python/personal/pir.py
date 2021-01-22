from personal.util import send_info
from core.rules import rule
from core.triggers import when
from org.eclipse.smarthome.core.library.types import PercentType
from core.actions import PersistenceExtensions
from core.actions import ScriptExecution
import org.joda.time.DateTime as DateTime
from core.actions import LogAction

# var Boolean CLightsAreOn = false
import personal.util
reload(personal.util)


@rule("PIRsensor change", description="PIRsensor change", tags=["pir"])
@when("Item pir01_occupancy received update")
@when("Item pir02_occupancy received update")
def pir_change(event):
  #  pir_change.log.info("/////=======pir_change trigger item : " + event.itemName + ", PREV: " + PersistenceExtensions.previousState(ir.getItem(event.itemName), True).state + ", NOW: " + event.itemState.toString())
    pir_change.log.error("///./..............pir_light received update")
    # send_info("test", pir_change.log)                                                                                                #PersistenceExtensions.previousState(ir.getItem("Weather_SolarRadiation"), True).state


@rule("pir01 or 02 Turn ON lights", description="PIRsensor change", tags=["pir"])
@when("Item pir01_occupancy received update ON")
@when("Item pir02_occupancy received update ON")
def pir_light_on(event):
    pir_light_on.log.error("pir_occupancy received update. item : " + event.itemName + ": " +
                          event.itemState.toString() + ": " + items["pir01_illuminance_lux"].toString())

    if items["BridgeLightSensorLevel"] < items["ConservatoryLightTriggerLevel"] :
        if items["pir01_occupancy"] == ON:
            events.sendCommand("KT_light_1_Power", "ON")
        if items["pir02_occupancy"] == ON:
            events.sendCommand("KT_light_2_Power", "ON")
            events.sendCommand("KT_light_3_Power", "ON")


@rule("PIRsensor Turn OFF lights", description="PIRsensor Turn OFF lights", tags=["pir"])
@when("Item pir01_occupancy changed from ON to OFF") # or
@when("Item pir02_occupancy changed from ON to OFF")
def pir_light_off(event):
    pir_light_off.log.error("///// pir_occupancy_off triggering item : " + event.itemName + " : " + event.itemState.toString())

    if event.itemName == "pir01_occupancy":
        # pir_light_off.log.error("pir01_occupancy_off body : KT_light_1_Power: OFF ")
        pir01_off_timer = ScriptExecution.createTimer(DateTime.now().plusSeconds(30), lambda: pir01_off_body())

    if event.itemName == "pir02_occupancy":
        # pir_light_off.log.error("pir02_occupancy_off body : KT_light_2_Power: OFF ")
        pir02_off_timer = ScriptExecution.createTimer(DateTime.now().plusSeconds(30), lambda: pir02_off_body())

def pir_off_body():
    if items["pir01_occupancy"] == OFF and items["pir02_occupancy"] == OFF:
        events.sendCommand("gKT_WiFiLightsPower", "OFF")

def pir01_off_body():
    # pir_light_off.log.error("pir01_occupancy_off body : KT_light_1_Power: OFF ")
    LogAction.logError("pir01_occupancy_off", "pir01_occupancy_off body : KT_light_1_Power: OFF ")
# LogAction.logInfo("boiler control", ":::Heater Item: {}, state: {}", item.itemName, item.itemState)
    events.sendCommand("KT_light_1_Power", "OFF")

def pir02_off_body():
    # pir_light_off.log.error("pir02_occupancy_off body : KT_light_2_Power: OFF ")
    LogAction.logError("pir02_occupancy_off", "pir02_occupancy_off body : KT_light_2_Power: OFF ")
    events.sendCommand("KT_light_2_Power", "OFF")
    events.sendCommand("KT_light_3_Power", "OFF")    