const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('zb1');
const { timeUtils } = require('openhab_rules_tools');

// log:set DEBUG org.openhab.automation.openhab-js.zb1


// # https://community.openhab.org/t/design-pattern-motion-sensor-timer/14954

//timer mgr
// https://community.openhab.org/t/making-sure-that-only-one-timer-exists-per-itemname/149723/2
var {TimerMgr} = require('openhab_rules_tools');
var tm = cache.private.get('timers', () => TimerMgr());
https://community.openhab.org/t/array-of-timers-dynamically-instantiated-timers-based-on-triggeringitem-name/142850
// var vLightName = event.itemName.split("_").get(1);
// timerMgr.check(vLightName, 'PT1M', () => { console.info('timer ran'); }, false, null, ruleUID+'_'+vLightName);
// When check is called, if a timer doesn’t exist it creates one. The arguments are:

// key: unique identifier for the Timer, usually best to use an Item name
// timeout: anything supported by time.toZDT(), in this case it’s an ISO8601 Duration string for one minute
// function: the function to call when the timer expires.
// reschedule: when true, if the timer already exists it will be rescheduled using the timeout
// flapping function: an optional function to call if check is called and the timer already exists
// name: a name you can give to the timer so if there is an error in the timer function, you can identify what timer it came from


scriptLoaded = function () {
  logger.warn('scriptLoaded -   zb temp sensors init');
  items.getItem('gZbTHSensorsReachable').members.forEach((item) => {
    item.postUpdate('OFF');
  });

  items.getItem('gZbTHSensorsBattery').members.forEach((item) => {
    item.postUpdate(0);
  });

};

const timers = {};// [];
const timeoutMinutes = 45; // use an appropriate value

rules.JSRule({
  name: 'monitor ZB  temp sensor availability update zb sockets Online/Offline status',
  description: 'monitor ZB  temp sensor availability update zb sockets Online/Offline status',
  triggers: [triggers.GroupStateUpdateTrigger('gTHSensorTemperatures')],
  execute: (event) => {
    logger.debug(`update gTHSensorTemperatures Online/Offline status, triggering item name: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
    // myutils.showGroupMembers('gTHSensorTemperatures');

    const stub = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    const itemNameReachable = `${stub}_reachable`;
    const itemNameBattery = `${stub}_battery`;
    logger.debug(`get id part of item reachable: ${stub} `);

    items.getItem(itemNameReachable).postUpdate('ON');
    logger.debug(`postUpdate('ON'): ${itemNameReachable} `);
    // console.warn(`--- BG sockets Online/Offline status marked  Online : ${itemNameReachable} `);

    if (timers.hasOwnProperty(itemNameReachable)) {
      logger.debug(`***--- itemNameReachable FOUND property/key in timers array: ${itemNameReachable} `);
      logger.debug(`**--- FOUND property/key in timers array, RESTART THE TIMER: ${itemNameReachable} `, timers[itemNameReachable]);

      if (timers[itemNameReachable].hasTerminated()) { // RESTART timer
        logger.debug(`!!!!!!!---timer has terminated, Lets recreate it: ${itemNameReachable} `, timers[itemNameReachable]);
      }
      // NOT YET terminated STILL RUNNING...
      timers[itemNameReachable].reschedule(time.toZDT((timeoutMinutes * 60 * 1000)), // , () => {
      );
    } else { // dosent exists so create a new one  actions.ScriptExecution.createTimer
      timers[itemNameReachable] = actions.ScriptExecution.createTimer(time.toZDT((timeoutMinutes * 60 * 1000)), () => {
        items.getItem(itemNameReachable).postUpdate('OFF');// ???OFF???
        items.getItem(itemNameBattery).postUpdate(0);// ???OFF???

        logger.debug(`!! TIMER HAS ENDED,POSTED OFFLINE: ${itemNameReachable} `, timers[itemNameReachable]);
      });
      logger.debug(`**--- timer started CREATED NEW: ${itemNameReachable} `, timers[itemNameReachable]);
    }
  },
});
