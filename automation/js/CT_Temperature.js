const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('smooth-ct-temp');


scriptLoaded = function () {
  logger.warn('scriptLoaded - init CT temp filter');
  // const temp = items.getItem('CT_ThermostatTemperatureAmbient').state;
  // const temp = items.getItem('CT_ThermostatTemperatureAmbient').state;
  items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(19);
  items.getItem('CT_ThermostatTemperatureAmbient_raw').sendCommand(19);

  // logger.warn(`0 ==> STARTUP temp is: ${temp}`);
};

const divisor = 8;

rules.JSRule({
  name: 'smooth out CT temperature readings',
  description: 'smooth out CT temperature readings',
  triggers: [triggers.ItemStateUpdateTrigger('CT_Temperature_raw')],
  execute: () => {
    let prevTemp = items.getItem('CT_ThermostatTemperatureAmbient').rawState;
    // logger.error(`1 ==> previous temp is: ${prevTemp}`);

    const rawTemp = items.getItem('CT_ThermostatTemperatureAmbient_raw').rawState;
    // logger.error(`2 ==> new raw temp is: ${rawTemp}`);

    if (prevTemp === 'NULL' || prevTemp < 5) {
      prevTemp = rawTemp;
      // logger.error(`3 ==> setup initial value of prevTemp: ${prevTemp}`);
    }
    // logger.error(`4 ==> prev temp : ${prevTemp}`);
    // logger.error(`5 ==> raw temp : ${rawTemp}`);

    const diff = prevTemp - rawTemp;
    // logger.error(`6 ==> temp diff : ${diff}`);
    // logger.error(`6-7 ==> divisor : ${divisor}`);

    const tempdiff = diff / divisor;
    // logger.error(`5 ==> temp diff/divisor : ${tempdiff}`);

    let newTemp = prevTemp - tempdiff;
    // logger.error(`5 ==> new temp : ${newTemp}`);

    newTemp = (Math.round((newTemp.toFixed(2)) * 10) / 10);
    // logger.error(`6 ==> new temp after rounding: ${newTemp}`);

    items.getItem('CT_ThermostatTemperatureAmbient').sendCommand(newTemp);
    items.getItem('FH_ThermostatTemperatureAmbient').sendCommand(newTemp);

    // logger.error(`7 ==> CT_Temperature(newTemp): ${items.getItem('CT_Temperature').state}`);

    // logger.warn(`CT_TEMP_CaLC, previous temp is: ${prevTemp}, new raw temp is: ${rawTemp}, CT_ThermostatTemperatureAmbient(newTemp): ${items.getItem('CT_ThermostatTemperatureAmbient').state}`);
  },
});
