"""
This script controls conservatory fan rules
"""

from core.rules import rule
from core.triggers import when
from core.actions import ScriptExecution
import org.joda.time.DateTime as DateTime


@rule("conservatory fan_cool rule", description="Handles fan actions", tags=["conservatory", "fan"])
@when("Item CT_Temperature changed")
@when("Item Conservatory_Fan_ON_Setpoint changed")
def conservatory_fan_cool(event):
    conservatory_fan_cool.log.info(">>>>>>>>>>>>>>>>>>conservatory_fan_ cool rulel now")
    setpoint = items["Conservatory_Fan_ON_Setpoint"]
    turnOnTemp = setpoint
    temp = items["CT_Temperature"]
    sp = items["CT_TemperatureSetpoint"]

    conservatory_fan_cool.log.info(">>>>onservatory_fan_ cool rulel CHECKING")
    if temp >= turnOnTemp:
        events.sendCommand("CT_Fan433PowerSocket", "ON")

    if temp < turnOnTemp:
        events.sendCommand("CT_Fan433PowerSocket", "OFF")


# //if conservatory heating in on period
# //then pulse recirc CT_Fan433PowerSocket every n mins
# description and tags are optional

@rule("conservatory fan circulaterule", description="Handles fan actions", tags=["conservatory", "fan"])
@when("Time cron 0/55 * * * * ?")
def conservatory_fan(event):
    conservatory_fan.log.info("conservatory_fan rulel now")
    fanOnSecs = 110
    sp = items["CT_TemperatureSetpoint"]
    currentTemp = items["CT_Temperature"]
    #     if ( (sp >= 20) && (currentTemp < (sp + 0.3)) && (RecircFanEnable.state == ON) )  {
    if ((sp >= 20) and (currentTemp < (sp)) and (items["RecircFanEnable"] == ON)):
        conservatory_fan.log.info("conservatory_fan rulel FAN ON NOW")
        events.sendCommand("CT_Fan433PowerSocket", "ON")
        fan_timer = ScriptExecution.createTimer(DateTime.now().plusSeconds(
            25), lambda: events.sendCommand("CT_Fan433PowerSocket", "OFF"))



# rule "React on Fan Pulse (FanPulseSwitch) change/update"
# when
#     Item FanPulseSwitch changed from OFF to ON
# then
# logInfo("RULE", "Fan pulsed")
@rule("React on Fan Pulse (FanPulseSwitch) change/update", description="React on Fan Pulse (FanPulseSwitch) change/update", tags=["conservatory", "fan"])
@when("Item FanPulseSwitch changed from OFF to ON")
def conservatory_fan_pulse(event):
    conservatory_fan_pulse.log.info("conservatory_fan rulel now")
#     CT_Fan433PowerSocket.sendCommand(ON)
#     CT_Fan433PowerSocket.postUpdate(ON)
    events.sendCommand("CT_Fan433PowerSocket", "ON")

#     createTimer(now.plusSeconds(30), [|
#         {sendCommand(CT_Fan433PowerSocket, OFF)} //CT_Fan433PowerSocket
#         {postUpdate(CT_Fan433PowerSocket, OFF)}
#         logInfo("RULE", "pulse CT_Fan433PowerSocket switch pressed")
#             FanPulseSwitch.postUpdate(OFF)
    fan_pulse_timer = ScriptExecution.createTimer(DateTime.now().plusSeconds(
            25), lambda: events.sendCommand("CT_Fan433PowerSocket", "OFF"))
#     ])

# end


# rule "React on Fan override ON"
# when
#     Item FanOnOverride changed from OFF to ON
# then
#                 //  logInfo("RULE", "--Z")
@rule("React on Fan override ON", description="React on Fan override ON", tags=["conservatory", "fan"])
@when("Item FanOnOverride changed from OFF to ON")
def conservatory_fan_override(event):
    conservatory_fan_override.log.info("conservatory_fan_override")
    #    CT_Fan433PowerSocket.sendCommand(ON)
#     CT_Fan433PowerSocket.postUpdate(ON)
    events.sendCommand("CT_Fan433PowerSocket", "ON")
   
# end

# rule "React on Fan override OFF"
# when
#     Item FanOnOverride changed from ON to OFF
# then
#                 //  logInfo("RULE", "--X")
@rule("React on Fan override OFF", description="React on Fan override OFF", tags=["conservatory", "fan"])
@when("Item FanOnOverride changed from ON to OFF")
def conservatory_fan_override_off(event):
    conservatory_fan_override_off.log.info("conservatory_fan_override off")
    #    CT_Fan433PowerSocket.sendCommand(ON)
#     CT_Fan433PowerSocket.postUpdate(ON)
    events.sendCommand("CT_Fan433PowerSocket", "OFF")
   
#     CT_Fan433PowerSocket.sendCommand(OFF)
#     CT_Fan433PowerSocket.postUpdate(OFF)

# end