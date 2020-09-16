"""
This example shows two methods of using timers in rules.
"""
# Example using Python threading.Time
# from threading import Timer

import org.joda.time.DateTime as DateTime
from core.actions import ScriptExecution
from core.rules import rule
from core.triggers import when


# voice support
from org.eclipse.smarthome.core.library.types import PercentType
from core.actions import Voice


chargerTimer1 = None


tStartup = None
timer1 = None
t_shutdown = None
timer3 = None
IRTimer = None

IRTimer2 = None
timer4 = None
timer5 = None
timer6 = None

t_ampStandbyON = None

t_tvPowerOff = None

# var shutDownWaitTime = 20 //wait for pi shutdown in secs, before turning off power socket


def tv_startup_tbody():
    tvs_init.log.info(
        "TV.rules Executing 'System started' rule for ALL rooms -  TV Initialize uninitialized virtual Items")
    if items["vFR_TVKodi"] == NULL:
        events.postUpdate("vFR_TVKodi", "OFF")  # // set power up val
        tvs_init.log.info("TV.rules System started rule, change front room tv power state from NULL to OFF")
    if items["vBR_TVKodi"] == NULL:
        events.postUpdate("vBR_TVKodi", "OFF")  # // set power up val
        tvs_init.log.info("System started' rule, change bedroom tv power state from NULL to OFF")
    if items["vCT_TVKodiSpeakers"] == NULL:
        events.postUpdate("vCT_TVKodiSpeakers", "OFF")  # // set power up val
        tvs_init.log.info("'System started' rule, change conservatory tv power state from NULL to OFF")


# //FrontRoom Pi Kodi and TV on/off control
@rule("System started - set all rooms TV settings", description="System started - set all rooms TV settings", tags=["tv"])
@when("System started")
def tvs_init(event):
    tvs_init.log.info("tvs_init")
    events.postUpdate("BridgeLightSensorState", "OFF")
    global tStartup
    if tStartup is None:
        tStartup = ScriptExecution.createTimer(DateTime.now().plusSeconds(5), lambda: tv_startup_tbody())


# rule "Turn ON FrontRoom Kodi-Pi, TV and soundbar"
# when
#     Item vFR_TVKodi received update ON
# then
#     logInfo("RULE", "Turn ON the FrontRoom Kodi, pi and speakers")
#     shutdownKodiFrontRoomProxy.postUpdate(ON)

#             //check if a shutdown timer is running - then stop it before turning stuff on
#     if(timer1 !== None) {
#         timer1 = None
#     }
#     WiFiSocket2Power.sendCommand(ON)
#     WiFiSocket2Power.postUpdate(ON)

# end

# rule "Turn OFF FrontRoom Kodi-Pi, TV and soundbar"
# when
#     Item vFR_TVKodi changed from ON to OFF
# then
#     logInfo("RULE", "Turn OFF FrontRoom kodi, pi and TV Kit")
#     shutdownKodiFrontRoomProxy.postUpdate(OFF)

#     if(timer1 === None) {
#         timer1 = createTimer(now.plusSeconds(shutDownWaitTime)) [| // give time for pi kodi to shut down
#         logInfo("RULE", "n secs later - we can turn off power sockets now")
#         WiFiSocket2Power.sendCommand(OFF)
#         WiFiSocket2Power.postUpdate(OFF)
#         timer1 = None]
#     }
# end

t_ampStandbyON = None
t_ampVideo01 = None


# //Conservatory Pi Kodi and TV on/off control
@rule("Conservatory Pi Kodi and TV amp on", description="System started - set all rooms TV settings", tags=["tv"])
@when("Item vCT_TVKodiSpeakers received update ON")
@when("Item vCT_TVKodiSpeakers2 received update ON")
def conservatory_tv_on(event):
    global t_tvPowerOff
    conservatory_tv_on.log.info("conservatory_tv_on")

    events.postUpdate("shutdownKodiConservatoryProxy", "ON")

    events.sendCommand("CT_TV433PowerSocket", "ON")
    events.sendCommand("CT_Soundbar433PowerSocket", "ON")

#     //check if a shutdown timer is running - then stop it before turning stuff on
    if t_tvPowerOff is not None:
        t_tvPowerOff = None

    t_ampStandbyON = ScriptExecution.createTimer(DateTime.now().plusSeconds(30), lambda: events.sendCommand("amplifierStandby", "ON"))
    t_ampVideo01 = ScriptExecution.createTimer(DateTime.now().plusSeconds(40), lambda: events.sendCommand("amplifiervideo1", "ON"))


@rule("Conservatory Pi Kodi and TV amp off", description="System started - set all rooms TV settings", tags=["tv"])
@when("Item vCT_TVKodiSpeakers received update OFF")
@when("Item vCT_TVKodiSpeakers2 received update OFF")
def conservatory_tv_off(event):
    conservatory_tv_off.log.info("conservatory_tv_off")
    global t_tvPowerOff

    Voice.say("Turning off Conservatory TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))
    events.postUpdate("shutdownKodiConservatoryProxy", "OFF")
    events.sendCommand("amplifierStandby", "OFF")

    if t_tvPowerOff is None:
        t_tvPowerOff = ScriptExecution.createTimer(DateTime.now().plusSeconds(30), lambda: tvoffbody())


def tvoffbody():
    events.sendCommand("CT_TV433PowerSocket", "OFF")
    events.sendCommand("CT_Soundbar433PowerSocket", "OFF")
    t_tvPowerOff = None


# //Bedroom Pi Kodi and TV on/off control
# rule "Turn ON bedroom Kodi-Pi, TV and soundbar"
# when
#     Item vBR_TVKodi received update ON
# then
#     logInfo("RULE", "Turn ON the bedroom Kodi, pi")
#     shutdownKodiBedroomProxy.postUpdate(ON)
# 		say("Turning on Bedroom TV","voicerss:enGB","chromecast:chromecast:GHM_Conservatory", new PercentType(70))

#         //check if a shutdown timer is running - then stop it before turning stuff on
#     if(timer3 !== None) {
#         timer3 = None
#     }
#     WiFiSocket3Power.sendCommand(ON)
#     WiFiSocket3Power.postUpdate(ON)
# end


# rule "Turn OFF bedroom Kodi-Pi, TV and soundbar"
# when
#     Item vBR_TVKodi changed from ON to OFF
# then
#     logInfo("RULE", "Turn OFF bedroom kodi, pi and TV Kit")
# 		say("Turning off Bedroom TV","voicerss:enGB","chromecast:chromecast:GHM_Conservatory", new PercentType(70))

#     shutdownKodiBedroomProxy.postUpdate(OFF)

#     if(timer3 === None) {
#         timer3 = createTimer(now.plusSeconds(shutDownWaitTime)) [| // give time for pi kodi to shut down
#         logInfo("RULE", "n secs later - we can turn off bedroom tv and kodi power socket now")
#         WiFiSocket3Power.sendCommand(OFF)
#         WiFiSocket3Power.postUpdate(OFF)
#         timer3 = None]}
# end
