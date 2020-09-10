from core.rules import rule
from core.triggers import when
from core.actions import ScriptExecution


@rule("auto lighting init", description="Handles fan actions", tags=["conservatory", "fan"])
@when("System started")
def auto_lighting_init(event):
    auto_lighting_init.log.info("auto_lighting_init")
    events.postUpdate("BridgeLightSensorState", "OFF")
# rule "StartUp - set up Auto lighting"
# when
#     System started
# then
#     BridgeLightSensorState.postUpdate(OFF)
# end


@rule("auto_lighting_on_morning", description="Handles fan actions", tags=["conservatory", "fan"])
@when("Time cron 0 55 06 ? * * *")
def auto_lighting_on_morning(event):
# rule "if dark in morning turn on conservatory lights"
# when
#     Time cron "0 55 06 ? * * *"
# //    Time cron "0 53 17 ? * * *"
# then
#     logInfo("RULE", "morning lighting if dark")
#     sendNotification("cbattisson@gmail.com", "morning - lights on")
    if items["BridgeLightSensorState"] == OFF:
        events.postUpdate("conservatoryLightsProxy", "OFF")
        events.postUpdate("conservatoryLightsProxy", "ON")

#     if (BridgeLightSensorState.state == OFF) {
#         logInfo("RULE", "morning - switching on lights")
#         conservatoryLightsProxy.postUpdate(OFF)
#         conservatoryLightsProxy.postUpdate(ON)
#     }
# end


# rule "turn off lights (if on) when daylight rises"
# when
#     Item BridgeLightSensorState changed from OFF to ON 
# then
#     logInfo("RULE", "Light sensor detected it's light now - turn off lights when dark to light detected")
#     conservatoryLightsProxy.sendCommand(OFF)
# end


# rule "Light sensor Turn ON lights when it gets dark"
# when
#     Item BridgeLightSensorState changed from ON to OFF
# then
#     logInfo("RULE", "Light sensor detected - gone dark - Turn on lights")
#     conservatoryLightsProxy.sendCommand(ON)
# end



# rule "2.30 am turn off lights if i forgot"
# when
#     Time cron "0 30 02 ? * * *"
# then
#     logInfo("RULE", "turn off stuff if i forgot")
#         conservatoryLightsProxy.sendCommand(OFF)
# end


