
from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime

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

    global t1, t2,t3
    if items["zbRouterTimer"] == ON:
        events.sendCommand("CT_FairyLights433Socket","OFF")
        t1 = ScriptExecution.createTimer(DateTime.now().plusSeconds(2), lambda: events.sendCommand("CT_FairyLights433Socket","ON"))
        t2 = ScriptExecution.createTimer(DateTime.now().plusSeconds(4), lambda: events.sendCommand("CT_FairyLights433Socket","OFF"))
        t3 = ScriptExecution.createTimer(DateTime.now().plusSeconds(6), lambda: events.sendCommand("CT_FairyLights433Socket","ON"))


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
# end

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
# end

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
# end