const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('zb1');
const { timeUtils } = require('openhab_rules_tools');

// # https://community.openhab.org/t/design-pattern-motion-sensor-timer/14954

const timeoutMinutes = 'PT30M'; // use an appropriate value


var { TimerMgr } = require('openhab_rules_tools');
var timerMgr = cache.private.get('timers', () => TimerMgr());


scriptLoaded = function () {
  logger.info('scriptLoaded -   zb_PIR_SENSORS_Availabilityb');

  items.getItem('gZbPIRSensorsReachable').members.forEach((item) => {
    item.postUpdate('OFF');
  });

  items.getItem('gZbPIRSensorBatteries').members.forEach((item) => {
    item.postUpdate(0);
  });

};


rules.JSRule({
  name: 'monitor ZB  pir sensor availability update zb Online/Offline status',
  description: 'monitor ZB  pir sensor availability update zb Online/Offline status',
  triggers: [
    triggers.GroupStateUpdateTrigger('gZbPIRSensorOccupancy'),
    triggers.GroupStateUpdateTrigger('gZbPIRSensorBatteries')
  ],

  execute: (event) => {
    logger.debug(`update to gZbPIRxx status, triggering item name: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
    // myutils.showGroupMembers('gTHSensorTemperatures');
    // var trythisUID = rules.getUID();
    var trythisUID = "zbPIR";
    const stub = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    const itemNameReachable = `${stub}_reachable`;
    const itemNameBattery = `${stub}_battery`;
    logger.debug(`get id part of item reachable: ${stub} `);

    items.getItem(itemNameReachable).postUpdate('ON');
    logger.debug(`postUpdate('ON'): ${itemNameReachable} `);
    // console.warn(`--- BG sockets Online/Offline status marked  Online : ${itemNameReachable} `);


    timerMgr.check(itemNameReachable, timeoutMinutes, () => {

      items.getItem(itemNameReachable).postUpdate('OFF');// ???OFF???
      items.getItem(itemNameBattery).postUpdate(0);// ???OFF???
      logger.debug(`!! TIMER HAS ENDED,POSTED OFFLINE: ${itemNameReachable} `);

      // }, true, null, ruleUID+'_'+itemNameReachable);
    }, true, null, trythisUID + '_' + itemNameReachable);

  },
});



