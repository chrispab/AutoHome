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
    let prevTemp = items.getItem('CT_ThermostatTemperatureAmbient').rawState;
    logger.debug(`..previous temp is: ${prevTemp}`);

    const rawTemp = items.getItem('CT_ThermostatTemperatureAmbient_raw').rawState;
    logger.debug(`..new raw temp is: ${rawTemp}`);

    if (prevTemp === 'NULL' || prevTemp < 5) {
      prevTemp = rawTemp;
      logger.debug(`..setup initial value of prevTemp from rawtemp: ${prevTemp}`);
    }
    // logger.debug(`..prev temp : ${prevTemp}`);
    // logger.debug(`..raw temp : ${rawTemp}`);

    // const diff = prevTemp - rawTemp;
    // logger.debug(`..temp diff : ${diff}`);

    newTemp = calcNewTemp(prevTemp,rawTemp);

    items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(newTemp);
    items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(newTemp);

    let ctTemp=items.getItem('CT_ThermostatTemperatureAmbient').state;
    logger.debug(`..CT_Temperature(newTemp): ${ctTemp}`);

    logger.debug(`..CT_TEMP_CaLC, previous temp is: ${prevTemp}, new raw temp is: ${rawTemp}, CT_ThermostatTemperatureAmbient(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);
  },
});

/**
 * 
 * @param {string} roomPrefix 
 */
function calcNewTemp(previousTemperature,newTemperature) {
  logger.debug('...calcNewTemp');
  // calc 
  let tempDiff = previousTemperature - newTemperature;
  tempDiff = tempDiff.toFixed(2);
  absDiff = Math.abs(tempDiff);
    // const diff = prevTemp - rawTemp;
    logger.debug(`...temp diff : ${absDiff}`);

  if(absDiff <= 0.1){
    scaleFactor = 0.9
  }else if (absDiff <= 0.5) {
    scaleFactor = 1.5
  } else if (absDiff <= 0.6){
    scaleFactor = 1.2
  }else if (absDiff <= 0.8) {
    scaleFactor = 2.5
  } else if (absDiff <= 1.0){
    scaleFactor = 3
  }else if (absDiff <= 1.2) {
    scaleFactor = 6.0
  } else if (absDiff <= 1.4){
    scaleFactor = 7.0
  }else if (absDiff <= 1.6) {
    scaleFactor = 8.0
  } else if (absDiff <= 2.5){
    scaleFactor = 9.0
  }else if (absDiff <= 3.0) {
    scaleFactor = 10.0
  } else if (absDiff <= 5.0){
    scaleFactor = 11.0
  }else{
    scaleFactor = 15.0
  }

  logger.debug(`...scaleFactor : ${scaleFactor}`);

  let tempAdd = tempDiff / scaleFactor;
  logger.debug(`...tempAdd (tempDiff/scaleFactor) : ${tempAdd}`);

  let newTemp = previousTemperature - tempAdd;
  logger.debug(`...newTemp: ${newTemp}`);

  newTemp = (Math.round((newTemp.toFixed(2)) * 10) / 10);
  logger.debug(`...newTemp rounded: ${newTemp}`);

  return newTemp;
}

// rules.JSRule({
//   name: 'smooth out CT temperature readings',
//   description: 'smooth out CT temperature readings',
//   triggers: [triggers.ItemStateUpdateTrigger('CT_ThermostatTemperatureAmbient_raw')],
//   execute: () => {
//     let prevTemp = items.getItem('CT_ThermostatTemperatureAmbient').rawState;
//     logger.debug(`1 ==> previous temp is: ${prevTemp}`);

//     const rawTemp = items.getItem('CT_ThermostatTemperatureAmbient_raw').rawState;
//     logger.debug(`2 ==> new raw temp is: ${rawTemp}`);

//     if (prevTemp === 'NULL' || prevTemp < 5) {
//       prevTemp = rawTemp;
//       logger.debug(`3 ==> setup initial value of prevTemp from rawtemp: ${prevTemp}`);
//     }
//     logger.debug(`4 ==> prev temp : ${prevTemp}`);
//     logger.debug(`5 ==> raw temp : ${rawTemp}`);

//     const diff = prevTemp - rawTemp;
//     logger.debug(`6 ==> temp diff : ${diff}`);
//     logger.debug(`6-7 ==> divisor : ${divisor}`);

//     const tempdiff = diff / divisor;
//     logger.debug(`5 ==> temp diff/divisor : ${tempdiff}`);

//     let newTemp = prevTemp - tempdiff;
//     logger.debug(`5 ==> new temp : ${newTemp}`);

//     newTemp = (Math.round((newTemp.toFixed(2)) * 10) / 10);
//     logger.debug(`6 ==> new temp after rounding: ${newTemp}`);

//     items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(newTemp);
//     items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(newTemp);

//     logger.debug(`7 ==> CT_Temperature(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);

//     logger.debug(`CT_TEMP_CaLC, previous temp is: ${prevTemp}, new raw temp is: ${rawTemp}, CT_ThermostatTemperatureAmbient(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);
//   },
// });