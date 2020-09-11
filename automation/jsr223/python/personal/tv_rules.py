"""
This example shows two methods of using timers in rules.
"""

from core.rules import rule
from core.triggers import when

# Example using Python threading.Time
from threading import Timer
chargerTimer1 = None

from core.actions import ScriptExecution
import org.joda.time.DateTime as DateTime

timerStart = None
timer1 = None
timer2 = None
timer3 = None
IRTimer = None

IRTimer2 = None
timer4 = None
timer5 = None
timer6 = None

# var shutDownWaitTime = 20 //wait for pi shutdown in secs, before turning off power socket


# //FrontRoom Pi Kodi and TV on/off control

@rule("System started - set all rooms TV settings", description="System started - set all rooms TV settings", tags=["tv"])
@when("System started")
def tvs_init(event):
    tvs_init.log.info("tvs_init")
    events.postUpdate("BridgeLightSensorState", "OFF")
    global timerStart
    if timerStart == None:
        timerStart = ScriptExecution.createTimer(DateTime.now().plusSeconds(5),
        lambda:
            tvs_init.log.info("TV.rules Executing 'System started' rule for ALL rooms -  TV Initialize uninitialized virtual Items")
        )
        if items["vFR_TVKodi"] == NULL:
            events.postUpdate("vFR_TVKodi", "OFF")#// set power up val
            tvs_init.log.info("TV.rules System started rule, change front room tv power state from NULL to OFF")   
        if items["vBR_TVKodi"] == NULL:
            events.postUpdate("vBR_TVKodi", "OFF")#// set power up val
            tvs_init.log.info("System started' rule, change bedroom tv power state from NULL to OFF")
        if items["vCT_TVKodiSpeakers"] == NULL:
            events.postUpdate("vCT_TVKodiSpeakers", "OFF")#// set power up val
            tvs_init.log.info("'System started' rule, change conservatory tv power state from NULL to OFF")


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

# //Conservatory Pi Kodi and TV on/off control
# rule "Turn ON conservatory Kodi-Pi, TV and soundbar"
# when
#     // Item vCT_TVKodiSpeakers changed from OFF to ON
#         Item vCT_TVKodiSpeakers received update ON
#         or
#         Item vCT_TVKodiSpeakers2 received update ON
# then
#     logInfo("RULE", "Turn ON the Conservatory Kodi, pi and speakers")
#     shutdownKodiConservatoryProxy.postUpdate(ON)
# 		// say("Turning on Conservatory TV","voicerss:enGB","chromecast:chromecast:GHM_Conservatory", new PercentType(70))

#     //check if a shutdown timer is running - then stop it before turning stuff on
#     if(timer2 !== None) {
#         timer2 = None
#     }
#     IRTimer = createTimer(now.plusSeconds(20), [| 
#             logInfo("tv rules", "turn ON amp from standby")
#             amplifierStandby.sendCommand(ON)
#             amplifierStandby.postUpdate(ON)   
#             IRTimer = None
#         ])
#     IRTimer2 = createTimer(now.plusSeconds(30), [| 
#         logInfo("tv rules", "turn ON amp from standby")
#         amplifiervideo1.sendCommand(ON)
#         amplifiervideo1.postUpdate(ON)   
#         IRTimer2 = None
#     ])
#     {sendCommand(CT_TV433PowerSocket, ON)} //tv
#     {postUpdate(CT_TV433PowerSocket, ON)}
#     {sendCommand(CT_Soundbar433PowerSocket, ON)} // CT_Soundbar433PowerSocket
#     {postUpdate(CT_Soundbar433PowerSocket, ON)} 

# end


# rule "Turn OFF conservatory Kodi-Pi, TV and soundbar"
# when
#     // Item vCT_TVKodiSpeakers changed from ON to OFF
#     // or
#     // Item vCT_TVKodiSpeakers2 changed from ON to OFF

#          Item vCT_TVKodiSpeakers received update OFF
#         or
#         Item vCT_TVKodiSpeakers2 received update OFF           // Item vCT_TVKodiSpeakers received update OFF

# then
#     logInfo("RULE", "Turn OFF Conservatory kodi, pi then TV and speakers")
# 		// say("Turning off Conservatory TV","voicerss:enGB","chromecast:chromecast:GHM_Conservatory", new PercentType(70))

#     shutdownKodiConservatoryProxy.postUpdate(OFF)
#             amplifierStandby.sendCommand(OFF)
#             amplifierStandby.postUpdate(OFF)  
#     if(timer2 === None) {
#         timer2 = createTimer(now.plusSeconds(shutDownWaitTime)) [| // give time for pi kodi to shut down
#             logInfo("RULE", shutDownWaitTime + " secs later - we can turn off power sockets now")
#             {sendCommand(CT_TV433PowerSocket, OFF)} //tv
#             {postUpdate(CT_TV433PowerSocket, OFF)}
#             {sendCommand(CT_Soundbar433PowerSocket, OFF)} // CT_Soundbar433PowerSocket
#             {postUpdate(CT_Soundbar433PowerSocket, OFF)}

 
#             timer2 = None]
#     }
# end


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
