/* eslint-disable max-len */
/**
 * @file 36-heating_CT_Temperature.js
 * @description Smooths raw reading readings for the Conservatory (CT) thermostat using various algorithms
 * (EMA, Median, Average, Slope detection) to prevent jitter and spikes in heating control.
 */
const {
  log, items, rules, actions, triggers, cache, time,
} = require('openhab');

const ruleUID = 'soil1_moisture_sensor_smoothing';
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
function clearSlopeCache(cacheTag, message) {
  cache.private.remove(cacheTag.toString());
  logger.error(`removing ${cacheTag} from CACHE - .${message}`);
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
function getLimitedRateOfChangeReading(oldData, newData, maxAllowedGradient) {
  // maximum allowed gradient (units per second)
  // const maxAllowedGradient = 4 / (5 * 60); // 0.1 unit per 60 seconds

  // number of consecutive too steep readings before accepting newReadingVal anyway
  // e.g accept new reading if this many previous readings were rejected, accept n+1 reading
  // handles genuine rapid reading gradient changes
  const maxRejectedGradientSamples = 3;
  const preSpikeValsCacheTag = `${ruleUID.toString()}.preSpikeVals`;

  // convert to floats into local variables (do not reassign parameters)
  let oldReadingVal = parseFloat(oldData.reading);
  let oldTimeVal = oldData.time;
  const newReadingVal = parseFloat(newData.reading);
  const newTimeVal = newData.time;
  let rejectedGradientReadingsCount = 0;

  logger.debug('..oldReadingVal: {}, oldTimeVal: {}', oldReadingVal, formatEpochToTime(oldTimeVal));
  logger.debug('..newReadingVal: {}, newTimeVal: {}', newReadingVal, formatEpochToTime(newTimeVal));

  if (Number.isNaN(oldReadingVal) || Number.isNaN(newReadingVal)) {
    logger.warn(
      '..getLimitedRateOfChangeReading: Invalid inputs. prev: {}, curr: {}',
      oldData.reading,
      newData.reading,
    );
    return !Number.isNaN(newReadingVal) ? newReadingVal : oldReadingVal;
  }

  // check cache for a lastGoodReading to avoid using a spike(last time through) as oldReadingVal
  const preSpikeVals = cache.private.get(preSpikeValsCacheTag);
  if (preSpikeVals && preSpikeVals.lastGoodReading !== null && preSpikeVals.lastGoodReading !== undefined) {
    logger.debug(
      '..using CACHED preSpikeVals.lastGoodReading: {} instead of spike oldReadingVal: {}',
      preSpikeVals.lastGoodReading,
      oldReadingVal,
    );
    logger.debug(
      '..using CACHED preSpikeVals.lastGoodReadingTimestamp: {} instead of spike oldTimeVal: {}',
      formatEpochToTime(preSpikeVals.lastGoodReadingTimestamp),
      formatEpochToTime(oldTimeVal),
    );
    logger.debug(
      '..had {} consecutive preSpikeVals.rejectedGradientReadingsCount in CACHE',
      preSpikeVals.rejectedGradientReadingsCount,
    );

    oldReadingVal = preSpikeVals.lastGoodReading;
    oldTimeVal = preSpikeVals.lastGoodReadingTimestamp;
    rejectedGradientReadingsCount = preSpikeVals.rejectedGradientReadingsCount || 0;
    // clear cache now used
    clearSlopeCache(preSpikeValsCacheTag, '..removed preSpikeVals after use from CACHE');
  } else {
    logger.debug(
      '..no preSpikeVals in CACHE, using passed oldReadingVal: {} and oldTimeVal: {}',
      oldReadingVal,
      formatEpochToTime(oldTimeVal),
    );
  }

  const deltaReading = parseFloat((newReadingVal - oldReadingVal).toFixed(2));
  const deltaTime = newTimeVal - oldTimeVal;
  logger.debug('..deltaReading = {} ({} - {})', deltaReading, newReadingVal, oldReadingVal);
  logger.debug(
    '..deltaTime = {} ({} - {})',
    formatEpochToTime(deltaTime),
    formatEpochToTime(newTimeVal),
    formatEpochToTime(oldTimeVal),
  );
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

  if (Math.abs(newReadingGradient) > maxAllowedGradient) {
    // gradient greater than threshold
    // increment counter if curreent gradient is positive, decrement if negative
    if (newReadingGradient > 0) {
      rejectedGradientReadingsCount += 1;
      logger.debug('..incrementing rejectedGradientReadingsCount to {}', rejectedGradientReadingsCount);
    } else {
      rejectedGradientReadingsCount -= 1;
      logger.debug('..decrementing rejectedGradientReadingsCount to {}', rejectedGradientReadingsCount);
    }
    // rejectedGradientReadingsCount += 1;
    logger.debug(
      '..SLOPE TOO STEEP. newReadingGradientPerHour {} >= maxAllowedGradientPerHour {}, returning oldReadingVal: {} (spike rejected)',
      newReadingGradientPerHour,
      maxAllowedGradientPerHour,
      oldReadingVal,
    );
    logger.debug('..storing preSpikeVals in CACHE. Steep readings count: {}', rejectedGradientReadingsCount);
    logger.debug(
      '..storing preSpikeVals.lastGoodReading {} and preSpikeVals.lastGoodReadingTimestamp {} in CACHE to avoid using spike as previous for next reading',
      oldReadingVal,
      formatEpochToTime(oldTimeVal),
    );
    // an ignored spike must also be not used as previous for next calc
    // set and store oldReadingVal for next calc
    // also store timestamp of oldReadingVal
    cache.private.put(preSpikeValsCacheTag, {
      lastGoodReading: oldReadingVal,
      lastGoodReadingTimestamp: oldTimeVal,
      lastGoodReadingGradient: newReadingGradient,
      rejectedGradientReadingsCount,
    });

    // if there have been n consecutive too steep readings, accept the newReadingVal anyway
    // implies genuine rapid reading change, e.g window opened etc, not a sensor spike
    if (Math.abs(rejectedGradientReadingsCount) >= maxRejectedGradientSamples) {
      logger.debug(
        '..SLOPE TOO STEEP.. BUT {} consecutive readings, ACCEPTING newReadingVal: {} anyway',
        rejectedGradientReadingsCount,
        newReadingVal,
      );
      // remove counter, clear cache
      clearSlopeCache(preSpikeValsCacheTag, `..rejectedGradientReadingsCount ${rejectedGradientReadingsCount} removed from CACHE`);
      // show message leaving function
      logger.debug(
        '..rejectedGradientReadingsCount limit. leaving getLimitedRateOfChangeReading, returning newReadingVal: {}',
        newReadingVal,
      );

      return newReadingVal;
    }

    // show message leaving function
    logger.debug(
      '..gradient greater than threshold, leaving getLimitedRateOfChangeReading, returning oldReadingVal: {}',
      oldReadingVal,
    );
    return oldReadingVal;
  }
  // else less than threshold
  logger.debug(
    '..SLOPE ACCEPTABLE newReadingGradientPerHour {} < maxAllowedGradientPerHour {}, returning newReadingVal: {}',
    newReadingGradientPerHour,
    maxAllowedGradientPerHour,
    newReadingVal,
  );
  clearSlopeCache(preSpikeValsCacheTag, '..removed preSpikeVals from CACHE');

  // if the reading is above the conservatory setpoint show a message indicating heating off
  const setpoint = items.getItem('CT_ThermostatTemperatureSetpoint').rawState;
  if (newReadingVal > setpoint) {
    logger.debug('..reading {} is above setpoint {}, heating off', newReadingVal, setpoint);
  } else {
    logger.debug('..reading {} is at or below setpoint {}, heating on', newReadingVal, setpoint);
  }
  // show message leaving function
  logger.debug(
    '..less than maxAllowedGradient threshold. leaving getLimitedRateOfChangeReading, returning newReadingVal: {}',
    newReadingVal,
  );
  return newReadingVal;
}

rules.JSRule({
  name: 'smooth out soil moisture readings',
  description: 'smooth out soil moisture readings',
  triggers: [triggers.ItemStateUpdateTrigger('soil_moisture_1_rawReading')],
  execute: () => {
    // get new reading sensor reading and timestamp
    const sensorItem = items.getItem('soil_moisture_1_rawReading');
    let newReadingSensorState = sensorItem.state;
    if (newReadingSensorState !== 'NULL' && newReadingSensorState !== 'UNDEF') {
      newReadingSensorState = parseFloat(newReadingSensorState).toFixed(1);
    }
    const newReadingSensorStateTimestamp = sensorItem.lastStateUpdateTimestamp;
    // now have new reading data
    const newReadingSensorStateTimestampEpoch = newReadingSensorStateTimestamp
      ? newReadingSensorStateTimestamp.toEpochSecond()
      : 0;
    const newReadingData = { reading: newReadingSensorState, time: newReadingSensorStateTimestampEpoch };
    // skip smoothing if invalid newReadingSensorState
    logger.debug(
      `newReadingSensorState......: ${newReadingSensorState}, ${newReadingSensorStateTimestamp ? formatEpochToTime(newReadingSensorStateTimestamp.toEpochSecond()) : 'null'}`,
    );
    if (newReadingSensorState === 'NULL' || newReadingSensorState === 'UNDEF') {
      logger.warn('newReadingSensorState is NULL or UNDEF, skipping smoothing.');
      return;
    }

    // currentSensorState in use reading
    let currentSensorState = items.getItem('soil_moisture_1_raw_slew_limited').state;
    if (currentSensorState !== 'NULL' && currentSensorState !== 'UNDEF') {
      currentSensorState = parseFloat(currentSensorState).toFixed(1);
    }
    const currentSensorStateTimestamp = items.getItem('CT_ThermostatTemperatureAmbient').lastStateUpdateTimestamp;
    logger.debug(
      `currentSensorState.: ${currentSensorState}, ${currentSensorStateTimestamp ? formatEpochToTime(currentSensorStateTimestamp.toEpochSecond()) : 'null'}`,
    );
    // Convert timestamps to epoch seconds for calculation
    const currentSensorStateTimestampEpoch = currentSensorStateTimestamp
      ? currentSensorStateTimestamp.toEpochSecond()
      : 0;
    const currentReadingData = { reading: currentSensorState, time: currentSensorStateTimestampEpoch };

    const decimalPlaces = 1;

    // calculate
    const maxAllowedGradient = 4 / (5 * 60);
    let reading0 = getLimitedRateOfChangeReading(currentReadingData, newReadingData, maxAllowedGradient);

    reading0 = Number(reading0).toFixed(decimalPlaces);
    logger.debug(`reading0..calculated newReading reading0: ${reading0}\n`);
    // items.getItem('reading0').postUpdate(reading0);

    // to 1 decimalPlaces for display and rules etc
    const newReading = Number(reading0).toFixed(1);
    // if newReading is NaN then log error and return
    if (Number.isNaN(parseFloat(newReading))) {
      logger.error(
        `calculated newReading is NaN: ${newReading}, rawTemp: ${newReadingSensorState}`,
      );
      return;
    }

    items.getItem('soil_moisture_1_raw_slew_limited').postUpdate(newReading);
    logger.debug(`writing new ct reading 1 decimal Places to CT and FH ambient reading: ${newReading}`);

    // get reading in working item value
    // const ctTemp = items.getItem('soil_moisture_1_raw_slew_limited').state;
    // logger.debug(`newReading soil_moisture_1_raw_slew_limited: ${ctTemp}`);

    logger.debug(
      `newReadingSensorState:${newReadingSensorState}, soil_moisture_1_raw_slew_limited:${currentSensorState}, new newReading:${newReading}`,
    );
  },
});
