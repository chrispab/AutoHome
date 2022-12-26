// import java.util.Map
// import org.eclipse.smarthome.model.script.ScriptServiceUtil
const {
  log, items, rules, actions, time, triggers, utils,
} = require('openhab');
const { countdownTimer, timeUtils, timerMgr } = require('openhab_rules_tools');
// const { timeUtils } = require('openhab_rules_tools');
const { myutils } = require('personal');

const logger = log('light cycle');

const {
  ON, OFF, PercentType, OnOffType, HSBType, DecimalType, RGBType, ChronoUnit,
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
    triggers.GroupStateChangeTrigger('gLightCyclers'),
  ],
  execute: (event) => {
    // Get the light associate?d with this cycler
    //     val light = ScriptServiceUtil.getItemRegistry.getItem(triggeringItem.name.replace("CYCLE", "RGB"))
    myutils.showEvent(event);
    // const light = items.getItem(event.itemName.toString().replace('CYCLE', 'RGB'));
    const light1 = items.getItem('ZbColourBulb01_RGB');
    const light2 = items.getItem('ZbColourBulb02_RGB');

    // myutils.showItem(light);
    utils.dumpObject(light1, true);
    myutils.showItem(light1);
    //     // turn off the cycling
    //     if(triggeringItem.state != ON) {
    //         light.sendCommand(OFF)
    //         return;
    //     }
    if (event.newState !== 'ON') {
      logger.error('CycleColor - light.sendCommand(OFF),., return;');
      light1.sendCommand(OFF);
      light2.sendCommand(OFF);

      if (cycle_timer) {
        cycle_timer.cancel();
      }
      return;
    }
    // Start cycling
    //     logInfo("CycleColor", "Color Loop Activated")
    logger.error('CycleColor - Color Loop Activated');
    //     var hue = 0
    //     val direction = 1
    let hue = 0;
    let direction = 1;
    // turn on the light if it isn't already
    //     if(light.getStateAs(OnOffType) != ON) light.sendCommand(ON)
    // if (light.state(OnOffType) !== ON) light.sendCommand(ON);
    if (light1.state !== ON) light1.sendCommand(ON);
    if (light2.state !== ON) light2.sendCommand(ON);

    //     cycleTimers.get(triggeringItem.name)?.cancel // if there is a timer already running, cancel it
    // if there is a timer already running, cancel it
    if (cycle_timer) {
      cycle_timer.cancel();
    }

    // create a timer to trigger immediately
    //     cycleTimers.put(triggeringItem.name, createTimer(now, [ |
    const now = time.ZonedDateTime.now();
    cycle_timer = actions.ScriptExecution.createTimer(
      now.plusSeconds(1),
      // cycle_timer_body,
      // while the cycle flag is ON and the light remains ON, move the color
      () => {
        logger.error('CycleColor - while the cycle flag is ON and the light remains ON, move the color');
        myutils.showItem(light1);
        // if (event.newState === 'ON' && light.state === 'ON') {
        if (event.newState === 'ON') {
          hue += (items.getItem('lightCyclerHueStepSize').rawState * direction);

          if (hue >= 360) {
            hue = 360;
            direction *= -1;
          } else if (hue <= 0) {
            hue = 0;
            direction *= -1;
          }
          logger.error('CycleColor - sendCommand(new HSBType(new DecimalType(hue),  sat, bright))');
          // light.sendCommand(new RGBType.fromHSB(new HSBType(new DecimalType(hue), sat, bright)));
          // events.sendCommand('Huecolorlamp2TestLeuchte_Farbe', Hue.toString() + "," + Saturation.toString() + "," + Brightness.toString());
          light1.sendCommand(`${hue.toString()},${sat.toString()},${bright.toString()}`);
          light2.sendCommand(`${hue.toString()},${sat.toString()},${bright.toString()}`);

          const tnow = time.ZonedDateTime.now();
          // cycle_timer.reschedule(tnow.plusSeconds(1));// Set the timer to run again
          cycle_timer.reschedule(tnow.plus(items.getItem('lightCyclerIntervalMillis').rawState, time.ChronoUnit.MILLIS));
          // dt.plus(1, ChronoUnit.MILLIS); java.time.temporal.ChronoUnit.whatevermethodyouwant()
          // cycle_timer.reschedule(tnow.plus(1000, java.time.temporal.ChronoUnit.MILLIS));
        } else cycle_timer.cancel();// set the timer to null now that we are done
      },
      //     ]))
    );
    // end
  },
});
