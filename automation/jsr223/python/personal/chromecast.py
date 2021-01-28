from java.time import ZonedDateTime as DateTime
from core.actions import ScriptExecution
from core.rules import rule
from core.triggers import when
from core.actions import Audio

# voice support, new PercentType(50) 
from core.actions import Voice

TimerPlayStream = None

@rule("say test", description="say test", tags=["test"])
@when("Item Send_Audio_to_GHM received command")
def saytest(event):
    saytest.log.info("saytest rulel now")
    Voice.say("This is a test message", "voicerss:enGB", "chromecast:chromecast:GHM_Conservatory", PercentType(65))
    events.postUpdate(ir.getItem("Send_Audio_to_GHM"), "OFF")
    Audio.playSound("chromecast:chromecast:GHM_Conservatory","input_ok_3_clean.mp3")
