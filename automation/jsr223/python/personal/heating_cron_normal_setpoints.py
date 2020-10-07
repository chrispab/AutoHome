from core.rules import rule
from core.triggers import when
# var Number offTemp = 13
# var Number minTemp = 13
# var Number sleepTemp = 18
offTemp = 13.2
minTemp = 13
sleepTemp = 17

# var Number liveTemp = 21
# var Number lowTemp = 16
# var Number morningTemp = 20
# var Number midTemp = 21
liveTemp = 21
lowTemp = 16
morningTemp = 20
midTemp = 21

# var Number eveningTemp = 23
# var Number highTemp = 22
# var Number vhighTemp = 23
# var Number wakeTemp = 19
eveningTemp = 23
highTemp = 22
vhighTemp = 23
wakeTemp = 19
# var Number HL_midTemp = 17
# var Number maxTemp = 24
HL_midTemp = 17
maxTemp = 24

#! master heating mode - NORMAL mode rules


# @rule("Jython Hello World (cron decorators)", description="This is an example cron triggered rule using decorators", tags=["Test tag", "Hello World"])# description and tags are optional
# @when("Time cron 0/10 * * * * ?")
# def hello_world_cron_decorators(event):
#     hello_world_cron_decorators.log.error("Hello World!>>>>>>>>>")
# rule "00:00"
# when
#     Time cron "0 00 00 ? * MON-FRI *"
# then

# @when("Time cron 0/10 * * * * ?")

@rule("00:00 cron mon-fri", description="00:00 cron mon-fri", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 00 00 ? * MON-FRI *")
def heating_cron1(event):
    heating_cron1.log.error("HEATING CRON 1 ============================>>>>>>>")
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), sleepTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")


