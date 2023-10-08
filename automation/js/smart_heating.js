const {
    log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

var ruleUID = "smart_heating";

const logger = log(ruleUID);
const { timeUtils } = require('openhab_rules_tools');
// openhab> log:set DEBUG org.openhab.automation.openhab-js.smart_heating

var { TimerMgr } = require('openhab_rules_tools');
var timerMgr = cache.private.get('timers', () => TimerMgr());

//   on 16m
// if no temp inc on 15m

rules.JSRule({
    name: 'smart heating',
    description: 'smart heating',
    triggers: [
      triggers.GroupStateUpdateTrigger('gHeatingModes'),
      triggers.GroupStateChangeTrigger('gThermostatTemperatureSetpoints'),
      triggers.GroupStateChangeTrigger('gThermostatTemperatureAmbients'),
    ],
    execute: (event) => {
      logger.debug('>-------------------------------');

      logger.debug('>smart heating');
      logger.debug(`itemName: ${event.itemName}`);
      logger.debug(`oldState: ${event.oldState}`);
      logger.debug(`newState: ${event.newState}`);

      // const action = 'default';
      // get prefix eg FR, CT etc
      const roomPrefix = event.itemName.toString().substr(0, event.itemName.indexOf('_'));
      logger.debug(`>roomPrefix: ${roomPrefix}`);
  
      const heatingModeItem = items.getItem(`${roomPrefix}_Heater_Mode`);
      logger.debug(`>heatingModeItem: ${heatingModeItem.name}: ${heatingModeItem.state}`);
  
      const setpointItem = items.getItem(`${roomPrefix}_ThermostatTemperatureSetpoint`);
      logger.debug(`>setpointItem: ${setpointItem.name}: ${setpointItem.state}`);
  
      const TemperatureItem = items.getItem(`${roomPrefix}_ThermostatTemperatureAmbient`);
      logger.debug(`>TemperatureItem: ${TemperatureItem.name}: ${TemperatureItem.state}`);
  
      const HeaterItem = items.getItem(`${roomPrefix}_Heater_Control`);
      logger.debug(`>HeaterItem: ${HeaterItem.name}: ${HeaterItem.state}`);
  
      const ReachableItem = items.getItem(`${roomPrefix}_Heater_Reachable`);
      logger.debug(`>ReachableItem: ${ReachableItem.name}: ${ReachableItem.state}`);
  

  
      logger.debug(`>masterHeatingMode.state.toString() : ${items.getItem('masterHeatingMode').state.toString()}`);
  
      //! add if boost on - skip
      // if this heater is currently in being boosted, then just l;eave it alone and move on
      const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// get boost item for this heater, return null if missing

    },
  });
  