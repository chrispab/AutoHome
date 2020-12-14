from core.rules import rule
from core.triggers import when
from core.actions import ScriptExecution


# @rule("Heating startup", description="StartUp Heating", tags=["Heating"])
# @when("System started")
# def heating_startup(event):


# @rule("Turn ON xmas lights via proxy", description="Handles xmas actions", tags=["xmas"])
# @when("Item ChristmasLightsProxy changed from OFF to ON")
# def xmas_lights_on(event):
#     xmas_lights_on.log.error("Turn ON the xmas lights via proxy")
#     events.sendCommand("gChristmasWifiPowerSockets", "ON")


@rule("Turn ON xmas lights via proxy", description="Handles xmas actions", tags=["xmas"])
@when("Item ChristmasLightsProxy received update ON")
def xmas_lights_on(event):
    xmas_lights_on.log.error("Turn ON the xmas lights via  proxy")
    events.sendCommand("gChristmasWifiPowerSockets", "ON")


@rule("Turn OFF conservatory lights via proxy", description="Handles fan actions", tags=["conservatory", "fan"])
@when("Item ChristmasLightsProxy received update OFF")
def xmas_lights__off(event):
    xmas_lights__off.log.error("Turn Off the xmas lights via proxy")
    events.sendCommand("gChristmasWifiPowerSockets", "OFF")
    # events.postUpdate("gConservatoryFairyLights", "OFF")
    # events.postUpdate("ZbColourBulb01Switch", "OFF")
    # events.sendCommand("workLightsPowerSocket", "OFF")


