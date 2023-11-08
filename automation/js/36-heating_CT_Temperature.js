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
    logger.debug(`..new reading,raw temp is: ${rawTemp}`);

    let preciseTemp = items.getItem('CT_ThermostatTemperatureAmbient_precision').rawState;
    logger.debug(`..previous _precision temp is: ${preciseTemp}`);

    if (preciseTemp === 'NULL' || preciseTemp < 5) {
      preciseTemp = rawTemp;
      logger.debug(`..setup initial value of preciseTemp from rawtemp: ${preciseTemp}`);
    }

    newPreciseTemp = calcNewTemp(preciseTemp, rawTemp);

    //to 1 dp for dispaly and rules etc
    workingTemp = Number(newPreciseTemp).toFixed(1);
    items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(workingTemp);
    logger.debug(`..writing new working 1dp temp too TemperatureAmbient_precision: ${workingTemp}`);

    //store as precise 3dp value
    items.getItem('CT_ThermostatTemperatureAmbient_precision').sendCommand(newPreciseTemp);
    logger.debug(`..writing new precision 3dp temp too CT_ThermostatTemperatureAmbient_precision: ${newPreciseTemp}`);

    items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(workingTemp);

    //get temp in working item value
    let ctTemp = items.getItem('CT_ThermostatTemperatureAmbient').state;
    logger.debug(`..CT_ThermostatTemperatureAmbient(newTemp): ${ctTemp}`);

    logger.debug(`..saved precision temp is: ${newPreciseTemp}, new raw temp is: ${rawTemp}, TemperatureAmbient(newTemp): ${workingTemp}`);
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

  logger.debug(`...temp diff : ${tempDiff}`);

  if (absDiff < 0.05) {
    scaleFactor = 1
  } else if (absDiff <= 0.1) {
    scaleFactor = 2
  } else if (absDiff <= 0.2) {
    scaleFactor = 3
  } else if (absDiff <= 0.3) {
    scaleFactor = 4
  } else if (absDiff <= 0.4) {
    scaleFactor = 5
  } else if (absDiff <= 1.0) {
    scaleFactor = 6
  } else if (absDiff <= 1.2) {
    scaleFactor = 7
  } else if (absDiff <= 1.4) {
    scaleFactor = 8
  } else if (absDiff <= 1.6) {
    scaleFactor = 9
  } else if (absDiff <= 2.5) {
    scaleFactor = 10
  } else if (absDiff <= 3.0) {
    scaleFactor = 11
  } else if (absDiff <= 5.0) {
    scaleFactor = 12
  } else {
    scaleFactor = 13
  }

  logger.debug(`...scaleFactor/divisor : ${scaleFactor}`);

  let tempAdd = tempDiff / scaleFactor;
  logger.debug(`...tempAdd (tempDiff/scaleFactor) : ${tempAdd}`);

  let newTemp = previousTemperature - tempAdd;
  logger.debug(`...newTemp before toFixed: ${newTemp}`);

  //1 dp
  // newTemp = (Math.round((newTemp.toFixed(2)) * 10) / 10);
  //2 dp
  newTempFixed = newTemp.toFixed(prec)
  // logger.debug(`...returnin newTemp.toFixed(prec) ${newTempFixed}`);
  // newTemp = (newTemp.toFixed(prec));
  logger.debug(`...newTemp toFixed ${prec}dp : ${newTempFixed}`);

  // logger.debug(`...returning to ${prec}dp : ${newTempFixed}`);
  return newTempFixed;
}
