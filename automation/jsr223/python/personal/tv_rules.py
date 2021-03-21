

from core.actions import ScriptExecution
from core.rules import rule
from core.triggers import when
from java.time import ZonedDateTime as DateTime


# voice support
from core.actions import Voice


chargerTimer1 = None


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
tStartup = None

@rule("System started - set all rooms TV startup settings", description="System started - set all rooms TV settings", tags=["tv"])
@when("System started")
def tvs_init(event):
    tvs_init.log.info("System started - set all rooms TV startup settings")
    events.postUpdate("BridgeLightSensorState", "OFF")
    global tStartup
    if tStartup is None:
        tStartup = ScriptExecution.createTimer(DateTime.now().plusSeconds(5), lambda: tv_startup_tbody())

def tv_startup_tbody():
    tvs_init.log.info(
        "TV.rules Executing 'System started' rule for ALL Kodi's and TVs -  Kodi, TVs Initialize uninitialized virtual Items")
    if items["vFR_TVKodi"] == NULL:
        events.postUpdate("vFR_TVKodi", "OFF")  # // set power up val
        tvs_init.log.info("TV.rules System started rule, change front room tv power state from NULL to OFF")
    if items["vBR_TVKodi"] == NULL:
        events.postUpdate("vBR_TVKodi", "OFF")  # // set power up val
        tvs_init.log.info("System started' rule, change bedroom tv power state from NULL to OFF")
    if items["vCT_TVKodiSpeakers"] == NULL:
        events.postUpdate("vCT_TVKodiSpeakers", "OFF")  # // set power up val
        tvs_init.log.info("'System started' rule, change conservatory tv power state from NULL to OFF")
    if items["vAT_TVKodi"] == NULL:
        events.postUpdate("vAT_TVKodi", "OFF")  # // set power up val
        tvs_init.log.info("TV.rules System started rule, change Attic TV and kodi power state from NULL to OFF")


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
    events.sendCommand("CT_pi_kodi_bg_wifisocket_1_power", "ON")


    if t_tvPowerOff is not None:
        t_tvPowerOff = None

    t_ampStandbyON = ScriptExecution.createTimer(DateTime.now().plusSeconds(45), lambda: events.sendCommand("amplifierStandby", "ON"))
    t_ampVideo01 = ScriptExecution.createTimer(DateTime.now().plusSeconds(50), lambda: events.sendCommand("amplifiervideo1", "ON"))


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
    events.sendCommand("CT_pi_kodi_bg_wifisocket_1_power", "OFF")

    t_tvPowerOff = None




# Bedroom Pi Kodi and TV on/off control
@rule("bedroom Pi Kodi and TV", description="bedroom Pi Kodi and TV", tags=["tv"])
@when("Item vBR_TVKodi received update ON")
def bedroom_tv_on(event):
    global t_tvPowerOff
    bedroom_tv_on.log.info("bedroom_tv_on")
    Voice.say("Turning on Bedroom TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))

    events.postUpdate("shutdownKodiBedroomProxy", "ON")

    events.sendCommand("wifi_socket_3_power", "ON")

#     //check if a shutdown timer is running - then stop it before turning stuff on
    if t_tvPowerOff is not None:
        t_tvPowerOff = None



#
t_brtvPowerOff=None
@rule("Turn OFF bedroom Kodi-Pi, TV", description="System started - set all rooms TV settings", tags=["tv"])
@when("Item vBR_TVKodi received update OFF")
def bedroom_tv_off(event):
    bedroom_tv_off.log.info("bedroom_tv_off")
    global t_brtvPowerOff

    Voice.say("Turning off Bedroom TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))
    events.postUpdate("shutdownKodiBedroomProxy", "OFF")

    if t_brtvPowerOff is None:
        t_brtvPowerOff = ScriptExecution.createTimer(DateTime.now().plusSeconds(30), lambda: brtvoffbody())


def brtvoffbody():
    global t_brtvPowerOff
    events.sendCommand("wifi_socket_3_power", "OFF")
    # events.sendCommand("CT_Soundbar433PowerSocket", "OFF")
    t_brtvPowerOff = None




# Bedroom Pi Kodi and TV on/off control
@rule("Turn ON FrontRoom Kodi-Pi, TV", description="Turn ON FrontRoom Kodi-Pi, TV", tags=["tv"])
@when("Item vFR_TVKodi received update ON")
def FR_tv_on(event):
    global t_frtvPowerOff
    FR_tv_on.log.info("FR_tv_on")
    # Voice.say("Turning on front room TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))

    events.postUpdate("shutdownKodiFrontRoomProxy", "ON")
#     //check if a shutdown timer is running - then stop it before turning stuff on
    if t_frtvPowerOff is not None:
        t_frtvPowerOff = None
    events.sendCommand("wifi_socket_2_power", "ON")


t_frtvPowerOff=None
@rule("Turn OFF FrontRoom Kodi-Pi, TV", description="System started - set all rooms TV settings", tags=["tv"])
@when("Item vFR_TVKodi changed from ON to OFF")
def fr_tv_off(event):
    fr_tv_off.log.info("front room_tv_off")
    global t_frtvPowerOff

    Voice.say("Turning off front room TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))
    events.postUpdate("shutdownKodiFrontRoomProxy", "OFF")
    # events.sendCommand("amplifierStandby", "OFF")

    if t_frtvPowerOff is None:
        t_frtvPowerOff = ScriptExecution.createTimer(DateTime.now().plusSeconds(30), lambda: frtvoffbody())


def frtvoffbody():
    global t_frtvPowerOff
    events.sendCommand("wifi_socket_2_power", "OFF")
    # events.sendCommand("CT_Soundbar433PowerSocket", "OFF")
    t_frtvPowerOff = None



# ! Attic TV
@rule("Turn ON Attic Kodi-Pi, TV", description="Turn ON Attic Kodi-Pi, TV", tags=["tv"])
@when("Item vAT_TVKodi received update ON")
def AT_tv_on(event):
    global t_attvPowerOff
    AT_tv_on.log.info("AT_tv_on")
    Voice.say("Turning on attic TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))

    events.postUpdate("shutdownKodiAtticProxy", "ON")
#     //check if a shutdown timer is running - then stop it before turning stuff on
    if t_attvPowerOff is not None:
        t_attvPowerOff = None
    events.sendCommand("wifi_socket_5_power", "ON")


t_attvPowerOff=None
@rule("Turn OFF Attic Kodi-Pi, TV", description="System started - set all rooms TV settings", tags=["tv"])
@when("Item vAT_TVKodi changed from ON to OFF")
def AT_tv_off(event):
    AT_tv_off.log.info("attic_tv_off")
    global t_attvPowerOff

    Voice.say("Turning off attic TV", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(50))
    events.postUpdate("shutdownKodiAtticProxy", "OFF")
    # events.sendCommand("amplifierStandby", "OFF")

    #if the power switch socket is ON then we are OK to do the shutdown routine
    #if items["wifi_socket_5_power"] == ON:
    if t_attvPowerOff is None: #shutdown timer is not currently running
        t_attvPowerOff = ScriptExecution.createTimer(DateTime.now().plusSeconds(30), lambda: attvoffbody())


def attvoffbody():
    global t_attvPowerOff
    events.sendCommand("wifi_socket_5_power", "OFF")
    # events.sendCommand("CT_Soundbar433PowerSocket", "OFF")
    t_attvPowerOff = None

