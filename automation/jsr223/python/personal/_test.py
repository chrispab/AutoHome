from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from java.time import ZonedDateTime as DateTime

import org.openhab.io.openhabcloud.NotificationAction as NotificationAction


@rule("outside sensor  startup", description="outside sensor ", tags=["Heating"])
@when("System started")
def outside_startup(event):
    LogAction.logError("outside senso r  startup", "outside sensor  startup")
    if items["outsideReboots"] == NULL:
        # items["ousideReboots"] = DecimalType(0)
        events.postUpdate(ir.getItem("outsideReboots"), 0)


t1 = None


@rule("outside sensor goes offline", description="outside sensor goes offline", tags=["notification"])
@when("Item Outside_Reachable changed to \"Offline\"")
def OS_sensor_offline(event):
    OS_sensor_offline.log.warn("outside sensor goes offline")
    NotificationAction.sendNotification("cbattisson@gmail.com", "outside sensor gone offline")

    global t1
    if items["outsideReboots"] == NULL:
        # items["ousideReboots"] = 0
        events.postUpdate("ousideReboots", 0)

    # if items["tableLamp1.state"] == ON:
    events.sendCommand("outsideSensorPower", "OFF")
    t1 = ScriptExecution.createTimer(DateTime.now().plusSeconds(15), lambda: events.sendCommand("outsideSensorPower", "ON"))
    events.postUpdate(ir.getItem("outsideReboots"), items["outsideReboots"].intValue() + 1)
    # events.postUpdate(ir.getItem("outsideReboots"), 0)


@rule("outside sensor came online", description="outside sensor came online", tags=["notification"])
@when("Item Outside_Reachable changed to \"Online\"")
def OSOnline(event):
    OSOnline.log.warn("outside sensor came onlinee")
    NotificationAction.sendNotification("cbattisson@gmail.com", "outside sensor came online")

# import java.util.List
# import java.io.File
# import java.io.BufferedReader
# import java.io.FileReader
# import java.util.HashMap

# // var String jsonString = (myStrom001_update.state as StringType).toString
# var String jsonString = '{"room":"AT","temp":"17.5","time":"13:45"}'
# var String stateSwitch = transform("JSONPATH","$.room",jsonString)
# var String powerString = transform("JSONPATH","$.temp",jsonString)
# // var String jsonString = "{\"room\":\"AT\",\"temp\":\"17.5\",\"time\":\"13:45\"}"

# // //! IR CODES for Amp
# // // tuner   0xE13EBB44
# // // aux     0xE13ED926
# // // video1  0xE13E43BC
# // // vol up  0xE13E11EE
# // // vol dn  0xE13E31CE
# // // mute    0xE13E29D6
# // // on      0xE13EA45B
# // // off     0xE13E13E
# // var String ampCodeMute = 'E13E29D6'


# // rule "React on amp test switch (amptestSwitch) change/update AMP MUTE"
# // when
# //     Item amptestSwitch received update// your condition here
# // then
# //     // your logic here
# //     // val String hex_code = "0xE13E29D6"
# //     // val dimVal =  Integer.parseInt(0xE13E29D6, 16) as Number
# //     var MyNumber = Long.parseLong(ampCodeMute, 16) as Number // mute amp
# //     amplifiercode.sendCommand(MyNumber)
# // end

# // rule "React on selct Amp source Aux switch change/update"
# // when
# //     Item ampSelectSourceAux received update// your condition here
# // then
# //     var MyNumber = Long.parseLong('E13ED926', 16) as Number // mute amp
# //     amplifiercode.sendCommand(MyNumber)
# // end

# // rule "React on select Amp source Tuner switch change/update"
# // when
# //     Item ampSelectSourceTuner received update// your condition here
# // then
# //     // your logic here
# //     // val String hex_code = "0xE13E29D6"
# //     // val dimVal =  Integer.parseInt(0xE13E29D6, 16) as Number
# //     var MyNumber = Long.parseLong('E13EBB44', 16) as Number // mute amp
# //     amplifiercode.sendCommand(MyNumber)
# // end

