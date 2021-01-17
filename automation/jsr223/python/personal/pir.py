from personal.util import send_info
from core.rules import rule
from core.triggers import when
from org.eclipse.smarthome.core.library.types import PercentType
from core.actions import PersistenceExtensions
from core.actions import ScriptExecution
import org.joda.time.DateTime as DateTime

# var Boolean CLightsAreOn = false
import personal.util
reload(personal.util)


@rule("PIRsensor change", description="PIRsensor change", tags=["pir"])
@when("Item pir01_occupancy received update")
@when("Item pir02_occupancy received update")
def pir_change(event):
  #  pir_change.log.info("/////=======pir_change trigger item : " + event.itemName + ", PREV: " + PersistenceExtensions.previousState(ir.getItem(event.itemName), True).state + ", NOW: " + event.itemState.toString())
    pir_change.log.info("///pir_light received update")
    # send_info("test", pir_change.log)                                                                                                #PersistenceExtensions.previousState(ir.getItem("Weather_SolarRadiation"), True).state


@rule("pir01 or 02 Turn ON lights", description="PIRsensor change", tags=["pir"])
@when("Item pir01_occupancy received update ON")
@when("Item pir02_occupancy received update ON")
def pir_light_on(event):
    pir_light_on.log.error("+++++++++pir_light_on triggering item : " + event.itemName + ": " +
                          event.itemState.toString() + ": " + items["pir01_illuminance_lux"].toString())
    #! change to main light sensor detect level on bridge     BridgeLightSensorLevel                 
    # if items["BridgeLightSensorLevel"] < DecimalType(1500) :
    if items["BridgeLightSensorLevel"] < items["ConservatoryLightTriggerLevel"] :
    # if items["pir01_illuminance_lux"] < DecimalType(30) or items["pir02_illuminance_lux"] < DecimalType(30):
        # events.sendCommand("ZbWhiteBulb01Switch", "ON")
        # events.sendCommand("ZbWhiteBulb01Dim", "100")
        events.sendCommand("gKT_WiFiLightsPower", "ON")


@rule("PIRsensor Turn OFF lights", description="PIRsensor Turn OFF lights", tags=["pir"])
@when("Item pir01_occupancy changed from ON to OFF") # or
@when("Item pir02_occupancy changed from ON to OFF")
def pir_light_off(event):
    pir_light_off.log.info("/////pir01_occupancy_off triggering item : " + event.itemName + ":" + event.itemState.toString())
    if items["pir01_occupancy"] == OFF and items["pir02_occupancy"] == OFF:
        # events.sendCommand("ZbWhiteBulb01Switch", "OFF")
        # wait a bit before actually turning off
        pir_off_timer = ScriptExecution.createTimer(DateTime.now().plusSeconds(30), lambda: pir_off_body())

def pir_off_body():
    # pir_off_body.log.error(">>>> K lights off pre test")

    if items["pir01_occupancy"] == OFF and items["pir02_occupancy"] == OFF:
        events.sendCommand("gKT_WiFiLightsPower", "OFF")
        # pir_off_body.log.error(">>>> K lights off POST test")
        # events.sendCommand("ZbWhiteBulb01Dim", PercentType(50))
