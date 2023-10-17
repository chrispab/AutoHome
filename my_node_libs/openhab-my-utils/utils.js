const {
  log, items,
} = require('openhab');

exports.showItem = function (data, logger) {
  var logger = (logger) ? logger : log('utils.showItem');

  logger.debug(
    '========showItem data info: DATA.itemName: ' + data.name
    // + ', LABEL: ' + items.getItem(data.itemName).label +
    + ', LABEL: ' + data.label +

    ', STATE: ' + data.state
    //  + ', PREV STATExx: ' + data.previousState()
  );
}

exports.showGroupMembers = function (groupName, logger) {
  var logger = (logger) ? logger : log('utils.showGroupMembers');
  var allInfo = '============\n';
  var memberInfo = '';

  logger.debug(`Group Name : ${groupName}`);
  // below will list all items and states in a group
  items.getItem(groupName).members.forEach((member) => {
    memberInfo = `NAME:${member.name}, LABEL: ${member.label}, STATE: ${member.state}`;
    allInfo = `${allInfo + memberInfo},\n`;
  });
  logger.debug(`List of Group Members: ${allInfo}`);
}

exports.showEvent = function (event, logger) {
  var logger = (logger) ? logger : log('utils.showEvent');

  logger.debug(
    '=========: showEvent data: Event.itemName: ' + event.itemName
    + ', LABEL: ' + items.getItem(event.itemName).label +
    ', STATE: ' + items.getItem(event.itemName).state +
    ', PREV STATExx: ' + items.getItem(event.itemName).history.previousState()
  );
  // console.log(event);
}

const timersOn = [];
const timersOff = [];
var tpos = 500;
exports.toggleItem = function (itemNameStr, nToggles, durationMs, logger) {
  var logger = (logger) ? logger : log('sendInfo');
  // logger.error('Email message to send: ' + message);


  theItem = items.getItem(itemNameStr);

  currentState = items.getItem('KT_light_1_Power').state;

  for (let index = 0; index < nToggles; index++) {
    // timersOff[index] = ''
    actions.ScriptExecution.createTimer(timeUtils.toDateTime((tpos)), () => {
      theItem.sendCommand('OFF');
      logger.debug('theItem off');
    });
    tpos = tpos + (durationMs / 2);
    // timersOn[index] =
    actions.ScriptExecution.createTimer(timeUtils.toDateTime((tpos)), () => {
      theItem.sendCommand('ON');
      logger.debug('theItem on ');
    });
    tpos = tpos + (durationMs / 2);
  }

}


exports.getLocationPrefix = function(itemName, logger) {
  // can prersent as 'v_ID_' or 'ID_'
  // if first 2 chars are 'v_' then trim them off
  var roomPrefix;
  logger.debug('getLocationPrefix :{}','v2');

  if (itemName.toString().startsWith("v_")) {
    roomPrefix = itemName.toString().substr(itemName.indexOf('_') + 1).substr(0, itemName.indexOf('_')+1);
    logger.debug(`getLocationPrefix startsWith v_, roomPrefixPartial : ${roomPrefix}`);
  } else {
    roomPrefix = itemName.toString().substr(0, itemName.indexOf('_'));
    logger.debug(`getLocationPrefix immediate ID, roomPrefix : ${roomPrefix}`);
  }
  return roomPrefix;
}