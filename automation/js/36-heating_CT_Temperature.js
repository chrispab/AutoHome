const {
  log, items, rules, actions, triggers,
} = require('openhab');

var ruleUID = "ct-smooth-temperature";
const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.ct-smooth-temperature
// log:set INFO org.openhab.automation.openhab-js.ct-smooth-temperature

scriptLoaded = function () {
  logger.debug('scriptLoaded - init CT temp filter');
};

const divisor = 4;
const scaleThreshold = 0.2
rules.JSRule({
  name: 'smooth out CT temperature readings',
  description: 'smooth out CT temperature readings',
  triggers: [triggers.ItemStateUpdateTrigger('CT_ThermostatTemperatureAmbient_raw')],
  execute: () => {
    let prevTemp = items.getItem('CT_ThermostatTemperatureAmbient').rawState;
    logger.debug(`1 ==> previous temp is: ${prevTemp}`);

    const rawTemp = items.getItem('CT_ThermostatTemperatureAmbient_raw').rawState;
    logger.debug(`2 ==> new raw temp is: ${rawTemp}`);

    if (prevTemp === 'NULL' || prevTemp < 5) {
      prevTemp = rawTemp;
      logger.debug(`3 ==> setup initial value of prevTemp from rawtemp: ${prevTemp}`);
    }
    logger.debug(`4 ==> prev temp : ${prevTemp}`);
    logger.debug(`5 ==> raw temp : ${rawTemp}`);

    const diff = prevTemp - rawTemp;
    logger.debug(`6 ==> temp diff : ${diff}`);
    logger.debug(`6-7 ==> divisor : ${divisor}`);

    if (Math.abs(diff) > scaleThreshold) {


      const tempdiff = diff / divisor;
      logger.debug(`5 ==> temp diff/divisor : ${tempdiff}`);

      let newTemp = prevTemp - tempdiff;
      logger.debug(`5 ==> new temp : ${newTemp}`);

      newTemp = (Math.round((newTemp.toFixed(2)) * 10) / 10);
      logger.debug(`6 ==> new temp after rounding: ${newTemp}`);

      items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(newTemp);
      items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(newTemp);

      logger.debug(`7 ==> CT_Temperature(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);

      logger.debug(`CT_TEMP_CaLC, previous temp is: ${prevTemp}, new raw temp is: ${rawTemp}, CT_ThermostatTemperatureAmbient(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);
    }else{
      // do simple sub/add
      let newTemp = prevTemp - diff;
      logger.debug(`5bb ==> new tempprevTemp - diff : ${newTemp}`);
      items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(newTemp);
      items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(newTemp);

      logger.debug(`7bb ==> CT_Temperature(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);

      logger.debug(`bb CT_TEMP_CaLC, previous temp is: ${prevTemp}, new raw temp is: ${rawTemp}, CT_ThermostatTemperatureAmbient(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);

    }
  },
});



// rules.JSRule({
//   name: 'smooth out CT temperature readings',
//   description: 'smooth out CT temperature readings',
//   triggers: [triggers.ItemStateUpdateTrigger('CT_ThermostatTemperatureAmbient_raw')],
//   execute: () => {
//     let prevTemp = items.getItem('CT_ThermostatTemperatureAmbient').rawState;
//     logger.debug(`1 ==> previous temp is: ${prevTemp}`);

//     const rawTemp = items.getItem('CT_ThermostatTemperatureAmbient_raw').rawState;
//     logger.debug(`2 ==> new raw temp is: ${rawTemp}`);

//     if (prevTemp === 'NULL' || prevTemp < 5) {
//       prevTemp = rawTemp;
//       logger.debug(`3 ==> setup initial value of prevTemp from rawtemp: ${prevTemp}`);
//     }
//     logger.debug(`4 ==> prev temp : ${prevTemp}`);
//     logger.debug(`5 ==> raw temp : ${rawTemp}`);

//     const diff = prevTemp - rawTemp;
//     logger.debug(`6 ==> temp diff : ${diff}`);
//     logger.debug(`6-7 ==> divisor : ${divisor}`);

//     const tempdiff = diff / divisor;
//     logger.debug(`5 ==> temp diff/divisor : ${tempdiff}`);

//     let newTemp = prevTemp - tempdiff;
//     logger.debug(`5 ==> new temp : ${newTemp}`);

//     newTemp = (Math.round((newTemp.toFixed(2)) * 10) / 10);
//     logger.debug(`6 ==> new temp after rounding: ${newTemp}`);

//     items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(newTemp);
//     items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(newTemp);

//     logger.debug(`7 ==> CT_Temperature(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);

//     logger.debug(`CT_TEMP_CaLC, previous temp is: ${prevTemp}, new raw temp is: ${rawTemp}, CT_ThermostatTemperatureAmbient(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);
//   },
// });