const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('master-mode-changed');
// const { timeUtils } = require('openhab_rules_tools');
// const { toToday } = require('openhab_rules_tools/timeUtils');

/**
 * Get setpoint for a location based roomPrefix
 * and temperature setpoint tag
 * returned value = value of the relevant setpoint item
 *
 * the room setpoint item name format is: <roomPrefix>_Setpoint_auto_<SetpointTag>
 * <roomPrefix> is one of : CT, BR, FR, AT, OF, HL, ER, DR, KT
 * <SetpointTag> is one of: min, morning, day, evening, night, max
 * e.g : CT_Setpoint_auto_evening, BR_Setpoint_auto_night
 *
 * @param {string} roomPrefix  CT, BR, FR, AT, OF, HL, ER, DR, KT
 * @param {string} setpointTag 'min, cool, comfort, warm, hot, max'
 * @return {number} temperature setpoint
 */
function getSetpointAutoTempForRoom(roomPrefix, setpointTag) {
  // build the setpoint item name
  const setPointItemName = `${roomPrefix}_Setpoint_auto_${setpointTag}`;
  logger.warn(`---->>>> setPointItemName found : ${setPointItemName}`);

  return items.getItem(setPointItemName).state;// return setpoint temperature value
}

//= ===========setpoints
//= ===============================================================

/**
 * When a setpoint is updated by a timeline automatic update
 * the corrsponding room thermostat setpoint is updated to that value
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
    // myutils.showEvent(event);

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

    // setpointTempTag is one of
    // other possible tag, 'min, cool, comfort, warm, hot, max'
    // - "event.receivedState": "comfort",
    const setpointTemperatureTag = event.receivedState.toString();
    logger.warn(`--->>> setpointTemperatureTag : ${setpointTemperatureTag}`);

    // e.g given  'CT' , 'evening', returns temp for CT_Setpoint_auto_evening, e.g. 17.4
    const setPointTemperature = getSetpointAutoTempForRoom(roomPrefix, setpointTemperatureTag);
    logger.warn(`--->>> setPointTemperature found : ${setPointTemperature}`);

    // finally send the new setpoit temperature to the relevant real setpoint item
    // setpoint item name of form '<roomPrefix>_TemperatureSetpoint'
    const setPointItemName = `${roomPrefix}_TemperatureSetpoint`;
    items.getItem(setPointItemName).sendCommand(setPointTemperature);
  },
});

//= ============ When a setpoint is updated by clicking on interface setpoint buttons
/**
 * When a setpoint is updated by clicking on interface setpoint buttons ,
 * or when updated by a script
 *
 * incoming triggers from
 * <roomPrefix>_Setpoint_auto_<setpointTag>
 * e.g 'CT_Setpoint_auto_morning', member of gHeating_Setpoint_auto_updates_webui
 */
rules.JSRule({
  name: 'handle when a auto program setpoint is updated by a setpoint changed from webui',
  description: 'handle when a auto program setpoint is updated by a setpoint changed from webui',
  triggers: [triggers.GroupStateUpdateTrigger('gHeating_Setpoint_auto_updates_webui')],
  execute: (event) => {
    logger.error('handle when a auto program setpoint is updated by a setpoint changed from webui');
    myutils.showEvent(event);
    // e.g. "itemName": "CT_Setpoint_auto_min"
    // roomPrefix = 'CT'
    const roomPrefix = event.itemName.toString().substr(0, event.itemName.indexOf('_'));

    // only update the thermostt temperaturte setpoint when one being adjusted on ui (min,cool,comfort ... etc )
    // is same as current active one, v_<roomPrefix>_SetPoint_auto_update_by_timeline
    // E.G. MIN 1,.COOL 2 ETC
    const temperatureSetpointTagOfTrigger = event.itemName.toString().substr(event.itemName.lastIndexOf('_') + 1);// get all after last '_'
    const activeTemperatureSetpointTag = items.getItem(`v_${roomPrefix}_SetPoint_auto_update_by_timeline`).state;

    logger.warn(`__**>> temperatureSetpointTagOfTrigger : ${temperatureSetpointTagOfTrigger}`);
    logger.warn(`__**>> activeTemperatureSetpointTag : ${activeTemperatureSetpointTag}`);

    if (temperatureSetpointTagOfTrigger === activeTemperatureSetpointTag) {
      //
      const setpointToSendToThermostat = event.receivedState;

      // build thermostat item name, e.g. 'CT_Setpoint', from 'CT_Setpoint_auto_comfort'
      const targetSetpointItemName = `${roomPrefix}_TemperatureSetpoint`;
      items.getItem(targetSetpointItemName).sendCommand(setpointToSendToThermostat);
      logger.warn(`__**>> setpointToSendToThermostat : ${setpointToSendToThermostat}`);

      logger.warn(`__**>> targetSetpointItemName : ${targetSetpointItemName}`);
    }
  },
});

//= ============== heating mode
// NEW
// update real thermostst HeatingMode from incoming 'v_XX_HeatingMode
rules.JSRule({
  name: 'handle gHeatingTimelineHeatingModeUpdateProxys update from timeline or script source',
  description: 'handle gHeatingTimelineHeatingModeUpdateProxys update from timeline or script source',
  triggers: [triggers.GroupStateUpdateTrigger('gHeatingTimelineHeatingModeUpdateProxys')],
  execute: (event) => {
    logger.warn('???__>>>>>>>>>>>>>>>>>>>>>>> handle gHeatingTimelineHeatingModeUpdateProxys update from timeline or script source');
    // logger.warn(`???__> vCT_HeatingMode: ${items.getItem('vCT_HeatingMode').state}`);
    myutils.showEvent(event);

    // update real thermostst HeatingMode from incoming 'v_XX_HeatingMode
    // bui;ld the 'real' thermostat heting mode item name
    // get roomprefix
    const roomPrefixPartial = event.itemName.toString().substr(event.itemName.indexOf('_') + 1);
    const roomPrefix = roomPrefixPartial.substr(0, event.itemName.indexOf('_') + 1);
    logger.warn(`???__>>>>>>>>>>>>>>>>>>>>>>>  roomPrefix : ${roomPrefix}`);
    const targetItemName = `${roomPrefix}_HeatingMode`;
    // send mode sent to actual _HeatingMode
    items.getItem(targetItemName).sendCommand(event.receivedState);
  },
});