# rule "00:30"
# when
#     Time cron "0 30 00 ? * MON-FRI *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp )
#     ER_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     AT_Heating_PresetTempNormal.postUpdate(offTemp )
#     BR_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     OF_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     HL_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end
@rule("00:30 cron mon-fri", description="00:00 cron mon-fri", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 30 00 ? * MON-FRI *")
def heating_cron2(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), sleepTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")


# rule "01:00 - all heating low"
# when
#     Time cron "0 00 01 ? * * *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp )
#     ER_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     AT_Heating_PresetTempNormal.postUpdate(offTemp )
#     BR_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     OF_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     HL_Heating_PresetTempNormal.postUpdate(offTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end
@rule("01:00 - all heating low", description="01:00 - all heating low", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 00 01 ? * * *")
def heating_cron3(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")

# rule "02:30 - all heating low"
# when
#     Time cron "0 30 02 ? * * *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp )
#     ER_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     AT_Heating_PresetTempNormal.postUpdate(offTemp )
#     BR_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     OF_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     HL_Heating_PresetTempNormal.postUpdate(offTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end
@rule("02.30 - all heating low", description="02.30 - all heating low", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 30 02 ? * * *")
def heating_cron4(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")


# rule "start heating early if cold outside - 04:30 am"
# when
#     Time cron "0 30 05 ? * MON-FRI *"
# then
#     var Number temp = Outside_Temperature.state as DecimalType // get the current temperature
#     if (temp < 2.0 ) {  // determine whether we need to turn on/off the heater
#         logInfo("5:30 - check if cold enough to start heating", "starting cos outside temp = " + temp)

#         CT_Heating_PresetTempNormal.postUpdate(highTemp)
#         FR_Heating_PresetTempNormal.postUpdate(offTemp)
#         ER_Heating_PresetTempNormal.postUpdate(offTemp)
#         AT_Heating_PresetTempNormal.postUpdate(offTemp)
#         BR_Heating_PresetTempNormal.postUpdate(offTemp)
#         OF_Heating_PresetTempNormal.postUpdate(offTemp)
#         HL_Heating_PresetTempNormal.postUpdate(offTemp)
#         Heating_UpdateHeaters.sendCommand(ON)
#     }
# end
@rule("start heating early if cold outside", description="start heating early if cold outside", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 30 05 ? * MON-FRI *")
def heating_cron5(event):
#     var Number temp = Outside_Temperature.state as DecimalType // get the current temperature
#     if (temp < 2.0 ) {  // determine whether we need to turn on/off the heater
#         logInfo("5:30 - check if cold enough to start heating", "starting cos outside temp = " + temp)    
    temp = ir.getItem("Outside_Temperature").state
    if temp < 2.0:
        heating_cron1.log.error("check if cold enough to start heating", "starting cos outside temp = {}", temp)
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")


# rule "start heating early if cold outside - 05:30 am"
# when
#     Time cron "0 00 05 ? * MON-FRI *"
# then
#     var Number temp = Outside_Temperature.state as DecimalType // get the current temperature
#     if (temp < 5.0 ) {  // determine whether we need to turn on/off the heater
#         logInfo("5:30 - check if cold enough to start heating", "starting cos outside temp = " + temp)

#         CT_Heating_PresetTempNormal.postUpdate(highTemp)
#         FR_Heating_PresetTempNormal.postUpdate(offTemp)
#         ER_Heating_PresetTempNormal.postUpdate(offTemp)
#         AT_Heating_PresetTempNormal.postUpdate(offTemp)
#         BR_Heating_PresetTempNormal.postUpdate(offTemp)
#         OF_Heating_PresetTempNormal.postUpdate(offTemp)
#         HL_Heating_PresetTempNormal.postUpdate(offTemp)
#         Heating_UpdateHeaters.sendCommand(ON)
#     }
# end
@rule("start heating early if cold outside", description="start heating early if cold outside", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 00 05 ? * MON-FRI *")
def heating_cron6(event):
    temp = ir.getItem("Outside_Temperature").state
    if temp < 5.0:
        heating_cron1.log.error("check if cold enough to start heating", "starting cos outside temp = {}", temp)
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")


# rule "NORMAL heating start - 06:10 am"
# when
#     Time cron "0 00 06 ? * MON-FRI *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(midTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp)
#     ER_Heating_PresetTempNormal.postUpdate(morningTemp)
#     AT_Heating_PresetTempNormal.postUpdate(offTemp)
#     BR_Heating_PresetTempNormal.postUpdate(morningTemp)
#     OF_Heating_PresetTempNormal.postUpdate(offTemp)
#     HL_Heating_PresetTempNormal.postUpdate(offTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end
@rule("NORMAL heating start - 06:10 am", description="NORMAL heating start - 06:10 am", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 00 06 ? * MON-FRI *")
def heating_cron7(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), midTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), morningTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), morningTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")


# rule "heating 08:00 am"
# when
#     Time cron "0 0 08 ? * MON-FRI *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(highTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp)
#     ER_Heating_PresetTempNormal.postUpdate(offTemp)
#     AT_Heating_PresetTempNormal.postUpdate(highTemp)
#     BR_Heating_PresetTempNormal.postUpdate(offTemp)
#     OF_Heating_PresetTempNormal.postUpdate(highTemp)
#     HL_Heating_PresetTempNormal.postUpdate(offTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end
@rule("heating 08:00 am", description="heating 08:00 am", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 0 08 ? * MON-FRI *")
def heating_cron8(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), morningTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), morningTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")

# rule "16:00"
# when
#     Time cron "0 00 16 ? * MON-FRI *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(highTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp)
#     ER_Heating_PresetTempNormal.postUpdate(midTemp)
#     AT_Heating_PresetTempNormal.postUpdate(offTemp)
#     BR_Heating_PresetTempNormal.postUpdate(midTemp)
#     OF_Heating_PresetTempNormal.postUpdate(midTemp)
#     HL_Heating_PresetTempNormal.postUpdate(midTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end
@rule("heating 16:00 am", description="heating 16:00 am", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 0 16 ? * MON-FRI *")
def heating_cron9(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), morningTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), morningTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")


# rule "11:30pm weekdays"
# when
#     Time cron "0 35 23 ? * MON-FRI *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(midTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp)
#     ER_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     AT_Heating_PresetTempNormal.postUpdate(offTemp)
#     BR_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     OF_Heating_PresetTempNormal.postUpdate(offTemp)
#     HL_Heating_PresetTempNormal.postUpdate(offTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end
@rule("11:30pm weekdays", description="h11:30pm weekdays", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 35 23 ? * MON-FRI *")
def heating_cron9(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), midTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")


# rule "TEST  weekdays"
# when
#     Time cron "0 11 00 ? * MON-FRI *"
# then
#     logInfo("TEST CRON RULE", "test ran lnivve temp" + liveTemp)
#     // CT_Heating_PresetTempNormal.postUpdate(midTemp)
#     // FR_Heating_PresetTempNormal.postUpdate(midTemp)
#     // ER_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     // AT_Heating_PresetTempNormal.postUpdate(midTemp)
#     // BR_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     // OF_Heating_PresetTempNormal.postUpdate(midTemp)
#     // HL_Heating_PresetTempNormal.postUpdate(midTemp)
#     // Heating_UpdateHeaters.sendCommand(ON)
# end


# rule "00:30 am weekend"
# when
#     Time cron "0 30 00 ? * SAT-SUN *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp )
#     ER_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     AT_Heating_PresetTempNormal.postUpdate(offTemp )
#     BR_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     OF_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     HL_Heating_PresetTempNormal.postUpdate(sleepTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end
@rule("100:30 am weekend", description="h00:30 am wecekend", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 30 00 ? * SAT,SUN *")
def heating_cron10(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")

# rule "7:00 am weekend"
# when
#     Time cron "0 0 7 ? * SAT-SUN *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(highTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp)
#     ER_Heating_PresetTempNormal.postUpdate(midTemp)
#     AT_Heating_PresetTempNormal.postUpdate(offTemp)
#     BR_Heating_PresetTempNormal.postUpdate(midTemp)
#     OF_Heating_PresetTempNormal.postUpdate(offTemp)
#     HL_Heating_PresetTempNormal.postUpdate(offTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end
@rule("7:00 am weekend", description="7:00 am weekend", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 0 7 ? * SAT,SUN *")
def heating_cron11(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")

# rule "4:30pm weekend"
# when
#     Time cron "0 30 16 ? * SAT-SUN *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(highTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp)
#     ER_Heating_PresetTempNormal.postUpdate(midTemp)
#     AT_Heating_PresetTempNormal.postUpdate(offTemp)
#     BR_Heating_PresetTempNormal.postUpdate(midTemp)
#     OF_Heating_PresetTempNormal.postUpdate(offTemp)
#     HL_Heating_PresetTempNormal.postUpdate(offTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end
@rule("4:30pm weekend", description="4:30pm weekend", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 30 16 ? * SAT,SUN *")
def heating_cron12(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")


# rule "22:30pm weekend"
# when
#     Time cron "0 30 23 ? * SAT-SUN *"
# then
#     CT_Heating_PresetTempNormal.postUpdate(highTemp)
#     FR_Heating_PresetTempNormal.postUpdate(offTemp)
#     ER_Heating_PresetTempNormal.postUpdate(midTemp)
#     AT_Heating_PresetTempNormal.postUpdate(offTemp)
#     BR_Heating_PresetTempNormal.postUpdate(midTemp)
#     OF_Heating_PresetTempNormal.postUpdate(lowTemp)
#     HL_Heating_PresetTempNormal.postUpdate(lowTemp)
#     Heating_UpdateHeaters.sendCommand(ON)
# end


# @rule("4:30pm weekend", description="4:30pm weekend", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 30 16 ? * SAT,SUN *")
# def heating_cron12(event):
#     events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
#     events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
#     events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
#     events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
#     events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
#     events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
#     events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
#     events.sendCommand("Heating_UpdateHeaters", "ON")