# // rule "React on select Amp source Video1 switch change/update"
# // when
# //     Item ampSelectSourceVideo1 received update// your condition here
# // then
# //     // your logic here
# //     // val String hex_code = "0xE13E29D6"
# //     // val dimVal =  Integer.parseInt(0xE13E29D6, 16) as Number
# //     var MyNumber = Long.parseLong('E13E43BC', 16) as Number // mute amp
# //     amplifiercode.sendCommand(MyNumber)
# // end


# rule "React on test switch (testSwitch) change/update"
# when
#     Item testSwitch changed from ON to OFF
# then
#     logInfo("RULE", "Turn OFF Conservatory lights via proxy")
#     gConservatoryFairyLights.sendCommand(OFF)
#     gConservatoryFairyLights.postUpdate(OFF)
#     ZbColourBulb01Switch.sendCommand(OFF)
#     testSwitch.sendCommand(OFF)

# end

# rule "React on test switch (testSwitch) change/update"
# when
#     Item testSwitch changed from OFF to ON
# then
#     logInfo("RULE", "Turn OFF Conservatory lights via proxy")
#     gConservatoryFairyLights.sendCommand(ON)
#     gConservatoryFairyLights.postUpdate(ON)
#     ZbColourBulb01Switch.sendCommand(ON)
#     testSwitch.sendCommand(ON)

# end


# rule "Test"
# when
#     Item Virtual_Switch_1 received update
# then
#     logInfo("Rules","Test: Start")
#     val String filePathString = "/etc/openhab2/conf/test/test.txt"
#     val File filePath = new File(filePathString)
#     if (filePath.exists) {
#         var HashMap<String,String> test = new HashMap<String,String>
#         var BufferedReader in = new BufferedReader(new FileReader(filePathString))
#         var String line = ""
#         while ((line = in.readLine) !== null) {
#             val List<String> parts = line.split(",")
#             test.put(parts.get(0), parts.get(1))
#         }
#         in.close
#         logInfo("Rules","Test: [{}]",test.toString)
#     }
#     else {
#         logInfo("Rules","Test: file does not exist!")
#     }
#     logInfo("Rules","Test: End")
# end

# // fire regulargly for testing


# rule "02:30 - testing rules"
# when
#     Time cron "25 * * ? * * *"
# then
#     // logInfo("testing.rules", "---->TESTING.RULES ") // + masterHeatingMode.state)
#     // logInfo("testing.rules", "---->TESTING.RULES -: " + jsonString)
#     // stateSwitch = transform("JSONPATH","$.room",jsonString)
#     // powerString = transform("JSONPATH","$.temp",jsonString)

#     // logInfo("testing.rules", "---->TESTING.RULES -- ROOM: " + stateSwitch)
#     // logInfo("testing.rules", "---->TESTING.RULES -- TEMP: " + powerString)


#     // Heating_UpdateHeaters.sendCommand(ON)
# end

# rule "Delayed Off Switch"
# when
#     Item Delayed_OFF_SW changed from OFF to ON
# then
#     logInfo("RULE", "delayed off switch")

#     createTimer(now.plusSeconds(240), [|
#         {sendCommand(CT_FairyLights433Socket, OFF)} //con lights
#         {postUpdate(CT_FairyLights433Socket, OFF)}
#         {sendCommand(DR_FairyLights433Socket, OFF)} // d room lights
#         {postUpdate(DR_FairyLights433Socket, OFF)}
#         {sendCommand(vCT_TVKodiSpeakers, OFF)} //tv
#         {postUpdate(vCT_TVKodiSpeakers, OFF)}
#         {sendCommand(CT_Soundbar433PowerSocket, OFF)} // CT_Soundbar433PowerSocket
#         {postUpdate(CT_Soundbar433PowerSocket, OFF)}
#         {sendCommand(radio, OFF)} //radio
#         {postUpdate(radio, OFF)}
#     ])
# end
