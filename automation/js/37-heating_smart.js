const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { utils } = require('openhab-my-utils');

var ruleUID = "smart_heating";

const logger = log(ruleUID);
const { timeUtils } = require('openhab_rules_tools');
// openhab> log:set DEBUG org.openhab.automation.openhab-js.smart_heating
// openhab> log:set INFO org.openhab.automation.openhab-js.smart_heating
var { TimerMgr } = require('openhab_rules_tools');
var timerMgr = cache.private.get('timers', () => TimerMgr());

scriptLoaded = function () {
  logger.info(`scriptLoaded - ${ruleUID}`);
};


//   on 16m
// if no temp inc on 15m
//calc gradient

rules.JSRule({
  name: 'smart heating',
  description: 'smart heating',
  triggers: [
    triggers.GroupStateUpdateTrigger('gHeatingModes'),
    triggers.GroupStateChangeTrigger('gThermostatTemperatureSetpoints'),
    triggers.GroupStateChangeTrigger('gThermostatTemperatureAmbients'),
  ],
  execute: (event) => {
    // const roomPrefix = doSetup(event);
    logger.debug('.....................................');

    const roomPrefix = utils.getLocationPrefix(event.itemName, logger);
    logger.debug('~~roomPrefix: {}', roomPrefix);

    if (roomPrefix == 'CT') {


      //get initial readings
      tempNow = items.getItem('CT_ThermostatTemperatureAmbient').rawState;
      logger.debug('~~tempNow: {}', tempNow);

      // timeNow = time.toZDT();
      // timeNow = time.LocalTime.now();
      timeNow = time.Instant.now();
      // timeNowStr = timeNow.withFixedOffsetZone().toString();//https://js-joda.github.io/js-joda/manual/ZonedDateTime.html
      // '2023-10-28T15:30:37.378+01:00' could not be parsed at index 23
      logger.debug('~~timeNow: {}', timeNow.toString());
      // logger.debug('~~timeNow: {}', timeNowStr);
      var ins = time.Instant.parse(timeNow.toString()) // in epoch secondsText '2023-10-28T15:47:38.348Z' could not be parsed: : 2023-10-28T15:47:38.348Z, at index: 0
      logger.debug('~~timeNow ins.toString(): {}', ins.toString());
      logger.debug('~~timeNow ins.epochSecond(): {}', ins.epochSecond());

      // ZonedDateTime.now().withFixedOffsetZone().toString();

      tempLastReading = items.getItem('CT_heating_tempLastReading').state
      logger.debug('~~tempLastReading: {}', tempLastReading);

      timeLastReading = items.getItem('CT_heating_timeLastReading').state
      logger.debug('~~timeLastReading: {}', timeLastReading);

      //establish on to temp inc time - latency
      deltaTime = ins.epochSecond() - timeLastReading
      items.getItem('CT_heating_deltaTime').postUpdate(deltaTime);
      // deltaTime = items.getItem('CT_heating_deltaTime').state
      logger.debug('~~deltaTime: {}', deltaTime);

      deltaTemp = tempNow - tempLastReading
      deltaTemp = deltaTemp.toFixed(2);
      items.getItem('CT_heating_deltaTemp').postUpdate(deltaTemp);
      // deltaTemp = items.getItem('CT_heating_deltaTemp').state
      logger.debug('~~deltaTemp: {}', deltaTemp);

      gradient = deltaTemp / deltaTime
      items.getItem('CT_heating_gradient').postUpdate(gradient);
      // gradient = items.getItem('CT_heating_gradient').state
      logger.debug('~~CT_heating_gradient.state: {}', gradient.toFixed(4));

      //save info to vars
      items.getItem('CT_heating_tempLastReading').postUpdate(tempNow);
      items.getItem('CT_heating_timeLastReading').postUpdate(ins.epochSecond());
      items.getItem('CT_heating_deltaTemp').postUpdate(deltaTemp);
      items.getItem('CT_heating_deltaTime').postUpdate(deltaTime);

      items.getItem('CT_heating_gradient').postUpdate(gradient);

      var ins = time.Instant.parse('2007-12-03T10:15:30.000Z') // 1196676930 in epoch seconds

    }

    // const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// get boost item for this heater, return null if missing

  },
});

function doSetup(event) {
  logger.debug('.....................................');

  logger.debug('...smart heating');
  logger.debug(`...itemName: ${event.itemName}`);
  logger.debug(`...oldState: ${event.oldState}`);
  logger.debug(`...newState: ${event.newState}`);

  // const action = 'default';
  // get prefix eg FR, CT etc
  // const roomPrefix = event.itemName.toString().substr(0, event.itemName.indexOf('_'));
  // logger.debug(`...roomPrefix: ${roomPrefix}`);
  const roomPrefix = utils.getLocationPrefix(event.itemName, logger);


  const heatingModeItem = items.getItem(`${roomPrefix}_Heater_Mode`);
  logger.debug(`...heatingModeItem: ${heatingModeItem.name}: ${heatingModeItem.state}`);

  const setpointItem = items.getItem(`${roomPrefix}_ThermostatTemperatureSetpoint`);
  logger.debug(`...setpointItem: ${setpointItem.name}: ${setpointItem.state}`);

  const TemperatureItem = items.getItem(`${roomPrefix}_ThermostatTemperatureAmbient`);
  logger.debug(`...TemperatureItem: ${TemperatureItem.name}: ${TemperatureItem.state}`);

  const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);
  logger.debug(`...HeaterItem: ${HeaterItem.name}: ${HeaterItem.state}`);

  const ReachableItem = items.getItem(`${roomPrefix}_Heater_Reachable`);
  logger.debug(`...ReachableItem: ${ReachableItem.name}: ${ReachableItem.state}`);


  logger.debug(`...masterHeatingMode.state: ${items.getItem('masterHeatingMode').state.toString()}`);
  logger.debug('.....................................');
  return roomPrefix;
}
