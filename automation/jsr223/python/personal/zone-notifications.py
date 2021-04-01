
from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from java.time import ZonedDateTime as DateTime

import org.openhab.io.openhabcloud.NotificationAction as NotificationAction

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
        events.sendCommand("gZbColourBulbs", "OFF")
        t1 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("gZbColourBulbs", "ON"))
        t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("gZbColourBulbs", "OFF"))
        t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("gZbColourBulbs", "ON"))



t4 = None


@rule("Zone 1 went Offline", description="Zone 1 went Offline", tags=["notification"])
@when("Item Zone1Reachable changed to \"Offline\"")
def zone1WentOffline(event):
    zone1WentOffline.log.warn("Zone 1 went Offline")
    NotificationAction.sendNotification("cbattisson@gmail.com","Zone 1 went offline")

    global t4
    if items["tableLamp1"] == ON:
        events.sendCommand("tableLamp1", "OFF")
        t4 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))
        # t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("CT_FairyLights433Socket","OFF"))
        # t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("CT_FairyLights433Socket","ON"))



t5 = None


@rule("Zone 1 came Online", description="Zone 1 came Online", tags=["notification"])
@when("Item Zone1Reachable changed to \"Online\"")
def zone1WentOnline(event):
    zone1WentOnline.log.warn("Zone 1 went Online")
    NotificationAction.sendNotification("cbattisson@gmail.com","Zone 1 came Online")

    global t5
    if items["tableLamp1"] == ON:
        events.sendCommand("tableLamp1", "OFF")
        t5 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))
        # t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("CT_FairyLights433Socket","OFF"))
        # t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("CT_FairyLights433Socket","ON"))


t6 = None


@rule("Zone 3 went Offline", description="Zone 3 went Offline", tags=["notification"])
@when("Item Zone3Reachable changed to \"Offline\"")
def zone3WentOffline(event):
    zone3WentOffline.log.warn("Zone 1 went Offline")
    NotificationAction.sendNotification("cbattisson@gmail.com","zone3 went offline")

    global t6
    if items["tableLamp1"] == ON:
        events.sendCommand("tableLamp1", "OFF")
        t6 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))
        # t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("CT_FairyLights433Socket","OFF"))
        # t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("CT_FairyLights433Socket","ON"))



t7 = None


@rule("Zone 3 came Online", description="Zone 3 came Online", tags=["notification"])
@when("Item Zone3Reachable changed to \"Online\"")
def zone3WentOnline(event):
    zone3WentOnline.log.warn("Zone 3 went Online")
    NotificationAction.sendNotification("cbattisson@gmail.com","Zone 3 came Online")

    global t7
    if items["tableLamp1"] == ON:
        events.sendCommand("tableLamp1", "OFF")
        t7 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket", "ON"))
        # t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("CT_FairyLights433Socket","OFF"))
        # t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("CT_FairyLights433Socket","ON"))

