const {
  log, items, rules, actions, triggers,
} = require('openhab');

var ruleUID = "ct-smooth-temperature";
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.ct-smooth-temperature
// log:set INFO org.openhab.automation.openhab-js.ct-smooth-temperature

scriptLoaded = function () {
  logger.debug('scriptLoaded - init CT temp filter');
};

const divisor = 4;
const scaleThreshold = 0.2
rules.JSRule({
  name: 'smooth out CT temperature readings',
  description: 'smooth out CT temperature readings',
  triggers: [triggers.ItemStateUpdateTrigger('CT_ThermostatTemperatureAmbient_raw')],
  execute: () => {
    logger.debug(`...............................`);

    var rawTemp = items.getItem('CT_ThermostatTemperatureAmbient_raw').rawState;
    logger.debug(`..new raw temp is: ${rawTemp}`);

    let prevTemp = items.getItem('CT_ThermostatTemperatureAmbient_precision').rawState;
    logger.debug(`..previous _precision temp is: ${prevTemp}`);

    if (prevTemp === 'NULL' || prevTemp < 5) {
      prevTemp = rawTemp;
      logger.debug(`..setup initial value of prevTemp from rawtemp: ${prevTemp}`);
    }

    newTemp = calcNewTemp(prevTemp, rawTemp);

    items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(newTemp);
    items.getItem('CT_ThermostatTemperatureAmbient_precision').sendCommand(newTemp);
    logger.debug(`..writing new temp too CT_ThermostatTemperatureAmbient_precision: ${newTemp}`);

    items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(newTemp);

    let ctTemp = items.getItem('CT_ThermostatTemperatureAmbient').state;
    logger.debug(`..CT_ThermostatTemperatureAmbient(newTemp): ${ctTemp}`);

    logger.debug(`..CT_TEMP_CaLC, previous temp is: ${prevTemp}, new raw temp is: ${rawTemp}, CT_ThermostatTemperatureAmbient(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);
  },
});

/**
 * 
 * @param {string} roomPrefix 
 */
function calcNewTemp(previousTemperature, newTemperature) {
  var prec = 3;

  logger.debug('...calcNewTemp');
  logger.debug('...precision :{}', prec);

  logger.debug('...previousTemperature :{}', previousTemperature);
  logger.debug('...newTemperature :{}', newTemperature);
  // calc 
  var tempDiff = previousTemperature - newTemperature;
  // tempDiff = tempDiff.toFixed(2);
  tempDiff = tempDiff.toFixed(prec);
  absDiff = Math.abs(tempDiff);

  logger.debug(`...temp diff : ${absDiff}`);

  if (absDiff <= 0.1) {
    scaleFactor = 1.5
  } else if (absDiff <= 0.2) {
    scaleFactor = 3
  } else if (absDiff <= 0.3) {
    scaleFactor = 4
  } else if (absDiff <= 0.4) {
    scaleFactor = 5
  } else if (absDiff <= 1.0) {
    scaleFactor = 5
  } else if (absDiff <= 1.2) {
    scaleFactor = 6.5
  } else if (absDiff <= 1.4) {
    scaleFactor = 7.0
  } else if (absDiff <= 1.6) {
    scaleFactor = 8.0
  } else if (absDiff <= 2.5) {
    scaleFactor = 9.0
  } else if (absDiff <= 3.0) {
    scaleFactor = 10.0
  } else if (absDiff <= 5.0) {
    scaleFactor = 11.0
  } else {
    scaleFactor = 15.0
  }

  logger.debug(`...scaleFactor : ${scaleFactor}`);

  let tempAdd = tempDiff / scaleFactor;
  logger.debug(`...tempAdd (tempDiff/scaleFactor) : ${tempAdd}`);

  let newTemp = previousTemperature - tempAdd;
  logger.debug(`...newTemp before toFixed: ${newTemp}`);

  //1 dp
  // newTemp = (Math.round((newTemp.toFixed(2)) * 10) / 10);
  //2 dp
  logger.debug(`...newTemp.toFixed(prec) ${(newTemp.toFixed(prec))}`);
  // newTemp = (newTemp.toFixed(prec));
  logger.debug(`...newTemp toFixed ${prec}dp : ${newTemp.toFixed(prec)}`);

  logger.debug(`...returning to 2dp : ${newTemp.toFixed(2)}`);
  return newTemp.toFixed(2);
}
