//  235 │ Resolved │  80 │ 3.3.0.202204022241     │ openHAB Add-ons :: Bundles :: Automation :: JSScripting Nashorn

const {
  log, items, rules, actions, triggers,
} = require('openhab');
// const { myutils } = require('personal');

const logger = log('logreader:reader:bbbopenhabcloud:newCustomEvent');
// const { timeUtils } = require('openhab_rules_tools');

const { alerting } = require('personal');

const previousLightSensorLevel = null;
const Cloud_Test_Timer = null;

scriptLoaded = function () {
  logger.error('scriptLoaded - logreadernewCustomEvent');
  alerting.sendInfo('scriptLoadedx;;.........');
};

rules.JSRule({
  name: 'logreader:reader:openhabcloud:newCustomEvent',
  description: 'logreader:reader:openhabcloud:newCustomEvent',
  triggers: [triggers.ChannelEventTrigger('logreader:reader:openhabcloud:newCustomEvent')],
  execute: () => {
    logger.error('triggered   logreader:reader:openhabcloud:newCustomEventt');
    // items.getItem('gConservatoryLights').sendCommand('OFF');
    // items.getItem('gColourBulbs').sendCommand('OFF');
    alerting.sendInfo('logreader:reader============,,,======');

    // Cancel any running timers. This is in case you have multiple disconnections/reconnections in a short time frame.
    // Cloud_Test_Timer?.cancel;
    if (Cloud_Test_Timer && Cloud_Test_Timer.isActive()) {
      Cloud_Test_Timer.cancel();
    }
    // const myTimer = actions.ScriptExecution.createTimer('My Timer', now.plusSeconds(10), timerOver);

    // Set the testing status message
    // myopenHAB_Connection.postUpdate('Testing');
    // items.getItem('myopenHAB_Connection').postUpdate('Testing');
    alerting.sendInfo('myopenHAB_Connection reconnected');

    // Post a command to reset myopenHAB_Connection through the cloud
    // Post_Test_Command.sendCommand(ON);
    // items.getItem('Post_Test_Command').sendCommand('ON');
    items.getItem('myopenHAB_Connection_Success').postUpdate(items.getItem('myopenHAB_Connection_Success').rawState + 1);

    // const myTimer = actions.ScriptExecution.createTimer('My Timer', now.plusSeconds(10), timerOver);
  },
});
