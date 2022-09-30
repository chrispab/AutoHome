// zbRouterTimer = None
// routerTimeout = 61

// @rule("monitor ZB Router availability", description="monitor ZB Router availability", tags=["zigbee"])
// @when("Item ZbRouter_01_Quality received update")
// def zbRouterAvail(event):
//     # zbRouterAvail.log.debug("== zbRouterAvail::")
//     # LogAction.logDebug("zbRouterAvail", "==xxxccc Item {} received update: {}", event.itemName, event.itemState)
//     events.postUpdate("ZbRouter_01_Reachable","Online")
//     #log.debug("Battery charging monitor: {}: start".format(event.itemState))
//     global zbRouterTimer
//     if zbRouterTimer is not None and not zbRouterTimer.hasTerminated():
//         zbRouterTimer.cancel()
//     zbRouterTimer = ScriptExecution.createTimer(DateTime.now().plusSeconds(routerTimeout), lambda: events.postUpdate("ZbRouter_01_Reachable","Offline"))
//     # zbRouterAvail.log.debug("==== zbRouterAvail timer started!!!!!!!!!!!::")

const {
    log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('BG_Availability.js');
const { timeUtils } = require('openhab_rules_tools');

const routerTimeout = 61; // use an appropriate value

// let zbRouterTimer = {};// [];
// zbRouterTimer = setTimeout(() => { console.log('initial zb router avail Timer expired.'); }, routerTimeout - 10); // Would log 'Timer expired.' in 10s.
let zbRouterTimer = actions.ScriptExecution.createTimer(timeUtils.toDateTime((zbRouterTimer * 1000)), () => {
    items.getItem('ZbRouter_01_Reachable').postUpdate('Offline');
});
rules.JSRule({
    name: 'monitor ZB Router availability',
    description: 'monitor ZB Router availability',
    triggers: [triggers.ItemStateUpdateTrigger('ZbRouter_01_Quality')],
    execute: (event) => {
        console.warn(`== zbRouterAvail::: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
        // myutils.showGroupMembers('gBG_socket_maxworktime_updates');

        // const stub = event.itemName.toString().substr(0, event.itemName.lastIndexOf('_'));
        // const itemNameReachable = `${stub}_reachable`;
        // console.warn(`get id part of item reachable: ${stub} `);

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

        zbRouterTimer = actions.ScriptExecution.createTimer(timeUtils.toDateTime((zbRouterTimer * 1000)), () => {
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
// console.warn(`**--- timer started CREATED NEW: ${itemNameReachable} `, timers[itemNameReachable]);
//         }
//     },
// });
