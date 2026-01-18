const {
  log, items, rules, actions, triggers, time,
} = require('openhab');
// const { utils } = require('openhab-my-utils');

const ruleUID = 'lg-tv';
const logger = log(ruleUID);

scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
};

// rule - when v_CT_TV_launchBrowser goes from off to on launch the lg tv browser
// when v_CT_TV_launchBrowser goes from on to off do nothing
rules.JSRule({
  name: 'Launch LG TV browser',
  description: 'Launch LG TV browser when v_CT_TV_launchBrowser is turned on',
  triggers: [
    triggers.ItemStateUpdateTrigger('v_CT_TV_launchBrowser', 'ON'),
  ],
  execute: (event) => {
    logger.error('>--------------------------------------------------------------------');
    logger.debug('>v_CT_TV_launchBrowser changed to ON - launch TV browser');
    logger.debug(`>item: ${event.itemName} triggered event, new state : ${event.newState}`);

    const lg_actions = actions.Things.getActions('lgwebos', 'lgwebos:WebOSTV:tv_conservatory');
    if (lg_actions === null) {
      logger.error('Actions not found, check thing ID');
      return;
    }

    // const tvItem = items.getItem('CT_LGWebOS_TV');
    // logger.debug(`>tvItem: ${tvItem.name}, state: ${tvItem.state}`);

    logger.debug('>Sending command LAUNCH_BROWSER to TV');
    // tvItem.sendCommand('LAUNCH_BROWSER');
    lg_actions.launchBrowser('http://192.168.0.101:8080/page/my_overview');

    // reset v_CT_TV_launchBrowser to OFF after launching browser
    time.setTimeout(() => {
      logger.debug('>Resetting v_CT_TV_launchBrowser to OFF');
      items.getItem('v_CT_TV_launchBrowser').sendCommand('OFF');
    }, 5000); // 5 second delay before resetting to OFF
  },
});
