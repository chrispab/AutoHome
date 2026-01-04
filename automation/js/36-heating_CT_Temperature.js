/**
 * @file 36-heating_CT_Temperature.js
 * @description Smooths raw temperature readings for the Conservatory (CT) thermostat using various algorithms
 * (EMA, Median, Average, Slope detection) to prevent jitter and spikes in heating control.
 */
const {
  log, items, rules, actions, triggers, cache,
} = require('openhab');

const ruleUID = 'heating-ct-smooth-temperature';
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.heating-ct-smooth-temperature
// log:set INFO org.openhab.automation.openhab-js.heating-ct-smooth-temperature

scriptLoaded = function () {
  logger.debug('scriptLoaded - {}', ruleUID);
  for (const transferPoint in transferCurve) {
    // logger.debug('==transferPoint: {}, transferCurve[transferPoint]: {}', transferPoint, JSON.stringify(transferCurve[transferPoint])) // '0.05' in the first iteration
    // logger.debug('== transferPoint: {}->{}', transferPoint, JSON.stringify(transferCurve[transferPoint])); // '0.05' in the first iteration
  }
  // logger.debug('.....................................');
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

/**
 * Retrieves the smoothing factor (alpha) based on the absolute difference between readings.
 *
 * @param {number} absDiff - The absolute difference between current and previous reading.
 * @returns {number} The alpha value for smoothing.
 */
function transferValue(absDiff) {
  const found = Object.entries(transferCurve).find(([transferPoint, tp]) =>
    // logger.debug('?? transferPoint: {}->{}', transferPoint, JSON.stringify(tp));
    absDiff <= tp.degreesDiff);
  return found ? found[1].alpha : 0.001;
}

/**
 * Alternative: Standard Exponential Moving Average (EMA)
 * Good for reducing constant small jitter/noise.
 * @param {number} previousValue - Previous smoothed value
 * @param {number} currentReading - Current raw reading
 * @param {number} smoothingFactor - Smoothing factor (0.0 - 1.0). Lower = more smoothing.
 * @param {string} debugTag - Tag for logging
 */
function calcStandardEMA(previousValue, currentReading, smoothingFactor = 0.1, debugTag = 'EMA') {
  const currentNumeric = parseFloat(currentReading);
  const previousNumeric = parseFloat(previousValue);
  if (Number.isNaN(previousNumeric)) return currentNumeric;
  const exponentialMovingAverage = (smoothingFactor * currentNumeric) + ((1 - smoothingFactor) * previousNumeric);
  // logger.debug('..{} calc: ({} * {}) + ((1 - {}) * {}) = {}', debugTag, smoothingFactor, currentNumeric, smoothingFactor, previousNumeric, exponentialMovingAverage);
  return exponentialMovingAverage;
}

/**
 * Calculates a weighted Exponential Moving Average (EMA) where the smoothing factor (alpha)
 * is dynamic based on the magnitude of change.
 *
 * @param {number|string} previousValue - The previous smoothed value.
 * @param {number|string} currentReading - The current raw reading.
 * @param {string} [debugTag='WeightedEMA'] - Tag for debug logging.
 * @returns {number} The calculated weighted EMA.
 */
function calcWeightedEMA(previousValue, currentReading, debugTag = 'WeightedEMA') {
  const currentNumeric = parseFloat(currentReading);
  const previousNumeric = parseFloat(previousValue);

  if (Number.isNaN(previousNumeric)) return currentNumeric;

  // logger.debug('calcWeightedEMA..{} current: {}, previous: {}', debugTag, currentNumeric, previousNumeric);

  // calculate alpha weighted EMA based on change between current and previous
  let difference = currentNumeric - previousNumeric;
  // limit to 1 decimal place for lookup/stability
  difference = parseFloat(difference.toFixed(1));

  const smoothingFactor = transferValue(Math.abs(difference));
  // logger.debug('..{} difference: {}, smoothingFactor: {}', debugTag, difference, smoothingFactor);

  const weightedAverage = (smoothingFactor * currentNumeric) + ((1 - smoothingFactor) * previousNumeric);
  // logger.debug('..{} calc: ({} * {}) + ((1 - {}) * {}) = {}', debugTag, smoothingFactor, currentNumeric, smoothingFactor, previousNumeric, weightedAverage);

  return weightedAverage;
}

/**
 * Calculates the median of a value over a specified window size.
 * Good for rejecting random spikes.
 *
 * @param {number|string} currentReading - The current raw reading.
 * @param {number} [windowSize=3] - The size of the median filter buffer.
 * @returns {number} The calculated median value.
 */
function calcMedian(currentReading, windowSize = 3) {
  const buffer = cache.private.get('medianBuffer', () => []);
  const numericValue = parseFloat(currentReading);
  buffer.push(numericValue);
  // logger.debug('..median buffer size: {}, values: {}', buffer.length, JSON.stringify(buffer));
  if (buffer.length > windowSize) buffer.shift();
  cache.private.put('medianBuffer', buffer);

  const sortedBuffer = [...buffer].sort((a, b) => a - b);
  const midIndex = Math.floor(sortedBuffer.length / 2);
  return sortedBuffer.length % 2 !== 0 ? sortedBuffer[midIndex] : (sortedBuffer[midIndex - 1] + sortedBuffer[midIndex]) / 2;
}

/**
 * Calculates the moving average of a value over a specified window size.
 *
 * @param {number|string} currentReading - The current value to add to the buffer.
 * @param {number} [windowSize=3] - The size of the moving average buffer.
 * @param {string} [debugTag='temp'] - A tag used for debug logging.
 * @returns {number} The calculated average.
 */
function calcAverage(currentReading, windowSize = 3, debugTag = 'temp') {
  const bufferName = `averageBuffer${windowSize}`;
  const buffer = cache.private.get(bufferName, () => []);

  const numericValue = parseFloat(currentReading);
  buffer.push(numericValue);
  if (buffer.length > windowSize) buffer.shift();
  // logger.debug('..{}:{} buffer size: {}, values: {}', debugTag, bufferName, buffer.length, JSON.stringify(buffer));

  cache.private.put(bufferName, buffer);

  const sum = buffer.reduce((accumulator, value) => accumulator + value, 0);
  const average = sum / buffer.length;
  // logger.debug('..{} average value: {}', debugTag, average);
  return average;
}

/**
 * Smooths out temperature readings using a fixed weighted average (EMA).
 * Calculates new temperature from 40% of new and 60% of previous temperature.
 *
 * @param {number|string} previousSmoothedTemp - The previous smoothed temperature value.
 * @param {number|string} currentRawTemp - The new raw temperature reading.
 * @param {string} [debugTag='temp'] - Tag for debug logging.
 * @returns {number} The calculated smoothed temperature.
 */
function smoothCTTemperature(previousSmoothedTemp, currentRawTemp, debugTag = 'temp') {
  const previousNumeric = parseFloat(previousSmoothedTemp);
  const currentNumeric = parseFloat(currentRawTemp);

  if (Number.isNaN(previousNumeric)) return currentNumeric;
  if (Number.isNaN(currentNumeric)) return previousNumeric;

  const smoothingFactor = 0.6;
  const smoothedTemp = (previousNumeric * smoothingFactor) + (currentNumeric * (1 - smoothingFactor));
  // logger.debug('..{} smoothCTTemperature: ({} * {}) + ({} * {}) = {}', debugTag, previousNumeric, (1 - smoothingFactor), currentNumeric, smoothingFactor, smoothedTemp);
  return smoothedTemp;
}

/**
 * Calculates the currentReadingGradient between two temperature points and filters out spikes
 * if the rate of change exceeds a threshold.
 *
 * @param {number|string} prevTemp - The previous temperature value.
 * @param {number} prevTime - The epoch timestamp of the previous reading.
 * @param {number|string} currTemp - The current temperature value.
 * @param {number} currTime - The epoch timestamp of the current reading.
 * @returns {number} The filtered temperature (either current or previous).
 */
function calculateLimitRateOfChange(prevTemp, prevTime, currTemp, currTime) {
  // convert to floats into local variables (do not reassign parameters)
  let previousTemp = parseFloat(prevTemp);
  let previousTime = prevTime;
  let numberReadingsTooSteep = 0;
  const currentTemp = parseFloat(currTemp);
  const currentTime = currTime;

  if (Number.isNaN(previousTemp) || Number.isNaN(currentTemp)) {
    logger.warn('calculateLimitRateOfChange: Invalid inputs. prev: {}, curr: {}', prevTemp, currTemp);
    return !Number.isNaN(currentTemp) ? currentTemp : previousTemp;
  }

  // check cache for last accepted previousTemp to avoid using a spike as previous
  const cachedPreviousTemp = cache.private.get('slopePreviousTemp');
  const cachedPreviousTime = cache.private.get('slopePreviousTime');
  const cachedNumberReadingsTooSteep = cache.private.get('slopeNumberReadingsTooSteep');

  if (cachedPreviousTemp !== null && cachedPreviousTemp !== undefined) {
    logger.debug('..calculateSlope using CACHED previousTemp: {} instead of spike previousTemp: {}', cachedPreviousTemp, previousTemp);
    logger.debug('..calculateSlope using CACHED previousTime: {} instead of spike previousTime: {}', cachedPreviousTime, previousTime);
    logger.debug('..calculateSlope had {} consecutive TOO STEEP readings cached', cachedNumberReadingsTooSteep);

    previousTemp = cachedPreviousTemp;
    previousTime = cachedPreviousTime;
    numberReadingsTooSteep = cachedNumberReadingsTooSteep || 0;
    // clear cache now used
    cache.private.remove('slopePreviousTemp');
    cache.private.remove('slopePreviousTime');
    cache.private.remove('slopeNumberReadingsTooSteep');
    logger.debug('..calculateSlope cleared CACHED previousTemp and previousTime after use');
  }
  const deltaTemp = currentTemp - previousTemp;
  const deltaTime = currentTime - previousTime;
  logger.debug('..deltaTemp: {} - {} = {}', currentTemp, previousTemp, deltaTemp);
  logger.debug('..deltaTime: {} - {} = {}', currentTime, previousTime, deltaTime);
  if (deltaTime === 0) {
    logger.debug('..calculateSlope deltaTime is 0, returning previousTemp: {}', previousTemp);
    return previousTemp;
  }
  const currentReadingGradient = Math.abs(deltaTemp / deltaTime);
  logger.debug('..currentReadingGradient deltaTemp: {} / deltaTime: {} = currentReadingGradient: {}', deltaTemp, deltaTime, currentReadingGradient);

  // const maxAllowedGradient = 1 / 900; // 1 degree per 900 seconds
  const maxAllowedGradient = 0.1 / 90; // 0.1 degree per 90 seconds

  // express currentReadingGradient as degrees per hour
  const currentReadingGradientPerHour = currentReadingGradient * 3600;
  logger.debug('..currentReadingGradient (degrees/hr): {}', currentReadingGradientPerHour);
  // express maxAllowedGradient as degrees per hour for logging
  const maxAllowedGradientPerHour = maxAllowedGradient * 3600;
  logger.debug('..maxAllowedGradient (degrees/hr): {}', maxAllowedGradientPerHour);

  if (currentReadingGradient >= maxAllowedGradient) { // greater than threshold
    logger.debug('..SLOPE TOO STEEP {} >= maxAllowedGradient {}, returning previousTemp: {} (spike rejected)', currentReadingGradient, maxAllowedGradient, previousTemp);
    // an ignored spike must also be not used as previous for next calc
    // set and store previousTemp as currentTemp for next calc
    // also store timestamp of previousTemp
    numberReadingsTooSteep += 1;
    // if there have been 3 consecutive too steep readings, accept the currentTemp anyway
    // implies genuine rapid temp change, e.g window opened etc, not a sensor spike
    if (numberReadingsTooSteep >= 3) {
      logger.debug('..SLOPE TOO STEEP BUT {} consecutive readings, ACCEPTING currentTemp: {} anyway', numberReadingsTooSteep, currentTemp);
      // reset counter
      numberReadingsTooSteep = 0;
      // store reset counter
      cache.private.put('slopeNumberReadingsTooSteep', numberReadingsTooSteep);
      return currentTemp;
    }
    cache.private.put('slopeNumberReadingsTooSteep', numberReadingsTooSteep);
    logger.debug('..storing numberReadingsTooSteep in CACHE incremented to: {} ', numberReadingsTooSteep);
    cache.private.put('slopePreviousTime', previousTime);
    cache.private.put('slopePreviousTemp', previousTemp);
    logger.debug('..storing slopePreviousTemp in CACHE as: {} to avoid using spike as previous next time', previousTemp);
    logger.debug('..storing slopePreviousTime in CACHE as: {} to avoid using spike time as previous next time', previousTime);
    return previousTemp;
  }

  logger.debug('..SLOPE ACCEPTABLE {} < maxAllowedGradient {}, returning currentTemp: {}', currentReadingGradient, maxAllowedGradient, currentTemp);
  return currentTemp;
}

rules.JSRule({
  name: 'smooth out CT temperature readings',
  description: 'smooth out CT temperature readings',
  triggers: [triggers.ItemStateUpdateTrigger('CT_ThermostatTemperatureAmbient_raw')],
  execute: (event) => {
    logger.warn('smoothing ct raw temp.........');

    const rawTempItem = items.getItem('CT_ThermostatTemperatureAmbient_raw');

    const historicItem = rawTempItem.persistence.previousState();
    let previousRawTemp = historicItem ? historicItem.state : rawTempItem.state;
    const previousRawTempTimestamp = historicItem ? historicItem.timestamp : null;
    logger.debug(`previous raw CT temp is: ${previousRawTemp}`);
    logger.debug(`previous raw CT temp timestamp is: ${previousRawTempTimestamp}`);

    const newRawTemp = rawTempItem.state;
    const newRawTempTimestamp = rawTempItem.lastStateUpdateTimestamp;
    logger.debug(`new raw CT temp is: ${newRawTemp}`);
    logger.debug(`new raw CT temp timestamp is: ${newRawTempTimestamp}`);

    if (newRawTemp === 'NULL' || newRawTemp === 'UNDEF') {
      logger.warn('CT_ThermostatTemperatureAmbient_raw state is NULL or UNDEF, skipping smoothing.');
      return;
    }

    if (previousRawTemp === 'NULL' || previousRawTemp === 'UNDEF') {
      logger.debug('Previous raw temp is NULL or UNDEF, using current raw temp.');
      previousRawTemp = newRawTemp;
    }

    // save old 'previous' temp
    const prevTemp = items.getItem('CT_ThermostatTemperatureAmbient').state;
    const prevTempTimestamp = items.getItem('CT_ThermostatTemperatureAmbient').persistence.lastUpdate();
    logger.debug(`previous USED CT temp is: ${prevTemp}`);
    logger.debug(`previous USED CT temp timestamp is: ${prevTempTimestamp}`);

    let preciseTemp = parseFloat(items.getItem('CT_ThermostatTemperatureAmbient_precision').state);

    // if preciseTemp is null set to rawTemp
    if (items.getItem('CT_ThermostatTemperatureAmbient_precision').state === 'NULL') {
      preciseTemp = newRawTemp;
      logger.error(`setup initial value of preciseTemp from rawtemp: ${preciseTemp}`);
    }
    // logger.debug(`..previous precision temp is: ${preciseTemp}`);

    // const newPreciseTemp = calcNewTemp(preciseTemp, newRawTemp);
    const decimalPlaces = 1;

    // Convert timestamps to epoch seconds for calculation
    const prevTime = prevTempTimestamp ? prevTempTimestamp.toEpochSecond() : 0;
    const rawTime = newRawTempTimestamp ? newRawTempTimestamp.toEpochSecond() : 0;
    const previousRawTempTimestampEpoch = previousRawTempTimestamp ? previousRawTempTimestamp.toEpochSecond() : 0;
    logger.debug(`prevTime: ${prevTime}, rawTime: ${rawTime}\n`);

    // calculate various smoothing methods for analysis
    let temp0 = calculateLimitRateOfChange(previousRawTemp, previousRawTempTimestampEpoch, newRawTemp, rawTime);
    temp0 = Number(temp0).toFixed(decimalPlaces);
    logger.debug(`temp0..calculated currentReadingGradient temp0: ${temp0}\n`);
    items.getItem('temp0').postUpdate(temp0);

    let temp1 = calcMedian(newRawTemp);
    temp1 = Number(temp1).toFixed(decimalPlaces);
    // logger.debug(`temp1..calculated median temp1: ${temp1}`);
    items.getItem('temp1').postUpdate(temp1);

    let temp2 = calcAverage(newRawTemp, 2, 'temp2');
    temp2 = Number(temp2).toFixed(decimalPlaces);
    logger.debug(`temp2..calculated average temp2: ${temp2}`);
    items.getItem('temp2').postUpdate(temp2);

    let temp3 = calcAverage(newRawTemp, 3, 'temp3');
    temp3 = Number(temp3).toFixed(decimalPlaces);
    // logger.debug(`temp3..calculated average temp3: ${temp3}`);
    items.getItem('temp3').postUpdate(temp3);

    let temp4 = calcAverage(newRawTemp, 4, 'temp4');
    temp4 = Number(temp4).toFixed(decimalPlaces);
    // logger.debug(`temp4..calculated average temp4: ${temp4}`);
    items.getItem('temp4').postUpdate(temp4);

    let temp5 = calcAverage(newRawTemp, 5, 'temp5');
    temp5 = Number(temp5).toFixed(decimalPlaces);
    // logger.debug(`temp5..calculated average temp5: ${temp5}`);
    items.getItem('temp5').postUpdate(temp5);

    let temp6 = calcAverage(newRawTemp, 6, 'temp6');
    temp6 = Number(temp6).toFixed(decimalPlaces);
    // logger.debug(`temp6..calculated average temp6: ${temp6}`);
    items.getItem('temp6').postUpdate(temp6);

    let temp7 = smoothCTTemperature(prevTemp, newRawTemp, 'temp7');
    temp7 = Number(temp7).toFixed(decimalPlaces);
    // logger.debug(`temp7..smoothCTTemperature temp7: ${temp7}`);
    items.getItem('temp7').postUpdate(temp7);

    let temp8 = calcAverage(newRawTemp, 8, 'temp8');
    temp8 = Number(temp8).toFixed(decimalPlaces);
    // logger.debug(`temp8..calculated average temp8: ${temp8}`);
    items.getItem('temp8').postUpdate(temp8);

    let temp9 = calcWeightedEMA(prevTemp, newRawTemp, 'temp9');
    temp9 = Number(temp9).toFixed(decimalPlaces);
    // logger.debug(`temp9..calculated average temp9: ${temp9}`);
    items.getItem('temp9').postUpdate(temp9);

    let temp10 = calcStandardEMA(prevTemp, newRawTemp, 0.4, 'temp10');
    temp10 = Number(temp10).toFixed(decimalPlaces);
    // logger.debug(`temp10..calculated standard EMA temp10: ${temp10}`);
    items.getItem('temp10').postUpdate(temp10);

    const newPreciseTemp = temp0;

    // const newPreciseTemp = calcStandardEMA(prevTemp, rawTemp, 0.9);

    // to 1 decimalPlaces for display and rules etc
    const workingTemp = Number(newPreciseTemp).toFixed(1);
    // if workingTemp is NaN then log error and return
    if (Number.isNaN(parseFloat(workingTemp))) {
      logger.error(`calculated workingTemp is NaN: ${workingTemp}, rawTemp: ${newRawTemp}, preciseTemp: ${preciseTemp}, newPreciseTemp: ${newPreciseTemp}`);
      return;
    }
    items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(workingTemp);
    items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(workingTemp);
    logger.debug(`writing new ct temp 1decimalPlaces temp CT and FH ambient: ${workingTemp}`);

    // store as precise 3decimalPlaces value
    items.getItem('CT_ThermostatTemperatureAmbient_precision').sendCommand(newPreciseTemp);
    logger.debug(`writing new precision 3decimalPlaces temp too CT_ThermostatTemperatureAmbient_precision: ${newPreciseTemp}`);

    // get temp in working item value
    const ctTemp = items.getItem('CT_ThermostatTemperatureAmbient').state;
    logger.debug(`newTemp CT_ThermostatTemperatureAmbient: ${ctTemp}`);

    logger.debug(`prev temp: ${prevTemp}, raw temp: ${newRawTemp},new precision temp: ${newPreciseTemp},  new Temp: ${workingTemp}`);
  },
});
