const { utils } = require('personal');
// var  utils  = require('./utils.js');
// const { showItem } = require('./utils.js');
const logger = log('fan_heater.js');
rules.JSRule({
  name: 'fan heater check',
  description: 'If fan heater check demand turn on fan heater check',
  triggers: [
    // triggers.GroupStateUpdateTrigger('gRoomHeaterStates', 'OFF', 'ON'),
    triggers.ItemStateChangeTrigger('fan_heater_temperature_sensor'),
    triggers.ItemStateChangeTrigger('CT_Temperature'),
    triggers.ItemStateChangeTrigger('fan_heater_ON_Setpoint'),
    triggers.ItemStateChangeTrigger('fan_heater_enable'),

  ],
  execute: (data) => {
    logger.warn('________If fan heater check demand turn on fan heater check');
    console.error('________If fan heater check demand turn on fan heater check');

    console.error(
      `FAN HEATER temp data info: ${items.getItem('fan_heater_temperature_sensor').label
      }, state: ${items.getItem('fan_heater_temperature_sensor').state
      }, PREV state: ${items.getItem('fan_heater_temperature_sensor').history.previousState()}`,
    );
    utils.showItem(data);
    // showItem(data);

    const setPoint = items.getItem('fan_heater_ON_Setpoint').state;
    const temp = items.getItem('CT_Temperature').state;
    if ((items.getItem('CT_Heater') != 'ON') && (items.getItem('fan_heater_enable').state == 'ON')) {
      if (temp < setPoint) {
        items.getItem('fan_heater').sendCommand('ON');
        console.error('>>>>- fan_heater_ON_Setpoint turning heater ON');
      }
      if (temp >= (setPoint + 0.1)) {
        items.getItem('fan_heater').sendCommand('OFF');
        console.error('>>>>- fan_heater_ON_Setpoint turning heater OFF');
      }
    }
  },
});
