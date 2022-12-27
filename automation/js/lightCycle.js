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
let sat = new PercentType(100);
// val cycleBright = new PercentType(100)
let bright = new PercentType(100);
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
    // utils.dumpObject(light1, true);
    // myutils.showItem(light1);
    //     // turn off the cycling
    if (items.getItem('ZbColourBulb02_CYCLE').state.toString() !== 'ON') {
      logger.error('CycleColor - light.sendCommand(OFF),., returning');
      light1.sendCommand('OFF');
      light2.sendCommand('OFF');
      if (cycle_timer) {
        cycle_timer.cancel();
      }
      return;
    }
    // Start cycling
    logger.error('CycleColor - Color Loop Activated');

    let hue = 0;
    const direction = 1;
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
    const now = time.ZonedDateTime.now();
    cycle_timer = actions.ScriptExecution.createTimer(
      now.plusSeconds(1),
      // cycle_timer_body,
      // while the cycle flag is ON and the light remains ON, move the color
      () => {
        logger.error('CycleColor - while the cycle flag is ON and the light remains ON, move the color');
        // myutils.showItem(light1);
        // if (event.newState === 'ON' && light.state === 'ON') {
        if (items.getItem('ZbColourBulb02_CYCLE').state.toString() === 'ON') {
          hue += (items.getItem('lightCyclerHueStepSize').rawState * direction);
          if (hue >= 359) {
            hue -= 359;
          }

          sat = items.getItem('lightCyclerSaturation').rawState;
          bright = items.getItem('lightCyclerBrightness').rawState;

          logger.error(`CycleColor - sendCommand(HSBType) H: ${hue.toString()}, S: ${sat.toString()}, B: ${bright.toString()}`);
          light1.sendCommand(`${hue.toString()},${sat.toString()},${bright.toString()}`);
          light2.sendCommand(`${hue.toString()},${sat.toString()},${bright.toString()}`);

          const tnow = time.ZonedDateTime.now();
          cycle_timer.reschedule(tnow.plus(items.getItem('lightCyclerIntervalMillis').rawState, time.ChronoUnit.MILLIS));
          // cycle_timer.reschedule(tnow.plus(1000, java.time.temporal.ChronoUnit.MILLIS));
        } else {
          logger.error('CycleColor - cycle flag off');
          light1.sendCommand('OFF');
          light2.sendCommand('OFF');
          if (cycle_timer) {
            cycle_timer.cancel();
          }
        }
      },
    );
  },
});
