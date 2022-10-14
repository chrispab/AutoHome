const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('master-mode-changed');
const { timeUtils } = require('openhab_rules_tools');
const { toToday } = require('openhab_rules_tools/timeUtils');

// get current setpoint and based on label e.g label = 'min,
// returned value = value of the relevant setpoit item
function getCurrentSetpointFromLabel(SetpointLabel) {
  // e.g. min,morning,day, evening, night, max
  items.getItem('CT_HeatingMode').sendCommand(items.getItem('vCT_HeatingMode').state);
}

//= ============== heating mode
rules.JSRule({
  name: 'handle vCT_HeatingMode update from timeline or script source',
  description: 'handle vCT_HeatingMode update from timeline or script source',
  triggers: [triggers.ItemStateUpdateTrigger('vCT_HeatingMode')],
  execute: () => {
    logger.warn('__> handle vCT_HeatingMode update from timeline or script source');
    logger.warn(`__> vCT_HeatingMode: ${items.getItem('vCT_HeatingMode').state}`);

    // send mode sent to actual CT_HeatingMode
    items.getItem('CT_HeatingMode').sendCommand(items.getItem('vCT_HeatingMode').state);
  },
});

//= ===========setpoints
rules.JSRule({
  name: 'handle trigger from timeline  Setpoint_auto temp label updates',
  description: 'handle trigger from timeline CT Setpoint_auto temp label updates',
  triggers: [triggers.GroupStateUpdateTrigger('gHeating_CT_Setpoints_auto')],
  execute: (event) => {
    logger.error('handle trigger from timeline gHeating_CT_Setpoints_auto temp label updates');
    myutils.showEvent(event);
    // const masterHeatingModeItemState = items.getItem('masterHeatingMode').state.toString();
    const v_CT_Setpoint_auto_text = items.getItem('v_CT_SetPoint_auto').state.toString();

    const { itemName } = event;
    logger.warn(`__**>> gHeating_CT_Setpoints_auto triggering item : ${itemName}`);
    logger.warn('__**>> handle gHeating_CT_Setpoints_auto update from timeline or script source');
    // logger.warn('__**>> handle v_CT_SetPoint_auto update from timeline or script source');
    logger.warn(`__**>> itemName.state : ${items.getItem(itemName).state}`);
    logger.warn(`__**>> v_CT_Setpoint_auto_text : ${v_CT_Setpoint_auto_text}`);

    // items.getItem('CT_Setpoint').sendCommand(items.getItem(CT_Setpoint_auto).state);

    // convert label from setpoit timeline to a temperature vales e.g. 'min' to 17.0
    // const setPointsLabelMap = getCurrentSetpointFromLabel(v_CT_Setpoint_auto_text);

    // switch (CT_Setpoint_auto) {
    //   case 'off':
    //     // turn 'off' all individual room heating modes
    //     logger.error(`,,,,,,,,,,,,,,,,,,,,,,,CT Setpoint auto : ${CT_Setpoint_auto}`);
    //     // items.getItem('gHeatingModes').sendCommand('off');
    //     // todo do not override mode if manual
    //     break;
    //   case 'manual':
    //     logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!make all rooms - manual - MASTER Heating Mode :');
    //     // items.getItem('gHeatingModes').sendCommand('manual');
    //     // todo do not override mode if manual
    //     break;
    //   case 'auto':
    //     // check each heater heating mode
    //     logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!make all rooms - AUTO - MASTER Heating Mode :');
    //     // items.getItem('gHeatingModes').sendCommand('auto');
    //     // todo do not override mode if manual
    //     break;
    //   default:
    //     logger.error(`^^^^>>>><<<<<^^^^ CT Setpoint auto : ${CT_Setpoint_auto}`);
    // }
    // events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc
    // items.getItem('Heating_UpdateHeaters').sendCommand('ON');
  },
});
