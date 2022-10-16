const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('request-send-setpoints');
const { timeUtils } = require('openhab_rules_tools');
const { toToday } = require('openhab_rules_tools/timeUtils');

const offTemp = 14;

// #!cron job has requested we send updates to setpoints

rules.JSRule({
  name: 'Request to update room heater setpoints from new(possibly) target temperatures-e.g. from CRON job',
  description: 'Request to update room heater setpoints from new(possibly) target temperatures-e.g. from CRON job',
  triggers: [
    triggers.ItemCommandTrigger('Heating_UpdateHeaters', 'ON'),
  ],
  execute: (event) => {
    logger.error('Request to update room heater setpoints from new(possibly) target temperatures-e.g. from CRON job');
    // myutils.showEvent(event);

    items.getItem('Heating_UpdateHeaters').sendCommand('OFF');// reset update heaters flag ready for next trigger (OFF-ON)
    const masterHeatingModeItemState = items.getItem('masterHeatingMode').state.toString();
    logger.error(`CURRENT MASTER Heating Mode: ${masterHeatingModeItemState}`);

    //     # ! Whats the current MASTER heating mode?
    // if 'off' then shutdown everything,setpoints and room heating modes to 'off'
    switch (masterHeatingModeItemState) {
      case 'off':
        // turn 'off' all individual room heating modes
        items.getItem('gHeatingModes').members.forEach((roomHeatingMode) => {
          roomHeatingMode.postUpdate('off');
          logger.error(`set room heating mode to off: ${roomHeatingMode.name}`);
        });
        // also set all room heater setpoint to a low temperature
        items.getItem('gTemperatureSetpoints').members.forEach((roomTemperatureSetpoint) => {
          roomTemperatureSetpoint.postUpdate(offTemp);
          logger.error(`set room temp setpoint to ${offTemp}, :${roomTemperatureSetpoint.name}`);
        });
        break;
      case 'manual':
        // let each heater do its own thing re mode and temp etc
        break;
      case 'auto':
        // check each heater heating mode
        items.getItem('gHeatingModes').members.forEach((heatingModeItem) => {
          // if any room mode is set to auto then set heater setpoint to the temp defined in the Heating_PresetTempNormal
          if (heatingModeItem.state.toString() === 'auto') {
            const heaterPrefix = `${heatingModeItem.name.toString().substr(0, heatingModeItem.name.indexOf('_'))}`;// get first index of '_'
            logger.error(`heaterPrefix: ${heaterPrefix}`);
            const roomHeaterSetpointItem = items.getItem(`${heaterPrefix}_TemperatureSetpoint`); //
            logger.error(`roomHeaterSetpointItem state: ${roomHeaterSetpointItem.state}`);
            const setpointPresetToApply = items.getItem(`${heaterPrefix}_Heating_PresetTempNormal`).state;
            logger.error(`setpointPresetToApply: ${setpointPresetToApply}`);

            // skip if impl;emented in new timeline method
            if ((heaterPrefix === 'CT') || (heaterPrefix === 'AT')) {
              logger.error(`....>>== EXCLUDE: Heating_UpdateHeaters, NOT updating destination setpoint temperature preset by OLD Heating_UpdateHeaters method, handled by new timelines. NAME: ${roomHeaterSetpointItem.name}, STATE: : ${roomHeaterSetpointItem.state} `);
            } else {
              roomHeaterSetpointItem.postUpdate(setpointPresetToApply);
            }

            logger.error(`roomHeaterSetpointItem state NOW: ${roomHeaterSetpointItem.state}`);
          } else {
            // todo: if room off leave room alone   // if room manual - leave it alone
          }
        });
        break;
      default:
        logger.error(`Unkown master heating mode: ${masterHeatingModeItemState}`);
    }
  },
});
