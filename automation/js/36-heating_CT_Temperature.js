/**
 * @file 36-heating_CT_Temperature.js
 * @description Smooths raw temperature readings for the Conservatory (CT) thermostat using various algorithms
 * (EMA, Median, Average, Slope detection) to prevent jitter and spikes in heating control.
 */
const {
  log, items, rules, actions, triggers, cache, time,
} = require('openhab');

const ruleUID = 'heating-ct-smooth-temperature';
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.heating-ct-smooth-temperature
// log:set INFO org.openhab.automation.openhab-js.heating-ct-smooth-temperature

scriptLoaded = function () {
  logger.debug('scriptLoaded - {}', ruleUID);
};

// get transfer alpha value based on difference in degrees (upto), e.g absDiff <= tp.degreesDiff;
const transferCurve = {
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
};

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
 * @param {string} [key='default'] - Unique key to separate buffers for different items.
 * @returns {number} The calculated median value.
 */
function calcMedian(currentReading, windowSize = 3, key = 'default') {
  const bufferKey = `medianBuffer_${key}`;
  const buffer = cache.private.get(bufferKey, () => []);
  const numericValue = parseFloat(currentReading);
  buffer.push(numericValue);
  // logger.debug('..median buffer size: {}, values: {}', buffer.length, JSON.stringify(buffer));
  if (buffer.length > windowSize) buffer.shift();
  cache.private.put(bufferKey, buffer);

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
  const bufferName = `averageBuffer_${debugTag}`;
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
 * Converts an epoch timestamp (seconds) to a formatted time string (HH:mm:ss).
 *
 * @param {number} epochSeconds - The timestamp in seconds.
 * @returns {string} The formatted time string.
 */
function formatEpochToTime(epochSeconds) {
  const zdt = time.toZDT(time.toInstant(epochSeconds * 1000));
  return zdt.format(time.DateTimeFormatter.ofPattern('HH:mm:ss'));
}

/**
 * Clears the slope cache and logs a debug message.
 * @param {string} message - The message to log.
 */
function clearSlopeCache(message) {
  cache.private.remove('slopeCache');
  logger.debug(`.${message}`);
}

/**
 * Calculates the currentReadingGradient between two temperature points and filters out spikes
 * if the rate of change exceeds a threshold.
 *
 * @param {number|string} oldTemp - The previous temperature value.
 * @param {number} oldTime - The epoch timestamp of the previous reading.
 * @param {number|string} newTemp - The current temperature value.
 * @param {number} newTime - The epoch timestamp of the current reading.
 * @returns {number} The filtered temperature (either current or previous).
 */
function calculateLimitRateOfChange(oldTemp, oldTime, newTemp, newTime) {
  // maximum allowed gradient (degrees per second)
  const maxAllowedGradient = 0.1 / 70; // 0.1 degree per 90 seconds

  // number of consecutive too steep readings before accepting newTempVal anyway
  // e.g accept new temp if this many previos readings were rejected, accept n+1 reading
  // handles genuine rapid temp changes, e.g window opened etc
  const maxRejectedGradientSamples = 3;

  // convert to floats into local variables (do not reassign parameters)
  let oldTempVal = parseFloat(oldTemp);
  let oldTimeVal = oldTime;
  const newTempVal = parseFloat(newTemp);
  const newTimeVal = newTime;
  let numberReadingsTooSteep = 0;

  logger.debug('..oldTempVal: {}, oldTimeVal: {}', oldTempVal, formatEpochToTime(oldTimeVal));
  logger.debug('..newTempVal: {}, newTimeVal: {}', newTempVal, formatEpochToTime(newTimeVal));

  if (Number.isNaN(oldTempVal) || Number.isNaN(newTempVal)) {
    logger.warn('..calculateLimitRateOfChange: Invalid inputs. prev: {}, curr: {}', oldTemp, newTemp);
    return !Number.isNaN(newTempVal) ? newTempVal : oldTempVal;
  }

  // check cache for a last accepted oldTempVal to avoid using a spike(last time through) as oldTempVal
  const slopeCache = cache.private.get('slopeCache');
  if (slopeCache && slopeCache.oldTempVal !== null && slopeCache.oldTempVal !== undefined) {
    logger.debug('..using CACHED slopeCache.oldTempVal: {} instead of spike oldTempVal: {}', slopeCache.oldTempVal, oldTempVal);
    logger.debug('..using CACHED oldTimeVal: {} instead of spike oldTimeVal: {}', formatEpochToTime(slopeCache.oldTimeVal), formatEpochToTime(oldTimeVal));
    logger.debug('..had {} consecutive TOO STEEP readings cached', slopeCache.numberReadingsTooSteep);

    oldTempVal = slopeCache.oldTempVal;
    oldTimeVal = slopeCache.oldTimeVal;
    numberReadingsTooSteep = slopeCache.numberReadingsTooSteep || 0;
    // clear cache now used
    clearSlopeCache('..cleared slopeCache after use');
  } else {
    logger.debug('..no slopeCache in CACHE, using passed oldTempVal: {} and oldTimeVal: {}', oldTempVal, formatEpochToTime(oldTimeVal));
  }

  const deltaTemp = parseFloat((newTempVal - oldTempVal).toFixed(2));
  const deltaTime = (newTimeVal - oldTimeVal);
  logger.debug('..deltaTemp = {} ({} - {})', deltaTemp, newTempVal, oldTempVal);
  logger.debug('..deltaTime = {} ({} - {})', formatEpochToTime(deltaTime), formatEpochToTime(newTimeVal), formatEpochToTime(oldTimeVal));
  // if (deltaTime === 0) {
  //   logger.debug('..deltaTime is 0, returning oldTempVal: {}', oldTempVal);
  //   return oldTempVal;
  // }
  // if (deltaTemp === 0) {
  //   logger.debug('..deltaTemp is 0, returning newTempVal: {}', newTempVal);
  //   return newTempVal;
  // }
  const newReadingGradient = deltaTemp / deltaTime;
  // express newReadingGradient as degrees per hour
  const newReadingGradientPerHour = parseFloat((newReadingGradient * 3600).toFixed(2));
  logger.debug('..newReadingGradientPerHour: {}', newReadingGradientPerHour);

  // express maxAllowedGradient as degrees per hour for logging
  const maxAllowedGradientPerHour = parseFloat((maxAllowedGradient * 3600).toFixed(2));
  logger.debug('..maxAllowedGradient d/hr: {}', maxAllowedGradientPerHour);

  if (Math.abs(newReadingGradient) > maxAllowedGradient) { // gradient greater than threshold
    // increment counter if curreent gradient is positive, decrement if negative
    if (newReadingGradient > 0) {
      numberReadingsTooSteep += 1;
      logger.debug('..incrementing numberReadingsTooSteep to {}', numberReadingsTooSteep);
    } else {
      numberReadingsTooSteep -= 1;
      logger.debug('..decrementing numberReadingsTooSteep to {}', numberReadingsTooSteep);
    }
    // numberReadingsTooSteep += 1;
    logger.debug('..SLOPE TOO STEEP. newReadingGradientPerHour {} >= maxAllowedGradientPerHour {}, returning oldTempVal: {} (spike rejected)', newReadingGradientPerHour, maxAllowedGradientPerHour, oldTempVal);
    logger.debug('..storing slope data in CACHE. Steep readings count: {}', numberReadingsTooSteep);
    logger.debug('..storing slopePreviousTemp {} and slopePreviousTime {} in CACHE to avoid using spike as previous for next reading', oldTempVal, formatEpochToTime(oldTimeVal));
    // an ignored spike must also be not used as previous for next calc
    // set and store oldTempVal for next calc
    // also store timestamp of oldTempVal
    cache.private.put('slopeCache', {
      oldTempVal,
      oldTimeVal,
      newReadingGradient,
      numberReadingsTooSteep,
    });

    // if there have been n consecutive too steep readings, accept the newTempVal anyway
    // implies genuine rapid temp change, e.g window opened etc, not a sensor spike
    if (Math.abs(numberReadingsTooSteep) >= maxRejectedGradientSamples) {
      logger.debug('..SLOPE TOO STEEP.. BUT {} consecutive readings, ACCEPTING newTempVal: {} anyway', numberReadingsTooSteep, newTempVal);
      // remove counter, clear cache
      clearSlopeCache(`..numberReadingsTooSteep ${numberReadingsTooSteep} reset to clear from CACHE`);
      // show message leaving function
      logger.debug('..numberReadingsTooSteep limit. leaving calculateLimitRateOfChange, returning newTempVal: {}', newTempVal);

      return newTempVal;
    }

    // show message leaving function
    logger.debug('..gradient greater than threshold, leaving calculateLimitRateOfChange, returning oldTempVal: {}', oldTempVal);
    return oldTempVal;
  }
  // else less than threshold
  logger.debug('..SLOPE ACCEPTABLE newReadingGradientPerHour {} < maxAllowedGradientPerHour {}, returning newTempVal: {}', newReadingGradientPerHour, maxAllowedGradientPerHour, newTempVal);
  clearSlopeCache('..resetting slopeCache in CACHE');

  // if the temperature is above the conservatory setpoint show a message indicating heating off
  const setpoint = items.getItem('CT_ThermostatTemperatureSetpoint').rawState;
  if (newTempVal > setpoint) {
    logger.debug('..temperature {} is above setpoint {}, heating off', newTempVal, setpoint);
  } else {
    logger.debug('..temperature {} is at or below setpoint {}, heating on', newTempVal, setpoint);
  }
  // show message leaving function
  logger.debug('..less than maxAllowedGradient threshold. leaving calculateLimitRateOfChange, returning newTempVal: {}', newTempVal);
  return newTempVal;
}

rules.JSRule({
  name: 'smooth out CT temperature readings',
  description: 'smooth out CT temperature readings',
  triggers: [triggers.ItemStateUpdateTrigger('CT_Temperature_sensor')],
  execute: (event) => {
    // logger.debug('------------------------------------------');
    // logger.debug('>NEW CT Temp Sensor: smoothing ct sensor temp reading.........');
    // logger.debug(`Event: ${JSON.stringify(event)}`);
    // logger.debug('------------------------------------------');

    // get new temp sensor reading and timestamp
    const tempSensorItem = items.getItem('CT_Temperature_sensor');
    let newTempSensorState = tempSensorItem.state;
    if (newTempSensorState !== 'NULL' && newTempSensorState !== 'UNDEF') {
      newTempSensorState = parseFloat(newTempSensorState).toFixed(1);
    }
    const newTempSensorStateTimestamp = tempSensorItem.lastStateUpdateTimestamp;

    // get previousTempSensorState from persistence
    let previousTempSensorState = tempSensorItem.persistence.previousState().state;
    const previousSensorTempSateTimestamp = tempSensorItem.persistence.previousState().timestamp;
    if (previousTempSensorState !== null && previousTempSensorState !== 'NULL' && previousTempSensorState !== 'UNDEF') {
      previousTempSensorState = parseFloat(previousTempSensorState).toFixed(1);
    }
    logger.debug(`previousTempSensorState.: ${previousTempSensorState}, ${previousSensorTempSateTimestamp ? formatEpochToTime(previousSensorTempSateTimestamp.toEpochSecond()) : 'null'}`);
    if (previousTempSensorState === 'NULL' || previousTempSensorState === 'UNDEF') {
      logger.debug('previousTempSensorState is NULL or UNDEF, using newTempSensorState.');
      previousTempSensorState = newTempSensorState;
    }

    // get previous temp Ambient Used from persistence
    const ambientTempItem = items.getItem('CT_ThermostatTemperatureAmbient');
    let previousAmbientTempState = ambientTempItem.persistence.previousState().state;
    const previousAmbientTempSateTimestamp = ambientTempItem.persistence.previousState().timestamp;
    if (previousAmbientTempState !== null && previousAmbientTempState !== 'NULL' && previousAmbientTempState !== 'UNDEF') {
      previousAmbientTempState = parseFloat(previousAmbientTempState).toFixed(1);
    }
    logger.debug(`previousAmbientTempState: ${previousAmbientTempState}, ${previousAmbientTempSateTimestamp ? formatEpochToTime(previousAmbientTempSateTimestamp.toEpochSecond()) : 'null'}`);
    if (previousAmbientTempState === 'NULL' || previousAmbientTempState === 'UNDEF') {
      logger.debug('previousAmbientTempState is NULL or UNDEF, using current ambientTempItem.');
      previousAmbientTempState = ambientTempItem.state;
    }

    // currentAmbientTempState in use temp
    let currentAmbientTempState = items.getItem('CT_ThermostatTemperatureAmbient').state;
    if (currentAmbientTempState !== 'NULL' && currentAmbientTempState !== 'UNDEF') {
      currentAmbientTempState = parseFloat(currentAmbientTempState).toFixed(1);
    }
    const currentAmbientTempTimestamp = items.getItem('CT_ThermostatTemperatureAmbient').lastStateUpdateTimestamp;
    logger.debug(`currentAmbientTempState.: ${currentAmbientTempState}, ${currentAmbientTempTimestamp ? formatEpochToTime(currentAmbientTempTimestamp.toEpochSecond()) : 'null'}`);

    // newTempSensorState and timestamp from persistence
    logger.debug(`newTempSensorState......: ${newTempSensorState}, ${newTempSensorStateTimestamp ? formatEpochToTime(newTempSensorStateTimestamp.toEpochSecond()) : 'null'}`);
    if (newTempSensorState === 'NULL' || newTempSensorState === 'UNDEF') {
      logger.warn('newTempSensorState is NULL or UNDEF, skipping smoothing.');
      return;
    }

    let preciseTemp = parseFloat(items.getItem('CT_ThermostatTemperatureAmbient_precision').state);

    // if preciseTemp is null set to rawTemp
    if (items.getItem('CT_ThermostatTemperatureAmbient_precision').state === 'NULL') {
      preciseTemp = newTempSensorState;
      logger.error(`setup initial value of preciseTemp from rawtemp: ${preciseTemp}`);
    }

    const decimalPlaces = 1;

    // Convert timestamps to epoch seconds for calculation
    const currentAmbientTempTimestampEpoch = currentAmbientTempTimestamp ? currentAmbientTempTimestamp.toEpochSecond() : 0;
    const newTempSensorStateTimestampEpoch = newTempSensorStateTimestamp ? newTempSensorStateTimestamp.toEpochSecond() : 0;

    // calculate
    let temp0 = calculateLimitRateOfChange(currentAmbientTempState, currentAmbientTempTimestampEpoch, newTempSensorState, newTempSensorStateTimestampEpoch);
    // let temp0 = calculateLimitRateOfChange(previousAmbientTempState, previousAmbientTempSateTimestamp.toEpochSecond(), newTempSensorState, newTempSensorStateTimestampEpoch);

    temp0 = Number(temp0).toFixed(decimalPlaces);
    logger.debug(`temp0..calculated newReadingGradient temp0: ${temp0}\n`);
    items.getItem('temp0').postUpdate(temp0);

    // to 1 decimalPlaces for display and rules etc
    const workingTemp = Number(temp0).toFixed(1);
    // if workingTemp is NaN then log error and return
    if (Number.isNaN(parseFloat(workingTemp))) {
      logger.error(`calculated workingTemp is NaN: ${workingTemp}, rawTemp: ${newTempSensorState}, preciseTemp: ${preciseTemp}`);
      return;
    }

    items.getItem('CT_ThermostatTemperatureAmbient').postUpdate(workingTemp);
    items.getItem('FH_ThermostatTemperatureAmbient').postUpdate(workingTemp);
    logger.debug(`writing new ct temp 1 decimal Places to CT and FH ambient temp: ${workingTemp}`);

    // get temp in working item value
    const ctTemp = items.getItem('CT_ThermostatTemperatureAmbient').state;
    logger.debug(`newTemp CT_ThermostatTemperatureAmbient: ${ctTemp}`);

    logger.debug(`newTempSensorState:${newTempSensorState}, currentAmbientTempState:${currentAmbientTempState}, new workingTemp:${workingTemp}`);
  },
});
