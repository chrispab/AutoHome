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
  p_3: { input: 0.3, factor: 0.7 },
  p_4: { input: 0.4, factor: 0.6 },
  p_5: { input: 0.5, factor: 0.5 },
  p_6: { input: 0.6, factor: 0.4 },
  p_7: { input: 0.7, factor: 0.3 },
  p_8: { input: 0.8, factor: 0.3 },
  p_9: { input: 0.9, factor: 0.3 },
  p_10: { input: 1.0, factor: 0.3 },
  p_11: { input: 5.0, factor: 0.2 },
  p_12: { input: 10.0, factor: 0.2 },
  p_13: { input: 99.0, factor: 0.1 },
}));

// val DateTime datetime = new DateTime(1514484000)
// val String time = datetime.toLocalTime().toString("HH:mm")
// function transferValue(absDiff) {
//   for (const transferPoint in transferCurve) {
//     logger.debug('~~ transferPoint: {}->{}', transferPoint, JSON.stringify(transferCurve[transferPoint])); // '0.05' in the first iteration
//     for (const property in transferCurve[transferPoint]) {
//       // logger.debug('~~~ property: {}, value: {}', property, transferCurve[transferPoint][property]) // '0.05' in the first iteration

//       if (absDiff <= transferCurve[transferPoint].input) {
//         // logger.debug('~~~~ input is <=: {}, return factor: {}', transferCurve[transferPoint]['input'], transferCurve[transferPoint]['factor']) // '0.05' in the first iteration
//         return transferCurve[transferPoint].factor;
//       }
//     }
//   }
//   return 0.001;
// }
function transferValue(absDiff) {
  const found = Object.entries(transferCurve).find(([transferPoint, tp]) => {
    logger.debug('?? transferPoint: {}->{}', transferPoint, JSON.stringify(tp));
    return absDiff <= tp.input;
  });
  return found ? found[1].factor : 0.001;
}

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
  const absDiff = Math.abs(tempDiff);

  logger.debug('...temp diff: {}', tempDiff);

  const factor = transferValue(absDiff);
  const tempAdd = tempDiff * factor;
  // logger.debug('...factor: {}', factor);

  logger.debug('...temp to Add (temp diff: {} * factor: {}): {}', tempDiff, factor, tempAdd);

  const newTemp = previousTemperature - tempAdd;
  // logger.debug('...newTemp before toFixed: {}', newTemp);

  const newTempFixed = newTemp.toFixed(prec);
  // logger.debug(`...returnin newTemp.toFixed(prec) ${newTempFixed}`);
  logger.debug('...newTemp toFixed {}decimalPlaces: {}', prec, newTempFixed);

  cache.private.put('transferCurve', transferCurve);

  // logger.debug(`...returning to ${prec}decimalPlaces : ${newTempFixed}`);
  return newTempFixed;
}

/**
 * Alternative: Standard Exponential Moving Average (EMA)
 * Good for reducing constant small jitter/noise.
 * @param {number} prev - Previous smoothed value
 * @param {number} curr - Current raw reading
 * @param {number} alpha - Smoothing factor (0.0 - 1.0). Lower = more smoothing.
 */
function calcStandardEMA(prev, curr, alpha = 0.1, debugTag = 'EMA') {
  curr = parseFloat(curr);
  prev = parseFloat(prev);
  const ema = (alpha * curr) + ((1 - alpha) * prev);
  logger.debug('..{} calc: ({} * {}) + ((1 - {}) * {}) = {}', debugTag, alpha, curr, alpha, prev, ema);
  return ema;
}

/**
 * Alternative: Median Filter
 * Good for rejecting random spikes.
 * @param {number} curr - Current raw reading
 */
