import org.joda.time.DateTime as DateTime
from core.actions import ScriptExecution
from core.rules import rule
from core.triggers import when


# voice support
from org.eclipse.smarthome.core.library.types import PercentType
from core.actions import Voice

TimerPlayStream = None

@rule("say test", description="say test", tags=["test"])
@when("Item Send_Audio_to_GHM received command")
def saytest(event):
    saytest.log.info("saytest rulel now")
    Voice.say("This is a test message", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(65))
    events.postUpdate(ir.getItem("Send_Audio_to_GHM"), "OFF")
# 	playSound("chromecast:chromecast:GHM_Conservatory","input_ok_3_clean.mp3", new PercentType(50) )
