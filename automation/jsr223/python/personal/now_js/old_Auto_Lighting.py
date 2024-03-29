# from core.rules import rule
# from core.triggers import when
# from core.actions import ScriptExecution
# from core.actions import LogAction


# @rule("auto lighting init", description="Handles fan actions", tags=["conservatory"])
# @when("System started")
# def auto_lighting_init(event):
#     auto_lighting_init.log.info("auto_lighting_init")
#     events.postUpdate("BridgeLightSensorState", "OFF")

# rule "if dark in morning turn on conservatory lights"
# @rule("auto_lighting_on_morning", description="auto conservatory lights", tags=["conservatory"])
# @when("Time cron 0 00 07 ? * * *")
# def auto_lighting_on_morning(event):
#     if items["BridgeLightSensorState"] == OFF:
#         events.sendCommand("gConservatoryLights", "ON")

# rule "turn off lights (if on) when daylight rises"
# @rule("auto cvty  lights on t,w,thurs early", description="auto conservatory lights", tags=["conservatory"])
# @when("Time cron 0 30 6 ? * TUE,WED,THU *")
# def auto_lighting_on_morning(event):
#     if items["BridgeLightSensorState"] == OFF:
#         events.sendCommand("gConservatoryLights", "ON")

# @rule("auto_lighting_off_morning", description="Handles fan actions", tags=["conservatory"])
# @when("Item BridgeLightSensorState changed from OFF to ON")
# def auto_lighting_off_morning(event):
#     if items["BridgeLightSensorState"] == ON:
#         # events.sendCommand("conservatoryLightsProxy", "OFF")
#         events.sendCommand("gConservatoryLights", "OFF")
#         events.sendCommand("gColourBulbs", "OFF")

# rule "Light sensor Turn ON lights when it gets dark"
# @rule("auto_lighting_on_evening", description="Handles fan actions", tags=["conservatory"])
# @when("Item BridgeLightSensorState changed from ON to OFF")
# def auto_lighting_on_evening(event):
#     # events.sendCommand("conservatoryLightsProxy", "ON")
#     events.sendCommand("gConservatoryLights", "ON")


# rule "2.30 am turn off lights if i forgot"
# @rule("auto_lighting_off_late", description="Handles fan actions", tags=["conservatory"])
# @when("Time cron 0 30 01 ? * * *")
# def auto_lighting_off_late(event):
#     # events.sendCommand("conservatoryLightsProxy", "OFF")
#     events.sendCommand("gConservatoryLights", "OFF")
#     events.sendCommand("gColourBulbs", "OFF")
