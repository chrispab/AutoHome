from core.rules import rule
from core.triggers import when
from org.eclipse.smarthome.core.library.types import PercentType
from core.actions import PersistenceExtensions
# var Boolean CLightsAreOn = false
import personal.util
reload(personal.util)
from personal.util import send_info, send_alert

@rule("PIRsensor change", description="PIRsensor change", tags=["pir"])
@when("Item pir01_occupancy received update")
@when("Item pir02_occupancy received update")
def pir_change(event):
  #  pir_change.log.info("/////=======pir_change trigger item : " + event.itemName + ", PREV: " + PersistenceExtensions.previousState(ir.getItem(event.itemName), True).state + ", NOW: " + event.itemState.toString())
    pir_change.log.info("///pir_light received upd  ate           " )
    # send_info("test", pir_change.log)                                                                                                #PersistenceExtensions.previousState(ir.getItem("Weather_SolarRadiation"), True).state

# rule "pir01 or 02 - Turn ON lights"
@rule("pir01 or 02 Turn ON lights", description="PIRsensor change", tags=["pir"]) 
@when("Item pir01_occupancy changed from OFF to ON")
@when("Item pir02_occupancy changed from OFF to ON")
def pir_light_on(event):
    pir_light_on.log.info("//////+++++++++pir_light_on triggering item : " + event.itemName + ": " + event.itemState.toString() + ": " + items["pir01_illuminance_lux"].toString() )
    if items["pir01_illuminance_lux"] < DecimalType(30):
        events.sendCommand("ZbWhiteBulb01Switch", "ON")
        events.sendCommand("ZbWhiteBulb01Dim", "100")



@rule("PIRsensor Turn OFF lights", description="PIRsensor Turn OFF lights", tags=["pir"])
@when("Item pir01_occupancy changed from ON to OFF")
@when("Item pir02_occupancy changed from ON to OFF")
def pir_light_off(event):
    pir_light_off.log.info("/////pir_light_off triggering item : " + event.itemName + ":" + event.itemState.toString())
    if items["pir01_occupancy"] == OFF and items["pir02_occupancy"] == OFF:
        events.sendCommand("ZbWhiteBulb01Switch", "OFF")
        # events.sendCommand("ZbWhiteBulb01Dim", PercentType(50))
