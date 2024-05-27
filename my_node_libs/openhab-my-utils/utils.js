const {
  log, items,
} = require('openhab');

/**
 * Logs the information of an item.
 *
 * @param {Object} data - The data object containing the item information.
 * @param {Object} [logger] - An optional logger object. If not provided, a default logger will be used.
 * @return {void} This function does not return anything.
 */
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
    '====: showEvent ====: Event.itemName: ' + event.itemName +
    ', label: ' + items.getItem(event.itemName).label +
    ', state: ' + items.getItem(event.itemName).state +
    ', receivedState: ' + items.getItem(event.itemName).receivedState +
    ', oldState: ' + items.getItem(event.itemName).oldState +
    ', newState: ' + items.getItem(event.itemName).newState

  );
  // console.log(event);
}

// const timersOn = [];test
// const timersOff = [];
var tpos = 500;
exports.toggleItem = function (itemNameStr, nToggles, durationMs, logger) {
  var logger = (logger) ? logger : log('utils.toggleItem');
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


/**
 * Returns the prefix of a location based on the given item name.
 *
 * @param {string} itemName - The name of the item.
 * @param {object} logger - Optional logger object for debugging.
 * @return {string} The prefix of the location.
 */
exports.getLocationPrefix = function (itemName, logger) {
  var logger = (logger) ? logger : log('utils.getLocationPrefix');

  // can prersent as 'v_ID_' or 'ID_'
  // if first 2 chars are 'v_' then trim them off
  var roomPrefix;
  // logger.debug('getLocationPrefix :{}','v2');

  if (itemName.toString().startsWith("v_")) {
    roomPrefix = itemName.toString().substr(itemName.indexOf('_') + 1).substr(0, itemName.indexOf('_') + 1);
    logger.error(`getLocationPrefix startsWith v_, roomPrefixPartial : ${roomPrefix}`);
  } else {
    roomPrefix = itemName.toString().substr(0, itemName.indexOf('_'));
    logger.error(`getLocationPrefix immediate ID, roomPrefix : ${roomPrefix}`);
  }

  var roomPrefix2;
  if (itemName.toString().startsWith("v_")) {
    var startIndex = itemName.indexOf('_') + 1;
    var endIndex = itemName.indexOf('_', startIndex);
    roomPrefix2 = itemName.substring(startIndex, endIndex);
    logger.error(`getLocationPrefix startsWith v_, roomPrefix2Partial : ${roomPrefix2}`);
  } else {
    var endIndex = itemName.indexOf('_');
    roomPrefix2 = itemName.substring(0, endIndex);
    logger.error(`getLocationPrefix immediate ID, roomPrefix2 : ${roomPrefix2}`);
  }
  return roomPrefix;
}