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
