from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from org.joda.time import DateTime

@rule("Heating startup", description="StartUp Heating", tags=["Heating"])
@when("System started")
@when("Item testSwitch1 received command")
def heating_startup(event):
    LogAction.logError("Heating startup","Heating startup")
    # events.postUpdate("BridgeLightSensorState", "OFF")
    # global tsceneStartup
    # if tsceneStartup is None:
    #     tsceneStartup = ScriptExecution.createTimer(DateTime.now().plusSeconds(45), lambda: events.postUpdate("Scene_Goodnight", "OFF"))
    for item in ir.getItem("gTemperatureSetpoints").members:
        events.postUpdate(item,DecimalType(19))
        # LogAction.logError("gTemperatureSetpoints", "@@@@@@@@@@@@x initialisinmg gTemperatureSetpoints  Item {} received  update: {}", item, item)
# heatingstart1()


# def scriptLoaded(id):
    # call rule function when this file is loaded
    # heatingstart1()

# def heatingstart1():

# var Timer MModeTimer = null
# var Timer ModesTimer = null
# var Timer TModesTimer = null

# rule "StartUp - set up Heating settings"
# when
#     System started
# then
#     logInfo("startup heating", "checking if master heating mode null")
#     if(MModeTimer === null) {
#         MModeTimer = createTimer(now.plusSeconds(60), [| 
#             if (masterHeatingMode.state == NULL) {
#                 masterHeatingMode.postUpdate("auto")
#                 logInfo("startup heating", "master heating mode was null - set master heating mode to - auto")
#             }
#             MModeTimer = null
#         ])
#     }

#     logInfo("startup heating", "checking if any room heating modes are null")
#     if(ModesTimer === null) {
#         ModesTimer = createTimer(now.plusSeconds(70), [| 
#             if ( gHeatingModes.state == NULL) {
#                 gHeatingModes.members.forEach[ String heatingMode | heatingMode.postUpdate("auto") ] 
#                 logInfo("startup heating", "heating mode was null - set heating mode to - auto")
#             }
#             ModesTimer = null
#         ])
#     }

#     logInfo("startup heating", "????????????????????????????????????????checking if any GA Thermostat modes are null")
#     if(TModesTimer === null) {//if timer not currently running
#         TModesTimer = createTimer(now.plusSeconds(80), [| 
#           logInfo("startup heating", "================================== timer executing")

#            if ( gThermostatModes.state == "notdef") {//if any states are - notdef
#               logInfo("startup heating", ")))cc))))))))))xx))))))))))))))))))Setting GA Thermostat modes to heat")
#                gThermostatModes.members.forEach[  ThermoMode | ThermoMode.postUpdate("heat") ]
#             }
#             TModesTimer = null//mark as timer not running
#         ])
#     }

#     if (Boiler_Control === null) {
#         Boiler_Control.postUpdate(OFF)
#     }
# end