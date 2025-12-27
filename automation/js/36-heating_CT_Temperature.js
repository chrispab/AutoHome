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
  }
};

// get transfer alpha value based on difference in degrees (upto), e.g absDiff <= tp.degreesDiff;
let transferCurve = cache.private.get('transferCurve', () => ({
  diffAlpha_0: { degreesDiff: 0.05, alpha: 1.0 },
  diffAlpha_1: { degreesDiff: 0.1, alpha: 0.7 },
  diffAlpha_2: { degreesDiff: 0.2, alpha: 0.6 },
  diffAlpha_3: { degreesDiff: 0.3, alpha: 0.5 },
  diffAlpha_4: { degreesDiff: 0.4, alpha: 0.4 },
  diffAlpha_5: { degreesDiff: 0.5, alpha: 0.3 },
  diffAlpha_6: { degreesDiff: 0.6, alpha: 0.1 },
  diffAlpha_7: { degreesDiff: 0.7, alpha: 0.1 },
  diffAlpha_8: { degreesDiff: 0.8, alpha: 0.1 },
  diffAlpha_9: { degreesDiff: 0.9, alpha: 0.1 },
  diffAlpha_10: { degreesDiff: 1.0, alpha: 0.1 },
  diffAlpha_11: { degreesDiff: 5.0, alpha: 0.01 },
  diffAlpha_12: { degreesDiff: 10.0, alpha: 0.001 },
  diffAlpha_13: { degreesDiff: 99.0, alpha: 0.0001 },
}));

function transferValue(absDiff) {
  const found = Object.entries(transferCurve).find(([transferPoint, tp]) => {
    logger.debug('?? transferPoint: {}->{}', transferPoint, JSON.stringify(tp));
    return absDiff <= tp.degreesDiff;
  });
  return found ? found[1].alpha : 0.001;
}

/**
 * Alternative: Standard Exponential Moving Average (EMA)
 * Good for reducing constant small jitter/noise.
 * @param {number} prev - Previous smoothed value
 * @param {number} curr - Current raw reading
 * @param {number} alpha - Smoothing factor (0.0 - 1.0). Lower = more smoothing.
 * @param {string} debugTag - Tag for logging
 */
function calcStandardEMA(prev, curr, alpha = 0.1, debugTag = 'EMA') {
  curr = parseFloat(curr);
  prev = parseFloat(prev);
  if (Number.isNaN(prev)) return curr;
  const ema = (alpha * curr) + ((1 - alpha) * prev);
  logger.debug('..{} calc: ({} * {}) + ((1 - {}) * {}) = {}', debugTag, alpha, curr, alpha, prev, ema);
  return ema;
}

function calcWeightedEMA(prev, curr, debugTag = 'WeightedEMA') {
  curr = parseFloat(curr);
  prev = parseFloat(prev);
  if (Number.isNaN(prev)) return curr;
  logger.debug('calcWeightedEMA..{} curr: {}, prev: {}', debugTag, curr, prev);
  // calculate alpha weighted EMA based on change between curr and prev
  let delta = curr - prev;
  // limit to 1 dp
  delta = delta.toFixed(1);
  const dynamicAlpha = transferValue(Math.abs(delta));
  logger.debug('..{} delta: {}, dynamicAlpha: {}', debugTag, delta, dynamicAlpha);
  const weightedEma = (dynamicAlpha * curr) + ((1 - dynamicAlpha) * prev);
  logger.debug('..{} calc: ({} * {}) + ((1 - {}) * {}) = {}', debugTag, dynamicAlpha, curr, dynamicAlpha, prev, weightedEma);
  return weightedEma;
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

// function to smooth out CT temperature readings
// take previous temperature and new raw temperature
// calculate new temperature from 25% of new and 75% of previous temperature
function smoothCTTemperature(previousTemperature, newTemperature, debugTag = 'temp') {
  const prev = parseFloat(previousTemperature);
  const curr = parseFloat(newTemperature);

  if (Number.isNaN(prev)) return curr;
  if (Number.isNaN(curr)) return prev;

  const splitFactor = 0.25;
  const newTemp = (prev * (1 - splitFactor)) + (curr * splitFactor);
  logger.debug('..{} smoothCTTemperature: ({} * {}) + ({} * {}) = {}', debugTag, prev, splitFactor, curr, (1 - splitFactor), newTemp);
  return newTemp;
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
    logger.debug(`temp1..calculated median temp1: ${temp1}`);
    items.getItem('temp1').sendCommand(temp1);

    let temp2 = calcAverage(rawTemp, 2, 'Average2Buffer', 'temp2');
    temp2 = Number(temp2).toFixed(decimalPlaces);
    logger.debug(`temp2..calculated average temp2: ${temp2}`);
    items.getItem('temp2').sendCommand(temp2);

    let temp3 = calcAverage(rawTemp, 3, 'Average3Buffer', 'temp3');
    temp3 = Number(temp3).toFixed(decimalPlaces);
    logger.debug(`temp3..calculated average temp3: ${temp3}`);
    items.getItem('temp3').sendCommand(temp3);

    let temp4 = calcAverage(rawTemp, 4, 'Average4Buffer', 'temp4');
    temp4 = Number(temp4).toFixed(decimalPlaces);
    logger.debug(`temp4..calculated average temp4: ${temp4}`);
    items.getItem('temp4').sendCommand(temp4);

    let temp5 = calcAverage(rawTemp, 5, 'Average5Buffer', 'temp5');
    temp5 = Number(temp5).toFixed(decimalPlaces);
    logger.debug(`temp5..calculated average temp5: ${temp5}`);
    items.getItem('temp5').sendCommand(temp5);

    let temp6 = calcAverage(rawTemp, 6, 'Average6Buffer', 'temp6');
    temp6 = Number(temp6).toFixed(decimalPlaces);
    logger.debug(`temp6..calculated average temp6: ${temp6}`);
    items.getItem('temp6').sendCommand(temp6);

    let temp7 = smoothCTTemperature(prevTemp, rawTemp, 'temp7');
    temp7 = Number(temp7).toFixed(decimalPlaces);
    logger.debug(`temp7..smoothCTTemperature temp7: ${temp7}`);
    items.getItem('temp7').sendCommand(temp7);

    let temp8 = calcAverage(rawTemp, 8, 'Average8Buffer', 'temp8');
    temp8 = Number(temp8).toFixed(decimalPlaces);
    logger.debug(`temp8..calculated average temp8: ${temp8}`);
    items.getItem('temp8').sendCommand(temp8);

    let temp9 = calcWeightedEMA(prevTemp, rawTemp, 'temp9');
    temp9 = Number(temp9).toFixed(decimalPlaces);
    logger.debug(`temp9..calculated average temp9: ${temp9}`);
    items.getItem('temp9').sendCommand(temp9);

    let temp10 = calcStandardEMA(prevTemp, rawTemp, 0.4, 'temp10');
    temp10 = Number(temp10).toFixed(decimalPlaces);
    logger.debug(`temp10..calculated standard EMA temp10: ${temp10}`);
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
