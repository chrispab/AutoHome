from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from java.time import ZonedDateTime as DateTime

@rule("Heating startup", description="StartUp Heating", tags=["Heating"])
@when("System started")
def heating_startup(event):
    LogAction.logError("Heating startup","Heating startup")

    if ir.getItem("masterHeatingMode") == NULL:
        events.postUpdate(ir.getItem("masterHeatingMode"),"auto")   

    for item in ir.getItem("gTemperatureSetpoints").members:
        if item == NULL:
            events.postUpdate(item,DecimalType(17))
        
    for item in ir.getItem("gHeatingModes").members:
        if item == NULL:
            events.postUpdate(item,"auto")        

    for item in ir.getItem("gThermostatModes").members:
        if item == NULL:
            events.postUpdate(item,"heat")  

    if ir.getItem("Boiler_Control") == NULL: 
        events.postUpdate(ir.getItem("Boiler_Control"),"OFF")
        

# // ! these must be set at least on first run to init them
# //! then use each rooms program setpoint page to set
# Number CT_MorningTemp (gHeating_Presets)
# Number CT_DayTemp  (gHeating_Presets)
# Number CT_EveningTemp  (gHeating_Presets)
# Number CT_NightTemp  (gHeating_Presets)
# Number CT_OffTemp (gHeating_Presets)

# Number FR_MorningTemp (gHeating_Presets)
# Number FR_DayTemp  (gHeating_Presets)
# Number FR_EveningTemp  (gHeating_Presets)
# Number FR_NightTemp  (gHeating_Presets)
# Number FR_OffTemp (gHeating_Presets)

# Number HL_MorningTemp (gHeating_Presets)
# Number HL_DayTemp  (gHeating_Presets)
# Number HL_EveningTemp  (gHeating_Presets)
# Number HL_NightTemp  (gHeating_Presets)
# Number HL_OffTemp (gHeating_Presets)

# Number OF_MorningTemp (gHeating_Presets)
# Number OF_DayTemp  (gHeating_Presets)
# Number OF_EveningTemp  (gHeating_Presets)
# Number OF_NightTemp  (gHeating_Presets)
# Number OF_OffTemp (gHeating_Presets)

# Number BR_MorningTemp (gHeating_Presets)
# Number BR_DayTemp  (gHeating_Presets)
# Number BR_EveningTemp  (gHeating_Presets)
# Number BR_NightTemp  (gHeating_Presets)
# Number BR_OffTemp (gHeating_Presets)

# Number ER_MorningTemp (gHeating_Presets)
# Number ER_DayTemp  (gHeating_Presets)
# Number ER_EveningTemp  (gHeating_Presets)
# Number ER_NightTemp  (gHeating_Presets)
# Number ER_OffTemp (gHeating_Presets)

# Number AT_MorningTemp (gHeating_Presets)
# Number AT_DayTemp  (gHeating_Presets)
# Number AT_EveningTemp  (gHeating_Presets)
# Number AT_NightTemp  (gHeating_Presets)
# Number AT_OffTemp (gHeating_Presets)
