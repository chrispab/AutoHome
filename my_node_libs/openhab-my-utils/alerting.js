exports.sendAlert = function (message, logger) {
  var logger = (logger) ? logger : log('sendAlert');
  logger.warn('ALERT: ' + message);
  actions.NotificationAction.sendBroadcastNotification(message, 'alarm', 'alert');
  //  if(!actions.Things.getActions("mail", "mail:smtp:gmail").sendMail("email@server.com", "openHAB Alert", message)) {
  //    logger.warn("Failed to send email alert alert");
  //  }
}

exports.sendInfo = function (message, logger) {
  var logger = (logger) ? logger : log('sendInfo');
  logger.warn('INFO: ' + message);


  if (!actions.Things.getActions("mail", "mail:smtp:gmail").sendMail("cbattisson@gmail.com", "openHAB Info", message)) {
    logger.warn("Failed to send email info alert");
  }
  // var mailActions = actions.Things.getActions("mail", "mail:smtp:gmail");
  // success = mailActions.sendMail("cbattisson@gmail.com", "openHAB Info", message);
  // if(!success){
  // logger.warn("Failed to send email info alert");
  else {
    logger.warn("SUCCESS -- EMAIL SENT");
  }

}


exports.sendEmail = function (subject, message, logger) {
  var logger = (logger) ? logger : log('sendInfo');
  logger.debug('Email message to send: ' + message);

  //prepend the subject with 'Openhab: ' if it doesn't already start with it
  if (!subject.startsWith('Openhab: ')) {
    subject = 'Openhab: ' + subject;
  }
  if (!actions.Things.getActions("mail", "mail:smtp:gmail").sendMail("cbattisson@gmail.com", subject, message)) {
    logger.debug("Failed to send email");
  }
  else {
    logger.debug("SUCCESS -- EMAIL SENT");
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

//
//
// https://github.com/openhab/openhab-distro/releases/tag/4.3.0#breaking-changes-that-require-manual-interaction-after-the-upgrade
exports.flashItemAlert = function (flashItemName = 'CT_FairyLights433Socket', numFlashes = 1, pulseTimeMs = 500) {
  const currentState = items.getItem(flashItemName).state;

  items.getItem(flashItemName).sendCommand('ON');
  logger.info(`${flashItemName} ON`);
  let index = 0
  for (index = 0; index < numFlashes * 2; index++) {
    let state = (index % 2) == 1 ? 'ON' : 'OFF'
    actions.ScriptExecution.createTimer(time.toZDT(((index + 1) * pulseTimeMs)), () => {
      items.getItem(flashItemName).sendCommand(state);
      logger.debug(`${flashItemName}: ${state}`);
    });
  }

  actions.ScriptExecution.createTimer(time.toZDT(((index + 1) * pulseTimeMs)), () => {
    items.getItem(flashItemName).sendCommand(currentState);
    logger.debug(`${flashItemName}: ${currentState}`);
  });

}