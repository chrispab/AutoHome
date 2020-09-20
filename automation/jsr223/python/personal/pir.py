from core.rules import rule
from core.triggers import when
from org.eclipse.smarthome.core.library.types import PercentType

# var Boolean CLightsAreOn = false


@rule("PIRsensor change", description="PIRsensor change", tags=["pir"])
@when("Item pir01_occupancy received update")
@when("Item pir02_occupancy received update")
def pir_change(event):
    pir_change.log.info("pir_change trigger item : " + event.itemName + ":" + event.itemState.toString())


# rule "pir01 or 02 - Turn ON lights"
@rule("pir01 or 02 Turn ON lights", description="PIRsensor change", tags=["pir"])
@when("Item pir01_occupancy changed from OFF to ON")
@when("Item pir02_occupancy changed from OFF to ON")
def pir_light_on(event):
    pir_light_on.log.info("pir_light_on triggering item : " + event.itemName + ":" + event.itemState.toString())
    if items["pir01_illuminance_lux"] < 60:
        events.sendCommand("ZbWhiteBulb01Switch", "ON")
        events.sendCommand("ZbWhiteBulb01Dim", PercentType(100))




# rule "PIRsensor Turn OFF lights"
# when
#     Item pir01_occupancy changed from ON to OFF
#     or
#     Item pir02_occupancy changed from ON to OFF

# then
#     logInfo("RULE", "pir off")
#     if ((pir01_occupancy.state == OFF) && (pir01_occupancy.state == OFF))
#             ZbWhiteBulb01Switch.sendCommand(OFF)
# end
# rule "pir01 or 02 - Turn ON lights"
@rule("PIRsensor Turn OFF lights", description="PIRsensor Turn OFF lights", tags=["pir"])
@when("Item pir01_occupancy changed from ON to OFF")
@when("Item pir02_occupancy changed from ON to OFF")
def pir_light_off(event):
    pir_light_off.log.info("pir_light_off triggering item : " + event.itemName + ":" + event.itemState.toString())
    if items["pir01_occupancy"] == OFF and items["pir02_occupancy"] == OFF:
        events.sendCommand("ZbWhiteBulb01Switch", "OFF")
        # events.sendCommand("ZbWhiteBulb01Dim", PercentType(50))
