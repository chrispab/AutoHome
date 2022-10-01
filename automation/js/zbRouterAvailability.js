const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('BG_Availability.js');
const { timeUtils } = require('openhab_rules_tools');

scriptLoaded = function () {
  logger.warn('scriptLoaded -   init   BG router avail status');
  items.getItem('ZbRouter_01_Reachable').postUpdate('startup Value');
};

const routerTimeout = 61; // use an appropriate value

let zbRouterTimer = {};
// zbRouterTimer = setTimeout(() => { console.log('initial zb router avail Timer expired.'); }, routerTimeout - 10); // Would log 'Timer expired.' in 10s.
zbRouterTimer = actions.ScriptExecution.createTimer(timeUtils.toDateTime((routerTimeout * 1000)), () => {
  items.getItem('ZbRouter_01_Reachable').postUpdate('Offline');
});

rules.JSRule({
  name: 'monitor ZB Router availability',
  description: 'monitor ZB Router availability',
  triggers: [triggers.ItemStateUpdateTrigger('ZbRouter_01_Quality')],
  execute: (event) => {
    console.warn(`==== zbRouterAvailm::: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
    // myutils.showGroupMembers('gBG_socket_maxworktime_updates');

    items.getItem('ZbRouter_01_Reachable').postUpdate('Online');
    // console.warn(`--- BG sockets Online/Offline status marked  Online : ${itemNameReachable} `);
    console.warn(`=v= zbRouterAvail::: ${zbRouterTimer} : ,  received  update event.receivedState: ${event.receivedState}`);

    // if (timers.hasOwnProperty(itemNameReachable)) {
    // console.warn(`***--- itemNameReachable FOUND property/key in timers array: ${itemNameReachable} `);
    // console.warn(`**--- FOUND property/key in timers array, RESTART THE TIMER: ${itemNameReachable} `, timers[itemNameReachable]);
    console.log(zbRouterTimer.toString());
    // if ((zbRouterTimer) && !zbRouterTimer.hasTerminated()) { // RESTART timer
    console.warn('!!!!!x!!---timer exists or is running, Lets cancel and restart it');
    // }
    zbRouterTimer.cancel();
    // zbRouterTimer = setTimeout(() => { items.getItem('ZbRouter_01_Reachable').postUpdate('Offline'); }, routerTimeout); // Would log 'Timer expired.' in 10s.

    zbRouterTimer = actions.ScriptExecution.createTimer(timeUtils.toDateTime((routerTimeout * 1000)), () => {
      items.getItem('ZbRouter_01_Reachable').postUpdate('Offline');
    });
    console.warn('!!!!!x!!---timer restarted');

    // NOT YET terminated STILL RUNNING...
    // timers[itemNameReachable].reschedule(timeUtils.toDateTime((timeoutSeconds * 1000)), // , () => {
    // );
    // } else { // dosent exists so create a new one  actions.ScriptExecution.createTimer
    // timers[itemNameReachable] = actions.ScriptExecution.createTimer(timeUtils.toDateTime((timeoutSeconds * 1000)), () => {
    // items.getItem(itemNameReachable).postUpdate('Offline');
    // console.warn(`!! TIMER HAS ENDED,POSTED OFFLINE: ${itemNameReachable} `, timers[itemNameReachable]);
  },
});
