
from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from java.time import ZonedDateTime as DateTime

import org.openhab.io.openhabcloud.NotificationAction as NotificationAction
import time
t1 = None
t3 = None
t2 = None


@rule("zone3 lights on", description="zone3 lights on", tags=["notification"])
@when("Item Zone3LightStatus changed from OFF to ON")
@when("Item Zone3LightStatusAlt changed from OFF to ON")
def zone3lightson(event):
    zone3lightson.log.warn("zone3 lights o")
    NotificationAction.sendNotification("cbattisson@gmail.com","Zone 3 light on")

    global t1, t2, t3
    if items["gColourBulbs"] == ON:
        cycle_len = 5 #secs
        for x in range(0, 360, 15):
            events.sendCommand("gZbColourBulbsColour", str(x) + ",100,100")
            # time.sleep((cycle_len/360)*100)
            time.sleep(0.1)

        events.sendCommand("gZbColourBulbsColour", "0,100,100")
        # events.sendCommand("gColourBulbs", "ON")

        # ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("gZbColourBulbsColour", "120,100,100"))


        # ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("gZbColourBulbsColour", "240,100,100"))

        # ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("gZbColourBulbsColour", "0,100,100"))


    else:
        #0=red, 120=green, 240=blue, 360=red
        #https://community.openhab.org/t/ikea-tradfri-rgb-lights/35551/16
    #       var DecimalType hue = new DecimalType(hsb.hue.intValue % 360 + 10) // 0-360; 0=red, 120=green, 240=blue, 360=red(again)
    #   var PercentType sat = new PercentType(hsb.saturation.intValue) // 0-100
    #   var PercentType bright = new PercentType(hsb.brightness.intValue) // 0-100
    #   var HSBType newHsb = new HSBType(hue,sat,bright)
        events.sendCommand("gZbColourBulbsColour", "0,100,100")
        events.sendCommand("gColourBulbs", "ON")

        ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("gZbColourBulbsColour", "120,100,100"))

        ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("gZbColourBulbsColour", "240,100,100"))

        t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("gColourBulbs", "OFF"))
        ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("gZbColourBulbsColour", "0,100,100"))


    #####

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

