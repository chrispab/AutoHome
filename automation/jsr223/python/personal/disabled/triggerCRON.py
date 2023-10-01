# from core.rules import rule
# from core.triggers import when
# from core.actions import LogAction
# # import personal.heating_cron_normal_setpoints
# #! force a reload of this file when triggered

# @rule("force a reload", description="force a reload", tags=["Ikea Remote"])
# @when("Item pReloadCRON received update")
# def pReloadCRON(event):
#     LogAction.logWarn("force a reload of this file when triggered", "force vit")
#     import personal.heating_cron_normal_setpoints
#     reload(personal.heating_cron_normal_setpoints)
#     import personal.heating_cron_normal_setpoints
