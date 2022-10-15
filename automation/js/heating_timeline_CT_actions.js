const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('master-mode-changed');
const { timeUtils } = require('openhab_rules_tools');
const { toToday } = require('openhab_rules_tools/timeUtils');

/**
 * Get setpoint for a location based roomPrefix
 * and temperature setpoint tag
 * returned value = value of the relevant setpoint item
 *
 * the room setpoint item name format is:
 * <roomPrefix>_Setpoint_auto_<SetpointTag>
 * <roomPrefix> is one of :
 * CT, BR, FR, AT, OF, HL, ER, DR, KT
 * <SetpointTag> is one of:
 * min, morning, day, evening, night, max
 * e.g :
 * CT_Setpoint_auto_evening
 * BR_Setpoint_auto_night
 *
 * @param {string} roomPrefix  CT, BR, FR, AT, OF, HL, ER, DR, KT
 * @param {string} setpointTag min, morning, day, evening, night, max
 * @return {number} temperature setpoint
 */
function getSetpointAutoTempForRoom(roomPrefix, setpointTag) {
  // build the setpoint item name
  const setPointItemName = `${roomPrefix}_Setpoint_auto_${setpointTag}`;
  logger.warn(`---->>>> setPointItemName found : ${setPointItemName}`);

  return items.getItem(setPointItemName).state;
}

//= ===========setpoints
//= ===============================================================

/**
 * When a setpoint is updated by a timeline automatic update
 *
 * incoming triggers of the form:
 * v_<roomPrefix>_SetPoint_auto, triggered by a timeline change update
 * - part of group - gHeatingTimelineSetpointUpdateProxys
 */
rules.JSRule({
  name: 'handle - auto program setpoint is updated by a timeline',
  description: 'handle - auto program setpoint is updated by a timeline',
  triggers: [triggers.GroupStateUpdateTrigger('gHeatingTimelineSetpointUpdateProxys')],
  execute: (event) => {
    logger.error('--->>> handle - auto program setpoint is updated by a timeline');
    myutils.showEvent(event);

    const { itemName } = event;

    logger.warn(`--->>> gHeatingTimelineSetpointUpdateProxys triggering item : ${itemName}`);
    logger.warn(`--->>> itemName.state : ${items.getItem(itemName).state}`);

    // incoming event in format "itemName": "v_CT_SetPoint_auto_update_by_timeline",
    // now get the actual temp setpoint from the corresponding setpoit item
    // e.g
    // convert label from setpoit timeline to a temperature vales e.g. 'min' to 17.0
    // roomPrefix is first 2 chars of triggering item name
    const roomPrefixPartial = event.itemName.toString().substr(event.itemName.indexOf('_') + 1);
    const roomPrefix = roomPrefixPartial.substr(0, event.itemName.indexOf('_') + 1);
    logger.warn(`--->>> roomPrefix : ${roomPrefix}`);

    // setpointTempTag is one of min, morning, day, evening, night, max
    // - "receivedState": "evening",
    const setpointTemperatureTag = event.receivedState.toString();
    logger.warn(`--->>> setpointTemperatureTag : ${setpointTemperatureTag}`);

    // e.g 'CT' , 'evening'
    const setPointTemperature = getSetpointAutoTempForRoom(roomPrefix, setpointTemperatureTag);
    logger.warn(`--->>> setPointTemperature found : ${setPointTemperature}`);

    // finally send the new setpoit temperature to the relevant real setpoint item
    // setpoint item name of form '<roomPrefix>_TemperatureSetpoint'
    const setPointItemName = `${roomPrefix}_TemperatureSetpoint`;
    items.getItem(setPointItemName).sendCommand(setPointTemperature);
  },
});
/**
 * When a setpoint is updated, either by clicking on interface sepoint buttons ,
 * or when updated by a timeline automatic update
 *
 * incoming triggers from
 * v_<roomPrefix>_SetPoint_auto, triggered by a timeline chang update
 *  - part of group - gHeating
 * or
 * <roomPrefix>_Setpoint_auto_<setpointTag>
 */
rules.JSRule({
  name: 'handle when a auto program setpoint is updated by a setpoint changed from webui',
  description: 'handle when a auto program setpoint is updated by a setpoint changed from webui',
  triggers: [triggers.GroupStateUpdateTrigger('gHeating_CT_Setpoints_auto')],
  execute: (event) => {
    logger.error('handle when a auto program setpoint is updated by a setpoint changed from webui');
    myutils.showEvent(event);
    // const masterHeatingModeItemState = items.getItem('masterHeatingMode').state.toString();
    const v_CT_Setpoint_auto_text = items.getItem('v_CT_SetPoint_auto').state.toString();

    const { itemName } = event;

    logger.warn(`__**>> gHeating_CT_Setpoints_auto triggering item : ${itemName}`);
    // logger.warn('__**>> handle when a auto program setpoint is updated from a setpoint changed from webui');
    // logger.warn('__**>> handle v_CT_SetPoint_auto update from timeline or script source');
    logger.warn(`__**>> itemName.state : ${items.getItem(itemName).state}`);
    logger.warn(`__**>> v_CT_Setpoint_auto_text : ${v_CT_Setpoint_auto_text}`);

    // items.getItem('CT_Setpoint').sendCommand(items.getItem(CT_Setpoint_auto).state);

    // incoming event in format  "itemName": "CT_Setpoint_auto_morning"
    // now get the actual temp setpoint from the corresponding setpoit item
    // e.g
    // convert label from setpoit timeline to a temperature vales e.g. 'min' to 17.0
    const setPointTemperature = getSetpointAutoTempForRoom('CT', 'evening');
  },
});

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