function calcMedian(curr) {
  const buffer = cache.private.get('medianBuffer', () => []);
  const maxSize = 2; // Size of the median filter buffer
  const val = parseFloat(curr);
  buffer.push(val);
  logger.debug('..median buffer size: {}, values: {}', buffer.length, JSON.stringify(buffer));
  if (buffer.length >= maxSize) buffer.shift();
  cache.private.put('medianBuffer', buffer);

  const sorted = [...buffer].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calcAverage(curr, windowSize = 3, bufferName = 'averageBuffer', debugTag = 'temp') {
  const buffer = cache.private.get(bufferName, () => []);
  const maxSize = windowSize; // Size of the moving average buffer
  const val = parseFloat(curr);
  buffer.push(val);
  if (buffer.length > maxSize) buffer.shift();
  logger.debug('..{}:{} buffer size: {}, values: {}', debugTag, bufferName, buffer.length, JSON.stringify(buffer));

  cache.private.put(bufferName, buffer);

  const sum = buffer.reduce((acc, v) => acc + v, 0);
  const average = sum / buffer.length;
  logger.debug('..{} average value: {}', debugTag, average);
  return average;
}

rules.JSRule({
  name: 'smooth out CT temperature readings',
  description: 'smooth out CT temperature readings',
  triggers: [triggers.ItemStateUpdateTrigger('CT_ThermostatTemperatureAmbient_raw')],
  execute: () => {
    logger.error('smoothing ct raw temp..........');

    // save old 'previous' temp
    const prevTemp = items.getItem('CT_ThermostatTemperatureAmbient').state;
    logger.debug(`..previous CT temp is: ${prevTemp}`);

    const rawTemp = items.getItem('CT_ThermostatTemperatureAmbient_raw').rawState;
    logger.debug(`..new raw CT temp is: ${rawTemp}`);

    let preciseTemp = items.getItem('CT_ThermostatTemperatureAmbient_precision').rawState;
    // logger.debug(`..ct temp_precision').rawState is: ${items.getItem('CT_ThermostatTemperatureAmbient_precision').rawState}`);
    // if preciseTemp is null set to rawTemp
    if (items.getItem('CT_ThermostatTemperatureAmbient_precision').state === 'NULL') {
      preciseTemp = rawTemp;
      logger.error(`..setup initial value of preciseTemp from rawtemp: ${preciseTemp}`);
    }
    logger.debug(`..previous precision temp is: ${preciseTemp}`);

    // const newPreciseTemp = calcNewTemp(preciseTemp, rawTemp);
    const decimalPlaces = 1;
    let temp1 = calcMedian(rawTemp);
    temp1 = Number(temp1).toFixed(decimalPlaces);
    logger.debug(`..calculated median temp1: ${temp1}`);
    items.getItem('temp1').sendCommand(temp1);

    let temp2 = calcAverage(rawTemp, 2, 'Average2Buffer', 'temp2');
    temp2 = Number(temp2).toFixed(decimalPlaces);
    logger.debug(`..calculated average temp2: ${temp2}`);
    items.getItem('temp2').sendCommand(temp2);

    let temp3 = calcAverage(rawTemp, 3, 'Average3Buffer', 'temp3');
    temp3 = Number(temp3).toFixed(decimalPlaces);
    logger.debug(`..calculated average temp3: ${temp3}`);
    items.getItem('temp3').sendCommand(temp3);

    let temp4 = calcAverage(rawTemp, 4, 'Average4Buffer', 'temp4');
    temp4 = Number(temp4).toFixed(decimalPlaces);
    logger.debug(`..calculated average temp4: ${temp4}`);
    items.getItem('temp4').sendCommand(temp4);

    let temp5 = calcAverage(rawTemp, 5, 'Average5Buffer', 'temp5');
    temp5 = Number(temp5).toFixed(decimalPlaces);
    logger.debug(`..calculated average temp5: ${temp5}`);
    items.getItem('temp5').sendCommand(temp5);

    let temp6 = calcAverage(rawTemp, 6, 'Average6Buffer', 'temp6');
    temp6 = Number(temp6).toFixed(decimalPlaces);
    logger.debug(`..calculated average temp6: ${temp6}`);
    items.getItem('temp6').sendCommand(temp6);

    let temp7 = calcAverage(rawTemp, 7, 'Average7Buffer', 'temp7');
    temp7 = Number(temp7).toFixed(decimalPlaces);
    logger.debug(`..calculated average temp7: ${temp7}`);
    items.getItem('temp7').sendCommand(temp7);

    let temp8 = calcAverage(rawTemp, 8, 'Average8Buffer', 'temp8');
    temp8 = Number(temp8).toFixed(decimalPlaces);
    logger.debug(`..calculated average temp8: ${temp8}`);
    items.getItem('temp8').sendCommand(temp8);

    let temp9 = calcAverage(rawTemp, 9, 'Average9Buffer', 'temp9');
    temp9 = Number(temp9).toFixed(decimalPlaces);
    logger.debug(`..calculated average temp9: ${temp9}`);
    items.getItem('temp9').sendCommand(temp9);

    let temp10 = calcStandardEMA(preciseTemp, rawTemp, 0.9, 'temp10');
    temp10 = Number(temp10).toFixed(decimalPlaces);
    logger.debug(`..calculated standard EMA temp10: ${temp10}`);
    items.getItem('temp10').sendCommand(temp10);

    const newPreciseTemp = temp2;

    // const newPreciseTemp = calcStandardEMA(prevTemp, rawTemp, 0.9);

    // to 1 decimalPlaces for display and rules etc
    const workingTemp = Number(newPreciseTemp).toFixed(1);
    // if workingTemp is NaN then log error and return
    if (Number.isNaN(workingTemp)) {
      logger.error(`..calculated workingTemp is NaN: ${workingTemp}, rawTemp: ${rawTemp}, preciseTemp: ${preciseTemp}, newPreciseTemp: ${newPreciseTemp}`);
      return;
    }
    items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(workingTemp);
    items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(workingTemp);
    logger.debug(`..writing new ct temp 1decimalPlaces temp CT and FH ambient: ${workingTemp}`);

    // store as precise 3decimalPlaces value
    items.getItem('CT_ThermostatTemperatureAmbient_precision').sendCommand(newPreciseTemp);
    logger.debug(`..writing new precision 3decimalPlaces temp too CT_ThermostatTemperatureAmbient_precision: ${newPreciseTemp}`);

    // get temp in working item value
    const ctTemp = items.getItem('CT_ThermostatTemperatureAmbient').state;
    logger.debug(`..newTemp CT_ThermostatTemperatureAmbient: ${ctTemp}`);

    logger.debug(`..prev temp: ${prevTemp}, raw temp: ${rawTemp},new precision temp: ${newPreciseTemp},  new Temp: ${workingTemp}`);
  },
});

// rules.JSRule({
//   name: 'Calculate CT Temperature Moving Average',
//   description: 'Calculates the moving average of the last 5 CT temperature readings',
//   triggers: [triggers.ItemStateUpdateTrigger('CT_ThermostatTemperatureAmbient')],
//   execute: () => {
//     const tempReadings = cache.private.get('ctTempReadings', () => []);
//     const MAX_READINGS = 5; // Adjust as needed, e.g., 10 for a 10-point moving average

//     const currentTemp = parseFloat(items.getItem('CT_ThermostatTemperatureAmbient_raw').state);

//     if (Number.isNaN(currentTemp)) {
//       logger.error(`Invalid temperature value for CT_ThermostatTemperatureAmbient: ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);
//       return;
//     }

//     // Add the new reading to the array
//     tempReadings.push(currentTemp);

//     // Keep only the last MAX_READINGS
//     if (tempReadings.length > MAX_READINGS) {
//       tempReadings.shift(); // Remove the oldest reading
//     }

//     // Calculate the sum of the readings
//     const sum = tempReadings.reduce((acc, val) => acc + val, 0);

//     // Calculate the moving average
//     const movingAverage = sum / tempReadings.length;

//     // Post update to a new item (e.g., CT_ThermostatTemperatureAmbient_MovingAverage)
//     items.getItem('CT_ThermostatTemperatureAmbient_MovingAverage').postUpdate(movingAverage.toFixed(1));

//     // Store the updated array in cache
//     cache.private.put('ctTempReadings', tempReadings);

//     logger.debug(`CT Temperature Moving Average (${tempReadings.length} readings): ${movingAverage.toFixed(1)}`);

//     const newPreciseTemp = calcAverage(currentTemp, 5, 'Average5Buffer');
//     logger.debug(`CT Temperature 5-point Average precise: ${newPreciseTemp.toFixed(1)}`);
//   },
// });
