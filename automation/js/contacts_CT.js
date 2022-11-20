const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { timeUtils } = require('openhab_rules_tools');

const logger = log('TVs on off.js');

let tStartup;

rules.JSRule({
  name: 'CT contact01 went true',
  description: 'CT contact01 went true',
  triggers: [triggers.ItemStateChangeTrigger('zb_contact_01_contact', 'false', 'true')],
  execute: () => {
    logger.warn('CT contact01 went true');
    const message = 'Thanks else';
    actions.Voice.say(message);
    // turnOnTV('shutdownKodiBedroomProxy', 'wifi_socket_3_power', message);
  },
});
rules.JSRule({
  name: 'CT contact01 went fasle',
  description: 'CT contact01 went false',
  triggers: [triggers.ItemStateChangeTrigger('zb_contact_01_contact', 'true', 'false')],
  execute: () => {
    logger.warn('CT contact01 went false');
    const message = 'Hey Elsie, youve left the back door open. Please close it, or get a cuffing';
    actions.Voice.say(message);
    // turnOnTV('shutdownKodiBedroomProxy', 'wifi_socket_3_power', message);
  },
});
