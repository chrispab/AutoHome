const {
  log, items, rules, actions,
} = require('openhab');
const { someProperty,utils} = require('openhab-my-utils');

var { TimerMgr } = require('openhab_rules_tools');
var timerMgr = cache.private.get('timers', () => TimerMgr());

var ruleUID = "bg_avail";
const logger = log(ruleUID);
// const { timeUtils } = require('openhab_rules_tools');

scriptLoaded = function () {
  logger.info('scriptLoaded - BG availability');
  // myutils.showGroupMembers('gBG_sockets_reachable');
  items.getItem('gBG_sockets_reachable').members.forEach((item) => {
    item.postUpdate('OFF');
  });
  
  logger.info(`from my node lib someProperty.. : ${someProperty}`);
  logger.info(`from my node lib showGroupMembers gBG_sockets_reachable: ${utils.showGroupMembers('gBG_sockets_reachable', logger)}`);
  logger.info(`whole name: ${'gBG_sockets_reachable'}`);

  logger.info(`location: ${utils.extractRoomPrefix('gBG_sockets_reachable',logger)}`);


};
// log:set DEBUG org.openhab.automation.openhab-js.bg_avail

const timeout = 'PT1M'; // use an appropriate value

rules.JSRule({
  name: 'update BG sockets Online/Offline status',
  description: 'update BG sockets Online/Offline status',
  triggers: [triggers.GroupStateUpdateTrigger('gBG_socket_maxworktime_updates')],
  execute: (event) => {
    logger.debug(`update BG sockets Online/Offline status, triggering item name: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
   // myutils.showGroupMembers('gBG_socket_maxworktime_updates');
    const stub = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
    const itemNameReachable = `${stub}_reachable`;
    logger.debug(`get id part of item reachable: ${stub} `);

    items.getItem(itemNameReachable).postUpdate('ON');
    logger.debug(`postUpdate('ON'): ${itemNameReachable} `);

    timerName = ruleUID + '_' + itemNameReachable;
    logger.debug(`retriggering timer: ${timerName} `);


    timerMgr.check(itemNameReachable, timeout, () => {
      items.getItem(itemNameReachable).postUpdate('OFF');// ???OFF???
      // items.getItem(itemNameBattery).postUpdate(0);// ???OFF???
      logger.debug(`${timerName} TIMER HAS ENDED,POSTED OFFLINE: ${itemNameReachable} `);
    }, true, null, timerName);
  },
});