# # from personal.util import send_info
# from core.rules import rule
# from core.triggers import when
# # from org.eclipse.smarthome.core.library.types import PercentType
# from core.actions import PersistenceExtensions
# from core.actions import ScriptExecution
# from core.actions import LogAction
# from java.time import ZonedDateTime as DateTime

# # var Boolean CLightsAreOn = false
# import personal.util
# reload(personal.util)


# # @rule("PIRsensor change", description="PIRsensor change", tags=["pir"])
# # @when("Item pir01_occupancy received update")
# # @when("Item pir02_occupancy received update")
# # def pir_change(event):
# #    pir_change.log.debug("!!!!!!!!!!!!!!!!pir_occupancy received update item : " + event.itemName + ", PREV: " + "PersistenceExtensions.previousState(ir.getItem(event.itemName), True)" + ", NOW: " + event.itemState.toString())


# # lights_timeout = 120
# pir01_off_timer = None
# pir02_off_timer = None


# @rule("pir01 or 02 Turn ON lights", description="PIRsensor change", tags=["pir"])
# @when("Item pir01_occupancy received update ON")
# @when("Item pir02_occupancy received update ON")
# def pir_light_on(event):
#     pir_light_on.log.debug("pir_occupancy received update. item : " + event.itemName + ": " +
#     event.itemState.toString() + ": " + items["pir01_illuminance_lux"].toString())

#     global pir01_off_timer
#     global pir02_off_timer

#     if items["BridgeLightSensorLevel"] < items["ConservatoryLightTriggerLevel"] :
#         if items["pir01_occupancy"] == ON:
#             events.sendCommand("KT_light_1_Power", "ON")
#             pir_light_on.log.debug("rxed pir01_occupancy ON ")
#             if pir01_off_timer is not None and not pir01_off_timer.hasTerminated():
#                 pir01_off_timer.cancel()
#                 pir_light_on.log.debug("CANCEL     STOP running pir01_off_timer")

#         if items["pir02_occupancy"] == ON:
#             events.sendCommand("KT_light_2_Power", "ON")
#             events.sendCommand("KT_light_3_Power", "ON")
#             if pir02_off_timer is not None and not pir02_off_timer.hasTerminated():
#                 pir02_off_timer.cancel()
#                 pir_light_on.log.debug("CANCEL     STOP running pir02_off_timer")
#         # ! also stop any currently running lighht off timers


# @rule("PIRsensor Turn OFF lights", description="PIRsensor Turn OFF lights", tags=["pir"])
# @when("Item pir01_occupancy changed from ON to OFF") # or
# @when("Item pir02_occupancy changed from ON to OFF")
# def pir_light_off(event):
#     pir_light_off.log.debug("///// pir_occupancy_off, triggering item : " + event.itemName + " : " + event.itemState.toString())

#     global pir01_off_timer
#     global pir02_off_timer

#     if event.itemName == "pir01_occupancy":
#         pir_light_off.log.debug("pir01_occupancy: STARTING TIMER KT_light_1_Power: OFF, off timer is: " + items["KT_cupboard_lights_timeout"].toString())
#         pir01_off_timer = ScriptExecution.createTimer(DateTime.now().plusSeconds(items["KT_cupboard_lights_timeout"].intValue()), lambda: pir01_off_body())

#     if event.itemName == "pir02_occupancy":
#     # if event.itemName == "pir01_occupancy":
#         pir_light_off.log.debug("pir02_occupancy : STARTING TIMER  KT_light_2&3_Power: OFF , off timer is: " + items["KT_cupboard_lights_timeout"].toString())
#         pir02_off_timer = ScriptExecution.createTimer(DateTime.now().plusSeconds(items["KT_cupboard_lights_timeout"].intValue()), lambda: pir02_off_body())

# def pir_off_body():
#     if items["pir01_occupancy"] == OFF and items["pir02_occupancy"] == OFF:
#         events.sendCommand("gKT_WiFiLightsPower", "OFF")

# def pir01_off_body():
#     # pir_light_off.log.error("pir01_occupancy_off body : KT_light_1_Power: OFF ")
#     LogAction.logDebug("pir01_occupancy_off", "pir01_occupancy_off body : KT_light_1_Power: OFF ")
#     events.sendCommand("KT_light_1_Power", "OFF")

# def pir02_off_body():
#     # pir_light_off.log.error("pir02_occupancy_off body : KT_light_2_Power: OFF ")
#     LogAction.logDebug("pir02_occupancy_off", "pir02_occupancy_off body : KT_light_2_Power: OFF ")
#     events.sendCommand("KT_light_2_Power", "OFF")
#     events.sendCommand("KT_light_3_Power", "OFF")
