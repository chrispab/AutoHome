from core.rules import rule
from core.triggers import when

offTemp = 13.2
minTemp = 13
sleepTemp = 16

liveTemp = 21
lowTemp = 16
morningTemp = 19
midTemp = 21

eveningTemp = 23
highTemp = 22
vhighTemp = 23
wakeTemp = 19

HL_midTemp = 17
maxTemp = 24
highEvening = 22.5

hallWeekDayTemp = 19
BR_DayTemp = 18

#! master heating mode - NORMAL mode rules
# @rule("cron test", description="cron test", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 22 21 ? * MON-FRI *")
# def heating_cron1(event):
#     heating_cron1.log.error("HEATING CRON 1 ============================>>>>>>>")
#     events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), sleepTemp)
#     events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
#     events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
#     events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
#     events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
#     events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), sleepTemp)
#     events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), sleepTemp)
#     events.sendCommand("Heating_UpdateHeaters", "ON")

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


@rule("start heating early if cold outside", description="start heating early if cold outside", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 00 05 ? * MON-FRI *")
def heating_cron5(event):
    temp = ir.getItem("Outside_Temperature").state
    if temp < 2.0:
        heating_cron1.log.error("check if cold enough to start heating", "starting cos outside temp = {}", temp)
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")

@rule("start heating early if cold outside", description="start heating early if cold outside", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 30 05 ? * MON-FRI *")
def heating_cron6(event):
    temp = ir.getItem("Outside_Temperature").state
    if temp < 5.0:
        heating_cron1.log.error("check if cold enough to start heating", "starting cos outside temp = {}", temp)
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")

# @rule("NORMAL heating start - 07:30 am", description="NORMAL heating start - 06:10 am", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 0 07 ? * MON-FRI *")
# def heating_cron7(event):
#     events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
#     events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
#     events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), morningTemp)
#     events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
#     events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), morningTemp)
#     events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
#     events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
#     events.sendCommand("Heating_UpdateHeaters", "ON")

@rule("heating 07:00 am", description="heating 7 am", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 0 07 ? * MON-FRI *")
def heating_cron8(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), highEvening)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), morningTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), morningTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), hallWeekDayTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")

@rule("heating 08:30 am", description="heating 8.30 am", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 30 08 ? * MON-FRI *")
def heating_cron8(event):
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), BR_DayTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")


@rule("heating 16:00 am", description="heating 16:00 am", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 0 16 ? * MON-FRI *")
def heating_cron9(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highEvening)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), highEvening)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), morningTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), BR_DayTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), hallWeekDayTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")

@rule("11:55pm weekdays", description="h11:30pm weekdays", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 55 23 ? * MON-FRI *")
def heating_cron9(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), midTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")

@rule("00:30 am weekend", description="h00:30 am wecekend", tags=["heating", "cron"])# description and tags are optional
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


@rule("7 am weekend", description="7:00 am weekend", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 0 7 ? * SAT,SUN *")
def heating_cron11(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highTemp)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), highEvening)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")

@rule("4:30pm weekend", description="4:30pm weekend", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 30 16 ? * SAT,SUN *")
def heating_cron12(event):
    events.postUpdate(ir.getItem("CT_Heating_PresetTempNormal"), highEvening)
    events.postUpdate(ir.getItem("FR_Heating_PresetTempNormal"), highEvening)
    events.postUpdate(ir.getItem("ER_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("AT_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("BR_Heating_PresetTempNormal"), sleepTemp)
    events.postUpdate(ir.getItem("OF_Heating_PresetTempNormal"), offTemp)
    events.postUpdate(ir.getItem("HL_Heating_PresetTempNormal"), offTemp)
    events.sendCommand("Heating_UpdateHeaters", "ON")
