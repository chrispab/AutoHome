from core.rules import rule
from core.triggers import when
from core.actions import LogAction

# offTemp = 13
# minTemp = 14
# sleepTemp = 16

# liveTemp = 21
# lowTemp = 16
# morningTemp = 19
# midTemp = 21

# eveningTemp = 23
# highTemp = 22
# vhighTemp = 23
# wakeTemp = 19

# HL_midTemp = 17
# maxTemp = 24
# highEvening = 22.5

# hallWeekDayTemp = 19
# CT_MorningTemp = 22
# CT_DayTemp = 21
# CT_EveningTemp = 23
# CT_NightTemp = 14

# BR_DayTemp = 18

# FR_DayTemp = 14
# FR_EveningTemp = 14
# FR_NightTemp = 14
# FR_offTemp = minTemp



# ! MONDAY TO FRIDAY 

@rule("heating cron weekday morning 1", description="heating cron weekday morning 1", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0/30 * * ? * MON-FRI *")
@when("Time cron 0 0 5 ? * MON-FRI *")
def heating_cron_morning_1(event):
    morning_heating()

@rule("heating cron weekday morning 2", description="heating cron weekday morning 2", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0/30 * * ? * MON-FRI *")
@when("Time cron 0 30 5 ? * MON-FRI *")
def heating_cron_morning_2(event):
    morning_heating()

@rule("heating cron weekday morning", description="heating cron weekday morning", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0/30 * * ? * MON-FRI *")
@when("Time cron 0 0 7 ? * MON-FRI *")
def heating_cron_morning(event):
    morning_heating()

def morning_heating():
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Morning").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_Morning setpoint Item : {}, is now: {}", item.name, item.state)            
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc
   

@rule("heating 9 am", description="heating 8.30 am", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 0 9 ? * MON-FRI *")
# @when("Time cron 0/30 * * ? * MON-FRI *")
def heating_cron8(event):
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Day").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_Day setpoint Item : {}, is now: {}", item.name, item.state)            
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc


@rule("heating 16:00", description="heating 16:00", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 0 16 ? * MON-FRI *")
# @when("Time cron 0/30 * * ? * MON-FRI *")
def heating_cron9(event):
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Evening").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_Evening setpoint Item : {}, is now: {}", item.name, item.state)            
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc


@rule("heating cron weekday evening", description="heating cron weekday evening", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 1 16 ? * MON-FRI *")
# @when("Time cron 0/30 * * ? * MON-FRI *")
def heating_crontest(event):
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Evening").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_Evening setpoint Item : {}, is now: {}", item.name, item.state)
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc




def night_heating():
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Night").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_Night setpoint Item : {}, is now: {}", item.name, item.state)            
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc


#
# ! WEEKENDS
# @rule("00:30 am weekend", description="h00:30 am wecekend", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 30 00 ? * SAT,SUN *")
# def heating_cron10(event):
#     night_heating()


@rule("7 am weekend", description="7:00 am weekend", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 30 6 ? * SAT,SUN *")
def heating_cron11(event):
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_WE_Morning").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_WE_Morning setpoint Item : {}, is now: {}", item.name, item.state)
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc

@rule("4:30pm weekend", description="4:30pm weekend", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 30 16 ? * SAT,SUN *")
def heating_cron12(event):
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_WE_Evening").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_WE_Evening setpoint Item : {}, is now: {}", item.name, item.state)
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc


# ! EVERY DAY
# @rule("02.30 - all heating low", description="02.30 - all heating low", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 30 02 ? * * *")
# def heating_cron4(event):
#     night_heating()

@rule("12pm alldays", description="12pm alldays", tags=["heating", "cron"])# description and tags are optional
@when("Time cron 0 0 0 ? * * *")
def heating_cron9(event):
    night_heating()