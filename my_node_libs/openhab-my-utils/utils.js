const {
  log, items,
} = require('openhab');

exports.showItem = function (data, logger) {
  var logger = (logger) ? logger : log('utils.showItem');

  logger.warn(
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

  logger.warn(`Group Name : ${groupName}`);
  // below will list all items and states in a group
  items.getItem(groupName).members.forEach((member) => {
    memberInfo = `NAME:${member.name}, LABEL: ${member.label}, STATE: ${member.state}`;
    allInfo = `${allInfo + memberInfo},\n`;
  });
  logger.warn(`List of Group Members: ${allInfo}`);
}

exports.showEvent = function (event, logger) {
  var logger = (logger) ? logger : log('utils.showEvent');

  logger.warn(
    '=========: showEvent data: Event.itemName: ' + event.itemName
    + ', LABEL: ' + items.getItem(event.itemName).label +
    ', STATE: ' + items.getItem(event.itemName).state +
    ', PREV STATExx: ' + items.getItem(event.itemName).history.previousState()
  );
  console.log(event);
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
      logger.error('theItem off');
    });
    tpos = tpos + (durationMs / 2);
    // timersOn[index] =
    actions.ScriptExecution.createTimer(timeUtils.toDateTime((tpos)), () => {
      theItem.sendCommand('ON');
      logger.error('theItem on ');
    });
    tpos = tpos + (durationMs / 2);
  }

}


// extractRoomPrefix('gBG_sockets_reachable')
exports.extractRoomPrefix = function (name, logger) {
  var logger = (logger) ? logger : log('utils.showEvent');

  logger.warn(
    '=========: showEvent data: Event.itemName: ' + name.itemName
    + ', LABEL: ' + items.getItem(event.itemName).label +
    ', STATE: ' + items.getItem(event.itemName).state +
    ', PREV STATExx: ' + items.getItem(event.itemName).history.previousState()
  );
  console.log(name);
}