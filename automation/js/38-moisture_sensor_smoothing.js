/**
 * @file 36-heating_CT_Temperature.js
 * @description Smooths raw reading readings for the Conservatory (CT) thermostat using various algorithms
 * (EMA, Median, Average, Slope detection) to prevent jitter and spikes in heating control.
 */
const {
  log, items, rules, actions, triggers, cache, time,
} = require('openhab');

const ruleUID = 'moisture_sensor_smoothing';
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.moisture_sensor_smoothing
// log:set INFO org.openhab.automation.openhab-js.moisture_sensor_smoothing

scriptLoaded = function () {
  logger.debug('scriptLoaded - {}', ruleUID);
};

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
  cache.private.remove('preSpikeVals');
  logger.debug(`.${message}`);
}

/**
 * Calculates the currentReadingGradient between two reading points and filters out spikes
 * if the rate of change exceeds a threshold.
 * returns the new reading if the gradient is acceptable, otherwise returns the old reading.
 *
 * @param {object} oldData - The previous reading object { reading, time }.
 * @param {object} newData - The current reading object { reading, time }.
 * @returns {number} The filtered reading (either current or previous).
 */
function getLimitedRateOfChangeReading(oldData, newData) {
  // maximum allowed gradient (units per second)
  const maxAllowedGradient = 0.1 / 60; // 0.1 unit per 60 seconds

  // number of consecutive too steep readings before accepting newReadingVal anyway
  // e.g accept new reading if this many previous readings were rejected, accept n+1 reading
  // handles genuine rapid reading gradient changes
  const maxRejectedGradientSamples = 3;

  // convert to floats into local variables (do not reassign parameters)
  let oldReadingVal = parseFloat(oldData.reading);
  let oldTimeVal = oldData.time;
  const newReadingVal = parseFloat(newData.reading);
  const newTimeVal = newData.time;
  let rejectedGradientReadings = 0;

  logger.debug('..oldReadingVal: {}, oldTimeVal: {}', oldReadingVal, formatEpochToTime(oldTimeVal));
  logger.debug('..newReadingVal: {}, newTimeVal: {}', newReadingVal, formatEpochToTime(newTimeVal));

  if (Number.isNaN(oldReadingVal) || Number.isNaN(newReadingVal)) {
    logger.warn('..getLimitedRateOfChangeReading: Invalid inputs. prev: {}, curr: {}', oldData.reading, newData.reading);
    return !Number.isNaN(newReadingVal) ? newReadingVal : oldReadingVal;
  }

  // check cache for a lastGoodReading to avoid using a spike(last time through) as oldReadingVal
  const preSpikeVals = cache.private.get('preSpikeVals');
  if (preSpikeVals && preSpikeVals.lastGoodReading !== null && preSpikeVals.lastGoodReading !== undefined) {
    logger.debug('..using CACHED preSpikeVals.lastGoodReading: {} instead of spike oldReadingVal: {}', preSpikeVals.lastGoodReading, oldReadingVal);
    logger.debug('..using CACHED preSpikeVals.lastGoodReadingTimestamp: {} instead of spike oldTimeVal: {}', formatEpochToTime(preSpikeVals.lastGoodReadingTimestamp), formatEpochToTime(oldTimeVal));
    logger.debug('..had {} consecutive preSpikeVals.rejectedGradientReadings in CACHE', preSpikeVals.rejectedGradientReadings);

    oldReadingVal = preSpikeVals.lastGoodReading;
    oldTimeVal = preSpikeVals.lastGoodReadingTimestamp;
    rejectedGradientReadings = preSpikeVals.rejectedGradientReadings || 0;
    // clear cache now used
    clearSlopeCache('..removed preSpikeVals after use from CACHE');
  } else {
    logger.debug('..no preSpikeVals in CACHE, using passed oldReadingVal: {} and oldTimeVal: {}', oldReadingVal, formatEpochToTime(oldTimeVal));
  }

  const deltaReading = parseFloat((newReadingVal - oldReadingVal).toFixed(2));
  const deltaTime = (newTimeVal - oldTimeVal);
  logger.debug('..deltaReading = {} ({} - {})', deltaReading, newReadingVal, oldReadingVal);
  logger.debug('..deltaTime = {} ({} - {})', formatEpochToTime(deltaTime), formatEpochToTime(newTimeVal), formatEpochToTime(oldTimeVal));
  // if (deltaTime === 0) {
  //   logger.debug('..deltaTime is 0, returning oldReadingVal: {}', oldReadingVal);
  //   return oldReadingVal;
  // }
  // if (deltaReading === 0) {
  //   logger.debug('..deltaReading is 0, returning newReadingVal: {}', newReadingVal);
  //   return newReadingVal;
  // }
  const newReadingGradient = deltaReading / deltaTime;
  // express newReadingGradient as units per hour
  const newReadingGradientPerHour = parseFloat((newReadingGradient * 3600).toFixed(2));
  logger.debug('..newReadingGradientPerHour: {}', newReadingGradientPerHour);

  // express maxAllowedGradient as units per hour for logging
  const maxAllowedGradientPerHour = parseFloat((maxAllowedGradient * 3600).toFixed(2));
  logger.debug('..maxAllowedGradientPerHour: {}', maxAllowedGradientPerHour);

  if (Math.abs(newReadingGradient) > maxAllowedGradient) { // gradient greater than threshold
    // increment counter if curreent gradient is positive, decrement if negative
    if (newReadingGradient > 0) {
      rejectedGradientReadings += 1;
      logger.debug('..incrementing rejectedGradientReadings to {}', rejectedGradientReadings);
    } else {
      rejectedGradientReadings -= 1;
      logger.debug('..decrementing rejectedGradientReadings to {}', rejectedGradientReadings);
    }
    // rejectedGradientReadings += 1;
    logger.debug('..SLOPE TOO STEEP. newReadingGradientPerHour {} >= maxAllowedGradientPerHour {}, returning oldReadingVal: {} (spike rejected)', newReadingGradientPerHour, maxAllowedGradientPerHour, oldReadingVal);
    logger.debug('..storing preSpikeVals in CACHE. Steep readings count: {}', rejectedGradientReadings);
    logger.debug('..storing preSpikeVals.lastGoodReading {} and preSpikeVals.lastGoodReadingTimestamp {} in CACHE to avoid using spike as previous for next reading', oldReadingVal, formatEpochToTime(oldTimeVal));
    // an ignored spike must also be not used as previous for next calc
    // set and store oldReadingVal for next calc
    // also store timestamp of oldReadingVal
    cache.private.put('preSpikeVals', {
      lastGoodReading: oldReadingVal,
      lastGoodReadingTimestamp: oldTimeVal,
      lastGoodReadingGradient: newReadingGradient,
      rejectedGradientReadings,
    });

    // if there have been n consecutive too steep readings, accept the newReadingVal anyway
    // implies genuine rapid reading change, e.g window opened etc, not a sensor spike
    if (Math.abs(rejectedGradientReadings) >= maxRejectedGradientSamples) {
      logger.debug('..SLOPE TOO STEEP.. BUT {} consecutive readings, ACCEPTING newReadingVal: {} anyway', rejectedGradientReadings, newReadingVal);
      // remove counter, clear cache
      clearSlopeCache(`..rejectedGradientReadings ${rejectedGradientReadings} removed from CACHE`);
      // show message leaving function
      logger.debug('..rejectedGradientReadings limit. leaving getLimitedRateOfChangeReading, returning newReadingVal: {}', newReadingVal);

      return newReadingVal;
    }

    // show message leaving function
    logger.debug('..gradient greater than threshold, leaving getLimitedRateOfChangeReading, returning oldReadingVal: {}', oldReadingVal);
    return oldReadingVal;
  }
  // else less than threshold
  logger.debug('..SLOPE ACCEPTABLE newReadingGradientPerHour {} < maxAllowedGradientPerHour {}, returning newReadingVal: {}', newReadingGradientPerHour, maxAllowedGradientPerHour, newReadingVal);
  clearSlopeCache('..removed preSpikeVals from CACHE');

  // if the reading is above the conservatory setpoint show a message indicating heating off
  const setpoint = items.getItem('CT_ThermostatTemperatureSetpoint').rawState;
  if (newReadingVal > setpoint) {
    logger.debug('..reading {} is above setpoint {}, heating off', newReadingVal, setpoint);
  } else {
    logger.debug('..reading {} is at or below setpoint {}, heating on', newReadingVal, setpoint);
  }
  // show message leaving function
  logger.debug('..less than maxAllowedGradient threshold. leaving getLimitedRateOfChangeReading, returning newReadingVal: {}', newReadingVal);
  return newReadingVal;
}

