// zb_colour_bulbs_lightCycle.js] - require TimerMgr instead of timerMgr and use TimerMgr() instead of new timerMgr.TimerMgr().
const {
  log, items, rules, actions, time, triggers
} = require('openhab');
// const { CountdownTimer, timeUtils, timerMgr } = require('openhab_rules_tools');
// var { TimerMgr } = require('openhab_rules_tools');

const { utils } = require('openhab-my-utils');
var ruleUID = "light-cycle";
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.light-cycle
// log:set INFO org.openhab.automation.openhab-js.light-cycle
const {
  ON, OFF, PercentType, OnOffType, HSBType, DecimalType, RGBType, ChronoUnit,
} = require('@runtime');

var { TimerMgr } = require('openhab_rules_tools');
var timerMgr = cache.private.get('timerMgr', () => TimerMgr());
var hueStored = cache.private.get('hueStored', hueStored = 0);

let sat = new PercentType(100);
let bright = new PercentType(100);


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

    logger.debug('entered light color cycle');

    const light1 = items.getItem('ZbColourBulb01_color');
    const light2 = items.getItem('ZbColourBulb02_color');
    const light1_switch = items.getItem('ZbColourBulb01_switch');
    const light2_switch = items.getItem('ZbColourBulb02_switch');

    hueStored = cache.private.get('hueStored');

    // create a timer to trigger immediately
    const now = time.ZonedDateTime.now();
    if (event.newState == 'ON') {
      logger.debug('CycleColor ON - Color Loop Activated');
      if (light1_switch.state !== 'ON') light1_switch.sendCommand('ON');
      if (light2_switch.state !== 'ON') light2_switch.sendCommand('ON');

      timerKey = event.itemName;
      timerDuration = 3000;//ms
      timerFunc = 'funnc';
      timerName = 'yn';
      lightNames = 'lnmaes';
      //re/start the timer
      // timerMgr.check(timerKey, timerDuration, timerFunc(currentSensorLight), true, null, timerName);
      logger.debug('OFF > ON timerMgr.check - timerKey:{}, duration-s:{}, timerFunc:{}, lightNames:{}, timerRuleName:{} ', timerKey, Math.round(timerDuration / 1000), 'dummyOffTimer', JSON.stringify(lightNames), timerName);


      cycle_timer = actions.ScriptExecution.createTimer(
        now.plusSeconds(0.5),
        // while the cycle flag is ON and the light remains ON, move the color
        () => {
          // logger.debug('CycleColor - while the cycle flag is ON and the light remains ON, move the color');

          if (items.getItem('v_StartColourBulbsCycle').state == 'ON') {

            //get stored hue
            hueStored = cache.private.get('hueStored');

            hueStored += (items.getItem('lightCyclerHueStepSize').rawState);
            if (hueStored >= 359) {
              hueStored -= 359;
            }

            sat = items.getItem('lightCyclerSaturation').rawState;
            bright = items.getItem('lightCyclerBrightness').rawState;

            logger.debug(`CycleColor - sendCommand(HSBType) H: ${hueStored.toString()}, S: ${sat.toString()}, B: ${bright.toString()}`);
            light1.sendCommand(`${hueStored.toString()},${sat.toString()},${bright.toString()}`);
            light2.sendCommand(`${hueStored.toString()},${sat.toString()},${bright.toString()}`);

            //save current hue
            cache.private.put('hueStored', hueStored);

            const tnow = time.ZonedDateTime.now();
            cycle_timer.reschedule(tnow.plus(items.getItem('lightCyclerIntervalMillis').rawState, time.ChronoUnit.MILLIS));
          } else {
            logger.error('CycleColor - off');
            if (cycle_timer) {
              cycle_timer.cancel();
            }
            light1_switch.sendCommand('OFF');
            light2_switch.sendCommand('OFF');
          }
        },
      );
    } else {
      logger.debug('CycleColor - OFF');
      if (cycle_timer) {
        cycle_timer.cancel();
      }
      light1_switch.sendCommand('OFF');
      light2_switch.sendCommand('OFF');
      cycle_timer = null;
    }
  },
});

var timerFunc = () => {
  return () => {
    // logger.debug('CycleColor - while the cycle flag is ON and the light remains ON, move the color');

    if (items.getItem('v_StartColourBulbsCycle').state == 'ON') {

      //get stored hue
      hueStored = cache.private.get('hueStored');

      hueStored += (items.getItem('lightCyclerHueStepSize').rawState);
      if (hueStored >= 359) {
        hueStored -= 359;
      }

      sat = items.getItem('lightCyclerSaturation').rawState;
      bright = items.getItem('lightCyclerBrightness').rawState;

      logger.debug(`CycleColor - sendCommand(HSBType) H: ${hueStored.toString()}, S: ${sat.toString()}, B: ${bright.toString()}`);
      light1.sendCommand(`${hueStored.toString()},${sat.toString()},${bright.toString()}`);
      light2.sendCommand(`${hueStored.toString()},${sat.toString()},${bright.toString()}`);

      //save current hue
      cache.private.put('hueStored', hueStored);

      const tnow = time.ZonedDateTime.now();
      cycle_timer.reschedule(tnow.plus(items.getItem('lightCyclerIntervalMillis').rawState, time.ChronoUnit.MILLIS));

      
    } else {
      logger.error('CycleColor - off');
      if (cycle_timer) {
        cycle_timer.cancel();
      }
      light1_switch.sendCommand('OFF');
      light2_switch.sendCommand('OFF');
    }
  }
}