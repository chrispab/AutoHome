
from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime

import org.openhab.io.openhabcloud.NotificationAction as NotificationAction


# rule "zone3 lights on"
# when
#     Item Zone3LightStatus changed from OFF to ON
# then
#     sendNotification("cbattisson@gmail.com", "Zone 3 light on")
#     logInfo("RULE", "Zone 3 lights - on")

#     if (CT_FairyLights433Socket.state == ON) {
#         CT_FairyLights433Socket.sendCommand(OFF)
#         createTimer(now.plusSeconds(2), [|CT_FairyLights433Socket.sendCommand(ON)])
#         createTimer(now.plusSeconds(4), [|CT_FairyLights433Socket.sendCommand(OFF)])
#         createTimer(now.plusSeconds(6), [|CT_FairyLights433Socket.sendCommand(ON)])
#     }
# end
t1 = None
t3 = None
t2 = None


@rule("zone3 lights on", description="zone3 lights on", tags=["notification"])
@when("Item Zone3LightStatus changed from OFF to ON")
def zone3lightson(event):
    zone3lightson.log.warn("zone3 lights o")
    NotificationAction.sendNotification("cbattisson@gmail.com","Zone 3 light on")

    global t1, t2, t3
    if items["CT_FairyLights433Socket"] == ON:
        events.sendCommand("CT_FairyLights433Socket", "OFF")
        t1 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))
        t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("CT_FairyLights433Socket", "OFF"))
        t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))


# rule "Zone 1 went Offline"
# when
#     Item Zone1Reachable changed to "Offline"
# then
#     tableLamp1.sendCommand(OFF)
#     sendNotification("cbattisson@gmail.com", "Zone 1 went offline")
#     logInfo("RULE", "Zone 1 went Offline")
#     if (tableLamp1.state == ON) {
#         tableLamp1.sendCommand(OFF)
#         createTimer(now.plusSeconds(2), [|CT_FairyLights433Socket.sendCommand(ON)])
#     //     val Timer t2 = createTimer(now.plusSeconds(4), [|CT_FairyLights433Socket.sendCommand(OFF)])
#     //     val Timer t3 = createTimer(now.plusSeconds(6), [|CT_FairyLights433Socket.sendCommand(ON)])
#     }
t4 = None


@rule("Zone 1 went Offline", description="Zone 1 went Offline", tags=["notification"])
@when("Item Zone1Reachable changed to \"Offline\"")
def zone1WentOffline(event):
    zone1WentOffline.log.warn("Zone 1 went Offline")
    NotificationAction.sendNotification("cbattisson@gmail.com","Zone 1 went offline")

    global t4
    if items["tableLamp1.state"] == ON:
        events.sendCommand("tableLamp1", "OFF")
        t4 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))
        # t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("CT_FairyLights433Socket","OFF"))
        # t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("CT_FairyLights433Socket","ON"))


# rule "Zone 1 came Online"
# when
#     Item Zone1Reachable changed to "Online"
# then
#     tableLamp1.sendCommand(OFF)
#     sendNotification("cbattisson@gmail.com", "Zone 1 came Online")
#     logInfo("RULE", "Zone 1 came Online")
#     if (tableLamp1.state == ON) {
#         tableLamp1.sendCommand(OFF)
#         createTimer(now.plusSeconds(2), [|CT_FairyLights433Socket.sendCommand(ON)])
#         // val Timer t2 = createTimer(now.plusSeconds(4), [|CT_FairyLights433Socket.sendCommand(OFF)])
#         // val Timer t3 = createTimer(now.plusSeconds(6), [|CT_FairyLights433Socket.sendCommand(ON)])
#     }
# end
t5 = None


@rule("Zone 1 came Online", description="Zone 1 came Online", tags=["notification"])
@when("Item Zone1Reachable changed to \"Online\"")
def zone1WentOnline(event):
    zone1WentOnline.log.warn("Zone 1 went Online")
    NotificationAction.sendNotification("cbattisson@gmail.com","Zone 1 came Online")

    global t5
    if items["tableLamp1.state"] == ON:
        events.sendCommand("tableLamp1", "OFF")
        t5 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))
        # t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("CT_FairyLights433Socket","OFF"))
        # t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("CT_FairyLights433Socket","ON"))


# rule "zone3 went Offline"
# when
#     Item Zone3Reachable changed to "Offline"
# then
#     tableLamp1.sendCommand(OFF)
#     sendNotification("cbattisson@gmail.com", "zone3 went offline")
#     logInfo("RULE", "Z3 went Offline")
#     if (tableLamp1.state == ON) {
#         tableLamp1.sendCommand(OFF)
#         createTimer(now.plusSeconds(2), [|CT_FairyLights433Socket.sendCommand(ON)])
#         // val Timer t2 = createTimer(now.plusSeconds(4), [|CT_FairyLights433Socket.sendCommand(OFF)])
#         // val Timer t3 = createTimer(now.plusSeconds(6), [|CT_FairyLights433Socket.sendCommand(ON)])
#     }
t6 = None


@rule("Zone 3 went Offline", description="Zone 3 went Offline", tags=["notification"])
@when("Item Zone3Reachable changed to \"Offline\"")
def zone3WentOffline(event):
    zone3WentOffline.log.warn("Zone 1 went Offline")
    NotificationAction.sendNotification("cbattisson@gmail.com","zone3 went offline")

    global t6
    if items["tableLamp1.state"] == ON:
        events.sendCommand("tableLamp1", "OFF")
        t4 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))
        # t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("CT_FairyLights433Socket","OFF"))
        # t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("CT_FairyLights433Socket","ON"))


# rule "zone3 came Online"
# when
#     Item Zone3Reachable changed to "Online"
# then
#     tableLamp1.sendCommand(OFF)
#     sendNotification("cbattisson@gmail.com", "Zone 3 came Online")
#     logInfo("RULE", "Zone 3 came Online")
#     if (tableLamp1.state == ON) {
#         tableLamp1.sendCommand(OFF)
#         createTimer(now.plusSeconds(2), [|CT_FairyLights433Socket.sendCommand(ON)])
#         // val Timer t2 = createTimer(now.plusSeconds(4), [|CT_FairyLights433Socket.sendCommand(OFF)])
#         // val Timer t3 = createTimer(now.plusSeconds(6), [|CT_FairyLights433Socket.sendCommand(ON)])
#     }
t7 = None


@rule("Zone 3 came Online", description="Zone 3 came Online", tags=["notification"])
@when("Item Zone3Reachable changed to \"Online\"")
def zone3WentOnline(event):
    zone3WentOnline.log.warn("Zone 3 went Online")
    NotificationAction.sendNotification("cbattisson@gmail.com","Zone 3 came Online")

    global t7
    if items["tableLamp1.state"] == ON:
        events.sendCommand("tableLamp1", "OFF")
        t5 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))
        # t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("CT_FairyLights433Socket","OFF"))
        # t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("CT_FairyLights433Socket","ON"))

