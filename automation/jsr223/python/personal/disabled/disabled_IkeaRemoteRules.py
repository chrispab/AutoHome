# from core.rules import rule
# from core.triggers import when


# @rule("ikea remote testing", description="Handles ike remote actions", tags=["Ikea Remote"])
# @when("Item ZbRemote01Action received update")
# def ikea_remote(event):
#     ikea_remote.log.info("IKEA remote  TEST")
#     ikea_remote.log.info("Remote01 rules==> Value: " + event.itemState.toString())

#     if event.itemState.toString() == "toggle":
#         ikea_remote.log.info("Remote01 TOGGLED *********")
#         ikea_remote.log.info(
#             "BULB STATE : " + items["ZbColourBulb01Switch"].toString())
#         if items["ZbColourBulb01Switch"] == ON:
#             events.sendCommand("ZbColourBulb01Switch", "OFF")
#             ikea_remote.log.info("IKEAREMOTE        BULB OFF")
#         else:
#             events.sendCommand("ZbColourBulb01Switch", "ON")
#             ikea_remote.log.info("IKEAREMOTE        BULB ON")
