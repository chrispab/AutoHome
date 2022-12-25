// import java.util.Map
// import org.eclipse.smarthome.model.script.ScriptServiceUtil
const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { countdownTimer, timeUtils, timerMgr } = require('openhab_rules_tools');
const { timeUtils } = require('openhab_rules_tools');

const logger = log('light cycle');

const {
  ON, OFF, PercentType, OnOffType,
} = require('@runtime');
// val cycleSat = new PercentType(75)
const sat = new PercentType(75);
// val cycleBright = new PercentType(100)
const bright = new PercentType(100);
// val pause = 200
const pause = 200;
// var Map<String, Timer> cycleTimers = newHashMap
function cycle_timer_body() {
  logger.warn('===The timer is over.pir04_off_body');
  items.getItem('ZbWhiteBulb01Switch').sendCommand('OFF');
}

let cycle_timer = null;
// rule "A light color cycle"
// when
//     Member of LightCyclers changed
// then
rules.JSRule({
  name: 'A light color cycle',
  description: 'A light color cycle',
  triggers: [
    triggers.GroupStateChangeTrigger('gLightCyclers'), // on edges only
  ],
  execute: (event) => {
    // Get the light associate?d with this cycler
    //     val light = ScriptServiceUtil.getItemRegistry.getItem(triggeringItem.name.replace("CYCLE", "RGB"))
    const light = items.getItem(event.name.replace('CYCLE', 'RGB'));
    //     // turn off the cycling
    //     if(triggeringItem.state != ON) {
    //         light.sendCommand(OFF)
    //         return;
    //     }
    if (event.state !== ON) {
      light.sendCommand(OFF);
    }
    // Start cycling
    //     logInfo("CycleColor", "Color Loop Activated")
    logger.error('CycleColor - Color Loop Activated');
    //     var hue = 0
    //     val direction = 1
    const hue = 0;
    const direction = 1;
    // turn on the light if it isn't already
    //     if(light.getStateAs(OnOffType) != ON) light.sendCommand(ON)
    if (light.getStateAs(OnOffType) !== ON) light.sendCommand(ON);

    //     cycleTimers.get(triggeringItem.name)?.cancel // if there is a timer already running, cancel it
    cycle_timer?.cancel // if there is a timer already running, cancel it


    // create a timer to trigger immediately
    //     cycleTimers.put(triggeringItem.name, createTimer(now, [ |
    cycle_timer = actions.ScriptExecution.createTimer(
      timeout,
      //cycle_timer_body,

      // while the cycle flag is ON and the light remains ON, move the color
      () => {
        if (event.state == ON && light.getStateAs(OnOffType) == ON) {
          hue = hue + (5 * direction)

          if (hue >= 360) {
            hue = 360
            direction = direction * -1
          }
          else if (hue <= 0) {
            hue = 0
            direction = direction * -1
          }

          light.sendCommand(new HSBType(new DecimalType(hue), sat, bright));// shouldn't have the ambiguous function call problem any more

          // Set the timer to run again in pause milliseconds
          cycle_timer.reschedule(now.plusMillis(pause));
        }

        // set the timer to null now that we are done
        else cycle_timer.cancel()

      }
      //     ]))
    );
    // end
  },
});
