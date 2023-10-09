const {
  log, items, rules, actions, triggers,
} = require('openhab');

var ruleUID = "zb1_pir";

const logger = log(ruleUID);
const { timeUtils } = require('openhab_rules_tools');
// openhab> log:set DEBUG org.openhab.automation.openhab-js.zb1_pir
// # https://community.openhab.org/t/design-pattern-motion-sensor-timer/14954



var { TimerMgr } = require('openhab_rules_tools');
var timerMgr = cache.private.get('timers', () => TimerMgr());


scriptLoaded = function () {
  logger.info('scriptLoaded -   zb_PIR_sensors_Availability');

  items.getItem('gZbPIRSensorsReachable').members.forEach((item) => {
    item.postUpdate('OFF');
  });

  items.getItem('gZbPIRSensorBatteries').members.forEach((item) => {
    item.postUpdate(0);
  });

};

var timeout = 'PT60M'; // use an appropriate value

rules.JSRule({
  name: 'ZB  pir sensor availability',
  description: 'ZB pir sensor availability update status',
  triggers: [
    triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy'),
    // triggers.GroupStateUpdateTrigger('gZbPIRSensorBatteries')
  ],

  execute: (event) => {
    logger.debug(`gZbPIRxx Update, triggering itemName: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
    // myutils.showGroupMembers('gTHSensorTemperatures');
    const stub = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    const itemNameReachable = `${stub}_reachable`;
    const itemNameBattery = `${stub}_battery`;
    logger.debug(`stub of triggering itemName: ${stub} `);

    items.getItem(itemNameReachable).postUpdate('ON');
    logger.debug(`postUpdate('ON') to: ${itemNameReachable} `);
    timerName = ruleUID + '_' + itemNameReachable;
    logger.debug(`retriggering timer: ${timerName} `);

    timerMgr.check(itemNameReachable, timeout, () => {

      items.getItem(itemNameReachable).postUpdate('OFF');// ???OFF???
      items.getItem(itemNameBattery).postUpdate(0);// ???OFF???
      logger.info(`${timerName} availability TIMER HAS ENDED,POSTED OFFLINE: ${itemNameReachable} `);

    }, true, null, timerName);

  },
});



