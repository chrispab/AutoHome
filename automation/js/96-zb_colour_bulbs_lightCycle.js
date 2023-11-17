// zb_colour_bulbs_lightCycle.js] - require TimerMgr instead of timerMgr and use TimerMgr() instead of new timerMgr.TimerMgr().
const {
  log, items, rules, actions, time, triggers
} = require('openhab');
// const { CountdownTimer, timeUtils, timerMgr } = require('openhab_rules_tools');
// var { TimerMgr } = require('openhab_rules_tools');

// const { timeUtils } = require('openhab_rules_tools');
const { utils } = require('openhab-my-utils');
var ruleUID = "light-cycle";
const logger = log(ruleUID);

const {
  ON, OFF, PercentType, OnOffType, HSBType, DecimalType, RGBType, ChronoUnit,
} = require('@runtime');
// val cycleSat = new PercentType(75)
let sat = new PercentType(100);
// val cycleBright = new PercentType(100)
let bright = new PercentType(100);
// val pause = 200
// var Map<String, Timer> cycleTimers = newHashMap

let cycle_timer = null;

rules.JSRule({
  name: 'A light color cycle',
  description: 'A light color cycle',
  triggers: [
    // triggers.GroupStateChangeTrigger('gLightCyclers'),
    // triggers.GroupStateChangeTrigger('gDiningRoomAutoLights'),
    triggers.ItemStateChangeTrigger('v_StartColourBulbsCycle'),
  ],
  execute: (event) => {

    logger.error('A light color cycle');

    // Get the light associated with this cycler
    utils.showEvent(event);
    // const light = items.getItem(event.itemName.toString().replace('CYCLE', 'RGB'));
    const light1 = items.getItem('ZbColourBulb01_color');
    const light2 = items.getItem('ZbColourBulb02_color');
    const light1_switch = items.getItem('ZbColourBulb01_switch');
    const light2_switch = items.getItem('ZbColourBulb02_switch');
    // myutils.showItem(light);
    // utils.dumpObject(light1, true);
    // myutils.showItem(light1);
    // turn off the cycling

    // Start cycling
    logger.debug('CycleColor - Color Loop Activated');

    let hue = 0;

    if (light1_switch.state !== 'ON') light1_switch.sendCommand('ON');
    if (light2_switch.state !== 'ON') light2_switch.sendCommand('ON');

    // if there is a timer already running, cancel it
    if (cycle_timer) {
      cycle_timer.cancel();
    }

    // create a timer to trigger immediately
    const now = time.ZonedDateTime.now();
    if (event.newState == 'ON') {

      cycle_timer = actions.ScriptExecution.createTimer(
        now.plusSeconds(0.5),
        // while the cycle flag is ON and the light remains ON, move the color
        () => {
          logger.error('CycleColor - while the cycle flag is ON and the light remains ON, move the color');
          // myutils.showItem(light1);
          // if (event.newState === 'ON' && light1_switch.state === 'ON') {
          // if (event.newState == 'ON') {
          if (items.getItem('v_StartColourBulbsCycle').state == 'ON') {

            // v_StartColourBulbsCycle
            // if (items.getItem('ZbColourBulb02_CYCLE').state.toString() === 'ON') {
            // hue += (items.getItem('lightCyclerHueStepSize').rawState * direction);
            hue += (items.getItem('lightCyclerHueStepSize').rawState);

            if (hue >= 359) {
              hue -= 359;
            }

            sat = items.getItem('lightCyclerSaturation').rawState;
            bright = items.getItem('lightCyclerBrightness').rawState;

            logger.debug(`CycleColor - sendCommand(HSBType) H: ${hue.toString()}, S: ${sat.toString()}, B: ${bright.toString()}`);
            light1.sendCommand(`${hue.toString()},${sat.toString()},${bright.toString()}`);
            light2.sendCommand(`${hue.toString()},${sat.toString()},${bright.toString()}`);

            const tnow = time.ZonedDateTime.now();
            cycle_timer.reschedule(tnow.plus(items.getItem('lightCyclerIntervalMillis').rawState, time.ChronoUnit.MILLIS));
            // cycle_timer.reschedule(tnow.plus(1000, java.time.temporal.ChronoUnit.MILLIS));
          } else {
            logger.error('CycleColor - cycle flag off');
            if (cycle_timer) {
              cycle_timer.cancel();
            }
            light1_switch.sendCommand('OFF');
            light2_switch.sendCommand('OFF');
          }
        },
      );
    } else {
      logger.error('CycleColor - fffffffffffff');
      if (cycle_timer) {
        cycle_timer.cancel();
      }
      light1_switch.sendCommand('OFF');
      light2_switch.sendCommand('OFF');
      cycle_timer = null;
    }
  },
});