rules.JSRule({
  name: 'smooth out soil moisture readings',
  description: 'smooth out soil moisture readings',
  triggers: [triggers.ItemStateUpdateTrigger('Soil_Moisture_Sensor')],
  execute: () => {
    // logger.debug('------------------------------------------');
    // logger.debug('>NEW CT Temp Sensor: smoothing ct sensor reading reading.........');
    // logger.debug(`Event: ${JSON.stringify(event)}`);
    // logger.debug('------------------------------------------');

    // get new reading sensor reading and timestamp
    const tempSensorItem = items.getItem('CT_Temperature_sensor');
    let newReadingSensorState = tempSensorItem.state;
    if (newReadingSensorState !== 'NULL' && newReadingSensorState !== 'UNDEF') {
      newReadingSensorState = parseFloat(newReadingSensorState).toFixed(1);
    }
    const newReadingSensorStateTimestamp = tempSensorItem.lastStateUpdateTimestamp;

    // get previousTempSensorState from persistence
    let previousTempSensorState = tempSensorItem.persistence.previousState().state;
    const previousSensorTempSateTimestamp = tempSensorItem.persistence.previousState().timestamp;
    if (previousTempSensorState !== null && previousTempSensorState !== 'NULL' && previousTempSensorState !== 'UNDEF') {
      previousTempSensorState = parseFloat(previousTempSensorState).toFixed(1);
    }
    logger.debug(`previousTempSensorState.: ${previousTempSensorState}, ${previousSensorTempSateTimestamp ? formatEpochToTime(previousSensorTempSateTimestamp.toEpochSecond()) : 'null'}`);
    if (previousTempSensorState === 'NULL' || previousTempSensorState === 'UNDEF') {
      logger.debug('previousTempSensorState is NULL or UNDEF, using newReadingSensorState.');
      previousTempSensorState = newReadingSensorState;
    }

    // get previous reading Ambient Used from persistence
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

    // currentAmbientTempState in use reading
    let currentAmbientTempState = items.getItem('CT_ThermostatTemperatureAmbient').state;
    if (currentAmbientTempState !== 'NULL' && currentAmbientTempState !== 'UNDEF') {
      currentAmbientTempState = parseFloat(currentAmbientTempState).toFixed(1);
    }
    const currentAmbientTempTimestamp = items.getItem('CT_ThermostatTemperatureAmbient').lastStateUpdateTimestamp;
    logger.debug(`currentAmbientTempState.: ${currentAmbientTempState}, ${currentAmbientTempTimestamp ? formatEpochToTime(currentAmbientTempTimestamp.toEpochSecond()) : 'null'}`);

    // newReadingSensorState and timestamp from persistence
    logger.debug(`newReadingSensorState......: ${newReadingSensorState}, ${newReadingSensorStateTimestamp ? formatEpochToTime(newReadingSensorStateTimestamp.toEpochSecond()) : 'null'}`);
    if (newReadingSensorState === 'NULL' || newReadingSensorState === 'UNDEF') {
      logger.warn('newReadingSensorState is NULL or UNDEF, skipping smoothing.');
      return;
    }

    let preciseTemp = parseFloat(items.getItem('CT_ThermostatTemperatureAmbient_precision').state);

    // if preciseTemp is null set to rawTemp
    if (items.getItem('CT_ThermostatTemperatureAmbient_precision').state === 'NULL') {
      preciseTemp = newReadingSensorState;
      logger.error(`setup initial value of preciseTemp from rawtemp: ${preciseTemp}`);
    }

    const decimalPlaces = 1;

    // Convert timestamps to epoch seconds for calculation
    const currentAmbientTempTimestampEpoch = currentAmbientTempTimestamp ? currentAmbientTempTimestamp.toEpochSecond() : 0;
    const newReadingSensorStateTimestampEpoch = newReadingSensorStateTimestamp ? newReadingSensorStateTimestamp.toEpochSecond() : 0;

    // calculate
    let temp0 = getLimitedRateOfChangeReading(
      { reading: currentAmbientTempState, time: currentAmbientTempTimestampEpoch },
      { reading: newReadingSensorState, time: newReadingSensorStateTimestampEpoch },
    );
    // let temp0 = getLimitedRateOfChangeReading(previousAmbientTempState, previousAmbientTempSateTimestamp.toEpochSecond(), newReadingSensorState, newReadingSensorStateTimestampEpoch);

    temp0 = Number(temp0).toFixed(decimalPlaces);
    logger.debug(`temp0..calculated newReadingGradient temp0: ${temp0}\n`);
    items.getItem('temp0').postUpdate(temp0);

    // to 1 decimalPlaces for display and rules etc
    const workingTemp = Number(temp0).toFixed(1);
    // if workingTemp is NaN then log error and return
    if (Number.isNaN(parseFloat(workingTemp))) {
      logger.error(`calculated workingTemp is NaN: ${workingTemp}, rawTemp: ${newReadingSensorState}, preciseTemp: ${preciseTemp}`);
      return;
    }

    items.getItem('CT_ThermostatTemperatureAmbient').postUpdate(workingTemp);
    items.getItem('FH_ThermostatTemperatureAmbient').postUpdate(workingTemp);
    logger.debug(`writing new ct reading 1 decimal Places to CT and FH ambient reading: ${workingTemp}`);

    // get reading in working item value
    const ctTemp = items.getItem('CT_ThermostatTemperatureAmbient').state;
    logger.debug(`newReading CT_ThermostatTemperatureAmbient: ${ctTemp}`);

    logger.debug(`newReadingSensorState:${newReadingSensorState}, currentAmbientTempState:${currentAmbientTempState}, new workingTemp:${workingTemp}`);
  },
});
