from core.jsr223 import scope
from core.actions import NotificationAction #, Mail
from configuration import admin_email, alert_email
from core.jsr223.scope import actions

def send_info(message, logger):
    out = str(message)
    logger.info("[INFO ALERT] {}".format(message))
    NotificationAction.sendNotification(admin_email, out)
    # Mail.sendMail(admin_email, "openHAB Info", out)
    (actions.get("mail", "mail:smtp:gmail").sendMail(admin_email,  "openHAB Info", out))


# def send_alert(message, logger):
#     out = str(message)
#     night = True if scope.items.BridgeLightSensorState == OFF else False#or scope.items.vTimeOfDay == "BED" else False

#     if not night:
#         logger.warning("[ALERT] {}".format(message))
#         NotificationAction.sendBroadcastNotification(out)
#         # Mail.sendMail(alert_email, "", out)
        
#         NotificationAction.sendNotification(admin_email, out)
#         # (actions.get("mail", "mail:smtp:gmail").sendMail(admin_email,  "openHAB Info", out))
#     else:
#         send_info(message)