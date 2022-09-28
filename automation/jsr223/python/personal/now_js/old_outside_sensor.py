# from core.rules import rule
# from core.triggers import when
# from core.actions import LogAction
# from core.actions import ScriptExecution
# from java.time import ZonedDateTime as DateTime

# import org.openhab.io.openhabcloud.NotificationAction as NotificationAction


# @rule("outside sensor  startup", description="outside sensor ", tags=["Heating"])
# @when("System started")
# def outside_startup(event):
#     LogAction.logError("outside sensor  startup", "outside sensor  startup")
#     if items["outsideReboots"] == NULL:
#         events.postUpdate(ir.getItem("outsideReboots"), 0)


# t1 = None


# @rule("outside sensor goes offline", description="outside sensor goes offline", tags=["notification"])
# @when("Item Outside_Reachable changed to \"Offline\"")
# def OS_sensor_offline(event):
#     OS_sensor_offline.log.error("outside sensor went offline")
#     NotificationAction.sendNotification("cbattisson@gmail.com", "outside sensor gone offline")

#     global t1
#     if items["outsideReboots"] == NULL:
#         events.postUpdate("ousideReboots", 0)

#     events.sendCommand("outsideSensorPower", "OFF")
#     t1 = ScriptExecution.createTimer(DateTime.now().plusSeconds(15), lambda: events.sendCommand("outsideSensorPower", "ON"))
#     events.postUpdate(ir.getItem("outsideReboots"), items["outsideReboots"].intValue() + 1)


# @rule("outside sensor came online", description="outside sensor came online", tags=["notification"])
# @when("Item Outside_Reachable changed to \"Online\"")
# def OSOnline(event):
#     OSOnline.log.error("outside sensor came online")
#     NotificationAction.sendNotification("cbattisson@gmail.com", "outside sensor came online")

