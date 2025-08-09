// zb_colour_bulbs_lightCycle.js] - require TimerMgr instead of cycleTimerMgr
// and use TimerMgr() instead of new cycleTimerMgr.TimerMgr().
const {
  log, items, rules, actions, time, triggers, cache,
} = require('openhab');

const { utils } = require('openhab-my-utils');

const ruleUID = 'light-cycle';
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.light-cycle
// log:set INFO org.openhab.automation.openhab-js.light-cycle
const {
  ON, OFF, PercentType, OnOffType, HSBType, DecimalType, RGBType, ChronoUnit,
} = require('@runtime');

// Initialize hueStored in a way that handles the absence of the cached value
let hueStored = cache.private.get('hueStored');
if (hueStored === undefined) {
  hueStored = 0;
  cache.private.put('hueStored', hueStored);
}

let saturation = new PercentType(100);
let brightness = new PercentType(100);

const { LoopingTimer } = require('openhab_rules_tools');

const lt = LoopingTimer();
const light1 = items.getItem('ZbColourBulb01_color');
const light2 = items.getItem('ZbColourBulb02_color');
const light1_switch = items.getItem('ZbColourBulb01_switch');
const light2_switch = items.getItem('ZbColourBulb02_switch');

const func = () => {
  if (items.getItem('v_StartColourBulbsCycle').state == 'ON') {
    // get stored hue
    hueStored = cache.private.get('hueStored');
    if (hueStored === undefined) {
      hueStored = 0;
    }
    hueStored += (items.getItem('lightCyclerHueStepSize').rawState);
    if (hueStored >= 360) { // Changed from 359 to 360
      hueStored -= 360; // Changed from 359 to 360
    }
    // save current hue
    cache.private.put('hueStored', hueStored);

    saturation = items.getItem('lightCyclerSaturation').rawState;
    brightness = items.getItem('lightCyclerBrightness').rawState;

    logger.debug(`move Color - Command(HSBType) H: ${hueStored.toString()}, S: ${saturation.toString()}, B: ${brightness.toString()}`);
    light1.sendCommand(`${hueStored.toString()},${saturation.toString()},${brightness.toString()}`);
    light2.sendCommand(`${hueStored.toString()},${saturation.toString()},${brightness.toString()}`);
  } else {
    logger.debug('CycleColor - inner off');
    lt.cancel();
    light1_switch.sendCommand('OFF');
    light2_switch.sendCommand('OFF');
  }
};

rules.JSRule({
  name: 'A light color cycle',
  description: 'A light color cycle',
  triggers: [
    triggers.ItemStateChangeTrigger('v_StartColourBulbsCycle'),
  ],
  execute: (event) => {
    logger.debug('entered light color cycle ItemStateChangeTrigger');

    if (event.newState == 'ON') {
      logger.debug('CycleColor ON - Color Loop Activated');
      light1_switch.sendCommand('ON');
      light2_switch.sendCommand('ON');

      const timerDuration = items.getItem('lightCyclerIntervalMillis').rawState;
      lt.loop(func, timerDuration);
    } else {
      logger.debug('CycleColor - outer-event.newState == OFF');
      lt.cancel();
      light1_switch.sendCommand('OFF');
      light2_switch.sendCommand('OFF');
    }
  },
});
