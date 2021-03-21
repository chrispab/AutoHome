from core.rules import rule
from core.triggers import when
from core.actions import LogAction

# !this file must be reloaded if any presets are changed to register the new cron times
# ! MONDAY TO FRIDAY
@rule("heating cron weekday morning 1", description="heating cron weekday morning 1", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 0 5 ? * MON-FRI *")
@when(ir.getItem("CRON_HPSP_Time_1").getState().toString())
def heating_cron_morning_1(event):
    temp = ir.getItem("Outside_Temperature").getState().floatValue()
    LogAction.logWarn("PRE  check if cold enough to start heating", "PRE outside  temp = {}", temp)
    if (temp < 3.0):
        morning_heating()


@rule("heating cron weekday morning 2", description="heating cron weekday morning 2", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 0 6 ? * MON-FRI *")
@when(ir.getItem("CRON_HPSP_Time_2").getState().toString())
def heating_cron_morning_2(event):
    temp = ir.getItem("Outside_Temperature").getState().floatValue()
    LogAction.logWarn("PRE check if cold enough to start heating", "PRE outside  temp = {}", temp)
    if (temp < 7.0):
        morning_heating()


@rule("heating cron weekday morning", description="heating cron weekday morning", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 0 7 ? * MON-FRI *")
@when(ir.getItem("CRON_HPSP_Time_3").getState().toString())
def heating_cron_morning(event):
    morning_heating()


def morning_heating():
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Morning").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_Morning setpoint Item : {}, is now: {}", item.name, item.state)
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc


@rule("heating 9 am", description="heating 8.30 am", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 0 9 ? * MON-FRI *")
@when(ir.getItem("CRON_HPSP_Time_4").getState().toString())
def heating_cron8(event):
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Day").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_Day setpoint Item : {}, is now: {}", item.name, item.state)
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc


@rule("heating cron weekday evening", description="heating cron weekday evening", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 30 16 ? * MON-FRI *")
@when(ir.getItem("CRON_HPSP_Time_5").getState().toString())
def heating_cron9(event):
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Evening").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_Evening setpoint Item : {}, is now: {}", item.name, item.state)
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc


# ! WEEKENDS
@rule("7 am weekend", description="7:00 am weekend", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 30 6 ? * SAT,SUN *")
@when(ir.getItem("CRON_HPSP_Time_6").getState().toString())
def heating_cron11(event):
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_WE_Morning").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_WE_Morning setpoint Item : {}, is now: {}", item.name, item.state)
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc

@rule("4:30pm weekend", description="4:30pm weekend", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 30 16 ? * SAT,SUN *")
@when(ir.getItem("CRON_HPSP_Time_7").getState().toString())
def heating_cron12(event):
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_WE_Evening").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_WE_Evening setpoint Item : {}, is now: {}", item.name, item.state)
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc


# ! EVERY DAY
@rule("12pm alldays", description="12pm alldays", tags=["heating", "cron"])# description and tags are optional
# @when("Time cron 0 0 0 ? * * *")
@when(ir.getItem("CRON_HPSP_Time_8").getState().toString())
def heating_cron9(event):
    night_heating()



def night_heating():
    for item in ir.getItem("gHeating_PresetTempNormal").members:
        item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Night").state # prefix =  # get prefix eg FR, CT etc
        LogAction.logWarn("CRON set setpoints", "===> _HPSP_Night setpoint Item : {}, is now: {}", item.name, item.state)
    events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc

