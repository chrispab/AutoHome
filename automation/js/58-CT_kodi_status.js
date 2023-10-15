const {
  log, items, rules, actions, triggers,
} = require('openhab');
var ruleUID = "CT_kodi_status";

const logger = log(ruleUID);// const thingStatusInfo = actions.Things.getThingStatusInfo("zwave:serial_zstick:512");
// console.log("Thing status",thingStatusInfo.getStatus());
// triggers.ThingStatusChangeTrigger('some:thing:uuid','ONLINE','OFFLINE')
scriptLoaded = function () {
  logger.info('======set KodiConservatory status scriptLoaded');
  // loadedDate = Date.now();
  logger.info('startup- set Kodi_CT_Online_Status status ');
  const thingStatusInfo = actions.Things.getThingStatusInfo('kodi:kodi:4cc97fc0-c074-917d-e452-aed8219168eb');
  logger.info('Thing Kodi_CT_Online_Status status', thingStatusInfo.getStatus());

  if (thingStatusInfo.getStatus().toString() == 'ONLINE') {
    items.getItem('Kodi_CT_Online_Status').postUpdate('ONLINE');
  } else {
    items.getItem('Kodi_CT_Online_Status').postUpdate('OFFLINE');
  }
};

rules.JSRule({
  name: 'set Kodi_CT_Online_Status status',
  description: 'set Kodi_CT_Online_Status status',
  triggers: [triggers.ThingStatusChangeTrigger('kodi:kodi:4cc97fc0-c074-917d-e452-aed8219168eb')],
  execute: (data) => {
    logger.info('set Kodi_CT_Online_Status status');
    const thingStatusInfo = actions.Things.getThingStatusInfo('kodi:kodi:4cc97fc0-c074-917d-e452-aed8219168eb');
    logger.info('Thing Kodi_CT_Online_Status status', thingStatusInfo.getStatus());

    if (thingStatusInfo.getStatus().toString() == 'ONLINE') {
      items.getItem('Kodi_CT_Online_Status').postUpdate('ONLINE');
    } else {
      items.getItem('Kodi_CT_Online_Status').postUpdate('OFFLINE');
    }
  },
});
