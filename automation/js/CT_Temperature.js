const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('smooth-ct-temp');
// const { timeUtils } = require('openhab_rules_tools');
// const { toToday } = require('openhab_rules_tools/timeUtils');

scriptLoaded = function () {
  // const { items } = require('@runtime');#
  // console.log(items);
  logger.warn('scriptLoaded - init CT temp filter');
  // myutils.showGroupMembers('gBG_sockets_reachable');

  items.getItem('CT_Temperature_monitor').sendCommand(0);
  const oldTemp = items.getItem('CT_Temperature_monitor').rawState;
  logger.error(`1 ===================>STARTUP oldtemp is: ${oldTemp}`);
};

rules.JSRule({
  name: 'smooth out CT temperature readings',
  description: 'smooth out CT temperature readings',
  triggers: [triggers.ItemStateUpdateTrigger('CT_Temperature_raw')],
  execute: () => {
    // logger.warn('__');
    // get previous reading
    let oldTemp = items.getItem('CT_Temperature_monitor').rawState;
    logger.error(`1 ===================>oldtemp is: ${oldTemp}`);
    const rawTemp = items.getItem('CT_Temperature_raw').rawState;
    if (oldTemp === 'NULL' || oldTemp < 5) {
      oldTemp = rawTemp;
      logger.error(`2 ===================>reset oldtemp is: ${oldTemp}`);
    }
    logger.error(`3 ===================>OLDCT_Temperature : ${oldTemp}`);
    logger.error(`4 ===================>CT_Temperature_raw: ${rawTemp}`);
    // items.getItem('CT_Temperature_monitor').sendCommand(rawTemp);
    let newTemp;
    const diff = oldTemp - rawTemp;

    let tempdiff = diff / 2;
    logger.error(`5 ===================> temp diff: ${tempdiff}`);

    if (diff > 0) { // newTemp is less than oldTemp, eg, old = 21, raw=22, old-raw = (+)1
      // so we neeed to add 1/2 diff to temp monitor
      tempdiff = diff / 2;
      newTemp = oldTemp - tempdiff;
      newTemp = newTemp.toFixed(2);
      logger.error(`6 ===================> newTemp: ${newTemp}`);
      items.getItem('CT_Temperature_monitor').sendCommand(newTemp);
      logger.error(`7 DDDDD ===================>CT_Temperature_monitor: ${items.getItem('CT_Temperature_monitor').state}`);
    } else if (diff <= 0) { // new temp is more than oldTemp
      // so sub 1/2 diff from  temp monitor
      tempdiff = diff / 2;
      newTemp = oldTemp - tempdiff;
      newTemp = newTemp.toFixed(2);

      logger.error(`8 ===================> newTemp: ${newTemp}`);
      items.getItem('CT_Temperature_monitor').sendCommand(newTemp);
      logger.error(`9 UUUUU ===================>CT_Temperature_monitor: ${items.getItem('CT_Temperature_monitor').state}`);
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
//         logger.error(`,,,,,,,,,,,,,,,,,,,,,,, CT Setpoint auto : ${ CT_Setpoint_auto }`);
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
//         logger.error(`^^^^>>>><<<<<^^^^ CT Setpoint auto : ${ CT_Setpoint_auto }`);
//     }
//     // events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc
//     // items.getItem('Heating_UpdateHeaters').sendCommand('ON');
//   },
// });
