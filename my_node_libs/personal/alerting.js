exports.sendAlert = function (message, logger) {
  var logger = (logger) ? logger : log('sendAlert');
  logger.warn('ALERT: ' + message);
  actions.NotificationAction.sendBroadcastNotification(message, 'alarm', 'alert');
  //  if(!actions.Things.getActions("mail", "mail:smtp:gmail").sendMail("email@server.com", "openHAB Alert", message)) {
  //    logger.error("Failed to send email alert alert");
  //  }
}

exports.sendInfo = function (message, logger) {
  var logger = (logger) ? logger : log('sendInfo');
  logger.error('INFO: ' + message);


  if (!actions.Things.getActions("mail", "mail:smtp:gmail").sendMail("cbattisson@gmail.com", "openHAB Info", message)) {
    logger.error("Failed to send email info alert");
  }
  // var mailActions = actions.Things.getActions("mail", "mail:smtp:gmail");
  // success = mailActions.sendMail("cbattisson@gmail.com", "openHAB Info", message);
  // if(!success){
  // logger.error("Failed to send email info alert");
  else {
    logger.error("SUCCESS -- EMAIL SENT");
  }

}
exports.sendEmail = function (message, logger) {
  var logger = (logger) ? logger : log('sendInfo');
  logger.error('Email message to send: ' + message);


  if (!actions.Things.getActions("mail", "mail:smtp:gmail").sendMail("cbattisson@gmail.com", "openHAB Info", message)) {
    logger.error("Failed to send email");
  }
  // var mailActions = actions.Things.getActions("mail", "mail:smtp:gmail");
  // success = mailActions.sendMail("cbattisson@gmail.com", "openHAB Info", message);
  // if(!success){
  // logger.error("Failed to send email info alert");
  else {
    logger.error("SUCCESS -- EMAIL SENT");
  }

}
exports.isNight = function () {
  const currToD = items.getItem('TimeOfDay').state;
  return currToD == 'NIGHT' || currToD == 'BED';
}

exports.isAway = function () {
  return exports.isNight() || items.getItem('Presence').state != 'ON';
}

exports.getNames = function (group, filterFunc) {
  return items.getItem(group.name || group).members
    .filter(filterFunc)
    .map(s => s.getMetadataValue('name') || s.label)
    .join(', ');
}
