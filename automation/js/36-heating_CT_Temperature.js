const {
  log, items, rules, actions, triggers,
} = require('openhab');

var ruleUID = "heating-ct-smooth-temperature";
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.heating-ct-smooth-temperature
// log:set INFO org.openhab.automation.openhab-js.heating-ct-smooth-temperature

scriptLoaded = function () {
  logger.debug('scriptLoaded - init CT temp filter');
};

// const divisor = 4;
// const scaleThreshold = 0.2



var transferCurve = cache.private.get('transferCurve', () => ({
  0.06: 1.0,
  0.1: 0.5,
  0.2: 0.5,
  0.3: 0.4,
  0.4: 0.4,
  0.5: 0.3,
  0.6: 0.2,
  0.7: 0.2,
  0.8: 0.1,
  0.9: 0.1,
  5.0: 0.1,
  99.0: 0.01
}));

var transferCurve2 = cache.private.get('transferCurve2', () => ({
  p_0: {
    input: 0.06,
    factor: 1.0
  },
  p_1: {
    input: 0.1,
    factor: 0.5
  },
  p_2: {
    input: 0.2,
    factor: 0.5
  },
  p_3: {
    input: 0.3,
    factor: 0.4
  },
  p_4: {
    input: 0.4,
    factor: 0.4
  },
  p_5: {
    input: 0.5,
    factor: 0.3
  },

  p_6: {
    input: 0.6,
    factor: 0.3
  },
  p_7: {
    input: 0.7,
    factor: 0.3
  },
  p_9: {
    input: 0.9,
    factor: 0.2
  },
  p_10: {
    input: 1.0,
    factor: 0.1
  },
  p_11: {
    input: 5.0,
    factor: 0.1
  },
  p_12: {
    input: 99.0,
    factor: 0.01
  }
}));




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

    let newPreciseTemp = calcNewTemp(preciseTemp, rawTemp);

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

  transferCurve2 = cache.private.get('transferCurve2');

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
    scaleFactor = 1.2
  } else if (absDiff <= 0.2) {
    scaleFactor = 1.3
  } else if (absDiff <= 0.3) {
    scaleFactor = 1.4
  } else if (absDiff <= 0.4) {
    scaleFactor = 1.5
  } else if (absDiff <= 1.0) {
    scaleFactor = 1.6
  } else if (absDiff <= 1.2) {
    scaleFactor = 1.7
  } else if (absDiff <= 1.4) {
    scaleFactor = 1.8
  } else if (absDiff <= 1.6) {
    scaleFactor = 1.9
  } else if (absDiff <= 2.5) {
    scaleFactor = 2.10
  } else if (absDiff <= 3.0) {
    scaleFactor = 2.11
  } else if (absDiff <= 5.0) {
    scaleFactor = 2.12
  } else {
    scaleFactor = 3
  }

  logger.debug(`...scaleFactor/divisor : ${scaleFactor}`);

  // let tempAdd = tempDiff / scaleFactor;
  // logger.debug(`...tempAdd (tempDiff/scaleFactor) : ${tempAdd}`);

  let tempAdd = tempDiff * transferValue(absDiff);
  logger.debug(`...tempAdd (tempDiff * transferValue(absDiff)) : ${tempAdd}`);


  let newTemp = previousTemperature - tempAdd;
  logger.debug(`...newTemp before toFixed: ${newTemp}`);

  //1 dp
  // newTemp = (Math.round((newTemp.toFixed(2)) * 10) / 10);
  //2 dp
  newTempFixed = newTemp.toFixed(prec)
  // logger.debug(`...returnin newTemp.toFixed(prec) ${newTempFixed}`);
  // newTemp = (newTemp.toFixed(prec));
  logger.debug(`...newTemp toFixed ${prec}dp : ${newTempFixed}`);

  cache.private.put('transferCurve2', transferCurve2);

  // logger.debug(`...returning to ${prec}dp : ${newTempFixed}`);
  return newTempFixed;
}



function transferValue(absDiff) {

  // for (let property in transferCurve) {
  //   logger.debug('property: {}', property) // '0.05' in the first iteration
  //   // '0.1' in the second
  //   logger.debug('transferCurve[property]: {}', transferCurve[property]) // '1.0' in the first iteration
  //   // '0.5' in the second
  // }
  for (let transferPoint in transferCurve2) {
    logger.debug('~~transferPoint: {}, transferCurve2[transferPoint]: {}', transferPoint, JSON.stringify(transferCurve2[transferPoint])) // '0.05' in the first iteration
    // logger.debug('#transferCurve2[transferPoint]: {}', transferCurve2[transferPoint]) // '1.0' in the first iteration
    // '0.5' in the second
    for (let property in transferCurve2[transferPoint]) {
      logger.debug('~~~property in transferCurve2[transferPoint]: {}, ~~~transferCurve2[transferPoint][property]: {}', property, transferCurve2[transferPoint][property]) // '0.05' in the first iteration
      // logger.debug('~~~transferCurve2[transferPoint][property]: {}', transferCurve2[transferPoint][property]) // '1.0' in the first iteration

      if (absDiff <= transferCurve2[transferPoint]['input']) {
        logger.debug('~~~~ return [input]: {}, [factor]: {}', transferCurve2[transferPoint]['input'], transferCurve2[transferPoint]['factor']) // '0.05' in the first iteration
        return transferCurve2[transferPoint]['factor']
      }
    }
  }


  // for (let property in transferCurve) {
  //   logger.debug('-property: {}', property) // '0.05' in the first iteration
  //   // '0.1' in the second

  //   logger.debug('-transferCurve[property]: {}', transferCurve[property]) // '1.0' in the first iteration
  //   // '0.5' in the second

  //   if (absDiff <= property) {
  //     return transferCurve[property]
  //   }
  // }
  return 0.001
}