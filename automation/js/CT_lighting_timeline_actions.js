const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('master-mode-changed');
const { timeUtils } = require('openhab_rules_tools');
const { toToday } = require('openhab_rules_tools/timeUtils');
const { alerting } = require('personal');

rules.JSRule({
  name: 'handle vAT_HeatingMode update from timeline or script source',
  description: 'handle vAT_HeatingMode update from timeline or script source',
  triggers: [triggers.ItemStateUpdateTrigger('v_CT_MorningLighting_update_by_timeline')],
  execute: () => {
    // logger.warn('__');
    logger.warn(`v_CT_MorningLighting_update_by_timeline: ${items.getItem('v_CT_MorningLighting_update_by_timeline').state}`);
    if (items.getItem('CT_LightDark_State').state === 'OFF') {
      items.getItem('gConservatoryLights').sendCommand('ON');
      alerting.sendInfo('CRON auto turn On conservatory lights MORNING if OFF');
    }
  },
});

// rules.JSRule({
//   name: 'handle trigger from timeline AT Setpoit_auto updates',
//   description: 'handle trigger from timeline AT Setpoit_auto updates',
//   triggers: [
//     triggers.ItemStateUpdateTrigger('v_AT_SetPoint_auto'),
//   ],
//   execute: (event) => {
//     logger.error('handle trigger from timeline AT Setpoit_auto updates');
//     // myutils.showEvent(event);
//     // const masterHeatingModeItemState = items.getItem('masterHeatingMode').state.toString();
//     const CT_Setpoint_auto = items.getItem('v_AT_SetPoint_auto').state.toString();

//     // const setPoints = getCurrentSetpoints();

//     switch (CT_Setpoint_auto) {
//       case 'off':
//         // turn 'off' all individual room heating modes
//         logger.error(`,,,,,,,,,,,,,,,,,,,,,,,CT Setpoint auto : ${CT_Setpoint_auto}`);
//         // items.getItem('gHeatingModes').sendCommand('off');
//         // todo do not override mode if manual
//         break;
//       case 'manual':
//         logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!make all rooms - manual - MASTER Heating Mode :');
//         // items.getItem('gHeatingModes').sendCommand('manual');
//         // todo do not override mode if manual
//         break;
//       case 'auto':
//         // check each heater heating mode
//         logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!make all rooms - AUTO - MASTER Heating Mode :');
//         // items.getItem('gHeatingModes').sendCommand('auto');
//         // todo do not override mode if manual
//         break;
//       default:
//         logger.error(`^^^^>>>><<<<<^^^^ CT Setpoint auto : ${CT_Setpoint_auto}`);
//     }
//     // events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc
//     // items.getItem('Heating_UpdateHeaters').sendCommand('ON');
//   },
// });
