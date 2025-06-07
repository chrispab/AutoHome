const {
  log, items, rules, actions, triggers,
} = require('openhab');

const ruleUID = 'heating-ct-smooth-temperature';
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.heating-ct-smooth-temperature
// log:set INFO org.openhab.automation.openhab-js.heating-ct-smooth-temperature

scriptLoaded = function () {
  logger.debug('scriptLoaded - {}', ruleUID);

  for (const transferPoint in transferCurve) {
    // logger.debug('==transferPoint: {}, transferCurve[transferPoint]: {}', transferPoint, JSON.stringify(transferCurve[transferPoint])) // '0.05' in the first iteration
    logger.debug('== transferPoint: {}->{}', transferPoint, JSON.stringify(transferCurve[transferPoint])); // '0.05' in the first iteration

    for (const property in transferCurve[transferPoint]) {
      // logger.debug('=== property: {}, value: {}', property, transferCurve[transferPoint][property]) // '0.05' in the first iteration

      // if (absDiff <= transferCurve[transferPoint]['input']) {
      //   logger.debug('====input is <=: {}, return factor: {}', transferCurve[transferPoint]['input'], transferCurve[transferPoint]['factor']) // '0.05' in the first iteration
      //   return transferCurve[transferPoint]['factor']
      // }
    }
  }
};

let transferCurve = cache.private.get('transferCurve', () => ({
  p_0: { input: 0.05, factor: 1.0 },
  p_1: { input: 0.1, factor: 0.9 },
  p_2: { input: 0.2, factor: 0.8 },
  p_3: { input: 0.3, factor: 0.5 },
  p_4: { input: 0.4, factor: 0.5 },
  p_5: { input: 0.5, factor: 0.5 },
  p_6: { input: 0.6, factor: 0.4 },
  p_7: { input: 0.7, factor: 0.3 },
  p_8: { input: 0.8, factor: 0.3 },
  p_9: { input: 0.9, factor: 0.3 },
  p_10: { input: 1.0, factor: 0.2 },
  p_11: { input: 5.0, factor: 0.2 },
  p_12: { input: 10.0, factor: 0.2 },
  p_13: { input: 99.0, factor: 0.1 },
}));

// val DateTime datetime = new DateTime(1514484000)
// val String time = datetime.toLocalTime().toString("HH:mm")

rules.JSRule({
  name: 'smooth out CT temperature readings',
  description: 'smooth out CT temperature readings',
  triggers: [triggers.ItemStateUpdateTrigger('CT_ThermostatTemperatureAmbient_raw')],
  execute: () => {
    logger.debug('...............................');

    const rawTemp = items.getItem('CT_ThermostatTemperatureAmbient_raw').rawState;
    // logger.debug(`..new reading,raw temp is: ${rawTemp}`);

    let preciseTemp = items.getItem('CT_ThermostatTemperatureAmbient_precision').rawState;
    // logger.debug(`..previous _precision temp is: ${preciseTemp}`);

    if (preciseTemp === 'NULL' || preciseTemp < 5) {
      preciseTemp = rawTemp;
      logger.debug(`..setup initial value of preciseTemp from rawtemp: ${preciseTemp}`);
    }

    const newPreciseTemp = calcNewTemp(preciseTemp, rawTemp);
    // save now 'previous' temp
    const prevTemp = items.getItem('CT_ThermostatTemperatureAmbient').state;

    // to 1 dp for dispaly and rules etc
    const workingTemp = Number(newPreciseTemp).toFixed(1);
    items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(workingTemp);
    // logger.debug(`..writing new working 1dp temp : ${workingTemp}`);

    // store as precise 3dp value
    items.getItem('CT_ThermostatTemperatureAmbient_precision').sendCommand(newPreciseTemp);
    // logger.debug(`..writing new precision 3dp temp too CT_ThermostatTemperatureAmbient_precision: ${newPreciseTemp}`);

    items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(workingTemp);

    // get temp in working item value
    const ctTemp = items.getItem('CT_ThermostatTemperatureAmbient').state;
    logger.debug(`..newTemp CT_ThermostatTemperatureAmbient: ${ctTemp}`);

    logger.debug(`..prev temp: ${prevTemp}, raw temp: ${rawTemp},new precision temp: ${newPreciseTemp},  new Temp: ${workingTemp}`);
  },
});

/**
 *
 * @param {string} roomPrefix
 */
function calcNewTemp(previousTemperature, newTemperature) {
  transferCurve = cache.private.get('transferCurve');

  const prec = 3;

  // logger.debug('...calcNewTemp');
  // logger.debug('...precision: {}', prec);

  logger.debug('...previousTemperature precise: {}', previousTemperature);
  logger.debug('...newTemperature raw: {}', newTemperature);
  // calc
  let tempDiff = previousTemperature - newTemperature;
  // tempDiff = tempDiff.toFixed(2);
  tempDiff = tempDiff.toFixed(prec);
  absDiff = Math.abs(tempDiff);

  logger.debug('...temp diff: {}', tempDiff);

  factor = transferValue(absDiff);
  const tempAdd = tempDiff * factor;
  // logger.debug('...factor: {}', factor);

  logger.debug('...temp to Add (temp diff: {} * factor: {}): {}', tempDiff, factor, tempAdd);

  const newTemp = previousTemperature - tempAdd;
  // logger.debug('...newTemp before toFixed: {}', newTemp);

  newTempFixed = newTemp.toFixed(prec);
  // logger.debug(`...returnin newTemp.toFixed(prec) ${newTempFixed}`);
  logger.debug('...newTemp toFixed {}dp: {}', prec, newTempFixed);

  cache.private.put('transferCurve', transferCurve);

  // logger.debug(`...returning to ${prec}dp : ${newTempFixed}`);
  return newTempFixed;
}

function transferValue(absDiff) {
  for (const transferPoint in transferCurve) {
    logger.debug('~~ transferPoint: {}->{}', transferPoint, JSON.stringify(transferCurve[transferPoint])); // '0.05' in the first iteration
    for (const property in transferCurve[transferPoint]) {
      // logger.debug('~~~ property: {}, value: {}', property, transferCurve[transferPoint][property]) // '0.05' in the first iteration

      if (absDiff <= transferCurve[transferPoint].input) {
        // logger.debug('~~~~ input is <=: {}, return factor: {}', transferCurve[transferPoint]['input'], transferCurve[transferPoint]['factor']) // '0.05' in the first iteration
        return transferCurve[transferPoint].factor;
      }
    }
  }
  return 0.001;
}
