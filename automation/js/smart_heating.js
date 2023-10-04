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
      // triggers.GroupStateUpdateTrigger('gThermostatHumidityAmbients'),
      // triggers.GroupStateChangeTrigger('gHeaterBoosters', 'OFF', 'ON'), // on edges only
      // triggers.GroupStateChangeTrigger('gHeaterBoosters', 'ON', 'OFF'),
    ],
    execute: (event) => {
      // console.log(event);
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
  
      // !handle an offline TRV - return
      // !if ANY trvs are unreachable - turn off hetarer to prevent false demand
      // not just the calkkling device - which cant call anyway as its offline
      // dont continue on and update the bolier control if this RTV is Offline
    //   if (ReachableItem.state.toString() !== 'Online') {
    //     logger.info(`>>ZZZZ ReachableItem-Offline - sending OFF, leaving!!!!! : ${roomPrefix} : ,  ReachableItem.state: ${ReachableItem.state}`);
    //     // turn it off
    //     HeaterItem.sendCommand('OFF');
  
    //     items.getItem('HL_Heater_Control').sendCommand('OFF');//!
    //     // dont continue on and update the bolier control if this RTV is Offline
    //     return;
    //   }
    //   items.getItem('HL_Heater_Control').sendCommand('OFF');//!
  
      logger.debug(`>masterHeatingMode.state.toString() : ${items.getItem('masterHeatingMode').state.toString()}`);
  
      //! add if boost on - skip
      // if this heater is currently in being boosted, then just l;eave it alone and move on
      const BoostItem = items.getItem(`${roomPrefix}_Heater_Boost`, true);// get boost item for this heater, return null if missing
    //   if (BoostItem && BoostItem.state.toString() === 'ON') {
    //     logger.info(`>>>>Boosting item -->> BoostItem.name, return from heater routine: ${BoostItem.name}`);
    //     if (BoostItem.state === 'ON') { // in a boost period
    //       return;
    //     }
    //   }
      // logger.debug('>>>>no boost item defined for this heater, process as normal');
      // if HEATER alowed to be on, check if need to turn on heater
    //   if (((heatingModeItem.state.toString() === 'auto')) || ((heatingModeItem.state.toString() === 'manual'))) {
    //     logger.debug(`>>Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()}`);
    //     const setpoint = setpointItem.rawState;
    //     const turnOnTemp = setpoint; // # - 0.2// calculate the turn on/off temperatures
    //     const turnOffTemp = setpoint; //  # + 0.1
    //     const temp = TemperatureItem.rawState; //  # get the current temperature
    //     if (temp >= turnOffTemp  && HeaterItem.state.toString()=='ON') {
    //       logger.info(`Heating change... Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()} -> SendCommand to: ${roomPrefix}, Heater OFF`);
    //       HeaterItem.sendCommand('OFF');
    //     } else if (temp < turnOnTemp && HeaterItem.state.toString()=='OFF') {
    //       logger.info(`Heating change... Heater: ${roomPrefix}, mode is: ${heatingModeItem.state.toString()} -> SendCommand to: ${roomPrefix}, Heater ON`);
    //       HeaterItem.sendCommand('ON');
    //     }
    //   } else if ((heatingModeItem.state.toString() === 'off') || (items.getItem('masterHeatingMode').state.toString() === 'off')) {
    //     if ((items.getItem('masterHeatingMode').state.toString() === 'off')) {
    //       logger.info('Heating change... Master Heating Mode is OFF!');
    //     }
    //     logger.info(`Heating change...Turn ${roomPrefix} heater OFF, :. its Heating Mode is  ${heatingModeItem.state}`);
    //     HeaterItem.sendCommand('OFF');
    //   }
    },
  });
  