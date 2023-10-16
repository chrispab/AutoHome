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
//calc slope

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
      const roomPrefix = utils.getLocationPrefix(event.itemName, logger);

      //get initial readings

      //establish on to temp inc time - latency




      //! add if boost on - skip
      // if this heater is currently in being boosted, then just l;eave it alone and move on
      const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// get boost item for this heater, return null if missing

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
  