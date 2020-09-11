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
