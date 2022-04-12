# var runtime = require('@runtime');
# var ZonedDateTime = Java.type("java.time.ZonedDateTime");
# var now = ZonedDateTime.now();

from core.rules import rule
from core.triggers import when
from core.actions import LogAction
from core.actions import ScriptExecution
from java.time import ZonedDateTime as DateTime

# runtime.events.sendCommand('UI_Refresh_Timer', now.toLocalDateTime().toString());

events.sendCommand('UI_Refresh_Timer', DateTime.now().toString())
