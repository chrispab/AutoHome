"""
This script controls conservatory fan rules
"""

from core.rules import rule
from core.triggers import when
from core.actions import ScriptExecution

@rule("Turn ON conservatory lights via proxy", description="Handles fan actions", tags=["conservatory", "fan"])
# @when("Item CT_Temperature changed")
@when("Item conservatoryLightsProxy changed from OFF to ON")
def conservatory_lights_on(event):
    conservatory_lights_on.log.info("Turn ON the Conservatory lights via proxy")
    events.sendCommand("gConservatoryFairyLights", "ON")
    events.postUpdate("gConservatoryFairyLights", "ON")


@rule("Turn OFF conservatory lights via proxy", description="Handles fan actions", tags=["conservatory", "fan"])
@when("Item conservatoryLightsProxy changed from ON to OFF")
def conservatory_lights_off(event):
    conservatory_lights_off.log.info("Turn Off the Conservatory lights via proxy")
    events.sendCommand("gConservatoryFairyLights", "OFF")
    events.postUpdate("gConservatoryFairyLights", "OFF")
    events.postUpdate("ZbColourBulb01Switch", "OFF")


