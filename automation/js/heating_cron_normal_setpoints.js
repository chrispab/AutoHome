// from core.rules import rule
// from core.triggers import when
// from core.actions import LogAction
const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('cron setpoints.js');
const { timeUtils } = require('openhab_rules_tools');

// !this file must be reloaded if any presets are changed to register the new cron times

// def morning_heating():
//     for item in ir.getItem("gHeating_PresetTempNormal").members:
//         item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Morning").state # prefix =  # get prefix eg FR, CT etc
//         LogAction.logWarn("CRON set setpoints", "===> _HPSP_Morning setpoint Item : {}, is now: {}", item.name, item.state)
//     events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc
function morning_heating() {
  items.getItem('gHeating_PresetTempNormal').members.forEach((item) => {
    // item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Morning").state //# prefix =  # get prefix eg FR, CT etc
    item.state = `${item.name.toString().substr(0, item.name.lastIndexOf('_'))}_HPSP_Morning`;
    logger.warn(`===> _HPSP_Morning setpoint Item : ${item.name}, is now: : ${item.state} `);
  });
  items.getItem('Heating_UpdateHeaters').postUpdate('ON');
}
// @rule("heating cron weekday morning 1", description="heating cron weekday morning 1", tags=["heating", "cron"])# description and tags are optional
// @when(ir.getItem("CRON_HPSP_Time_1").getState().toString())
// def heating_cron_morning_1(event):
rules.JSRule({
  name: 'CRON heating cron 1',
  description: 'CRON heating cron 1',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_1').state.toString())],
  execute: (data) => {
    //     temp = ir.getItem("Outside_Temperature").getState().floatValue()
    //     LogAction.logWarn("PRE  check if cold enough to start heating", "PRE outside  temp = {}", temp)
    //     if (temp < 10.0):
    //         morning_heating()
    const temp = items.getItem('Outside_Temperature').state().floatValue();
    logger.warn(`PRE  check if cold enough to start heating: ${temp} `);
    if (temp < 10.0) {
      morning_heating();
    }
  },
});

// @rule("heating cron weekday morning 2", description="heating cron weekday morning 2", tags=["heating", "cron"])# description and tags are optional
// @when(ir.getItem("CRON_HPSP_Time_2").getState().toString())
// def heating_cron_morning_2(event):
//     temp = ir.getItem("Outside_Temperature").getState().floatValue()
//     LogAction.logWarn("PRE check if cold enough to start heating", "PRE outside  temp = {}", temp)
//     if (temp < 12.0):
//         morning_heating()
rules.JSRule({
  name: 'CRON heating cron 2',
  description: 'CRON heating cron 2',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_2').state.toString())],
  execute: (data) => {
    const temp = items.getItem('Outside_Temperature').getState().floatValue();
    logger.warn(`PRE  check if cold enough to start heating: ${temp} `);
    if (temp < 13.0) {
      morning_heating();
    }
  },
});
// @rule("heating cron weekday morning", description="heating cron weekday morning", tags=["heating", "cron"])# description and tags are optional
// @when(ir.getItem("CRON_HPSP_Time_3").getState().toString())
// def heating_cron_morning(event):
//     morning_heating()
rules.JSRule({
  name: 'CRON heating cron 3',
  description: 'CRON heating cron 3',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_3').state.toString())],
  execute: (data) => {
    logger.warn('start heating CRON_HPSP_Time_3: ');
    morning_heating();
  },
});

// @rule("heating 9 am", description="heating 8.30 am", tags=["heating", "cron"])# description and tags are optional
// @when(ir.getItem("CRON_HPSP_Time_4").getState().toString())
// def heating_cron8(event):
//     for item in ir.getItem("gHeating_PresetTempNormal").members:
//         item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Day").state # prefix =  # get prefix eg FR, CT etc
//         LogAction.logWarn("CRON set setpoints", "===> _HPSP_Day setpoint Item : {}, is now: {}", item.name, item.state)
//     events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc
rules.JSRule({
  name: 'CRON heating cron 4',
  description: 'CRON heating cron 4',
  // triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_3').state.toString())],
  triggers: [triggers.GenericCronTrigger('0/30 * * * * *')],
  execute: (data) => {
    // logger.warn('start heating CRON_HPSP_Time_4');
    logger.warn('-----------------CRON TEST EVERY MINUTE--------------------');
    updateRoomSetPoints('gHeating_PresetTempNormal', 'Morning');
    // updateRoomSetPoints('gHeating_PresetTempNormal', 'WE_Morning');
    // updateRoomSetPoints('gHeating_PresetTempNormal', 'Night');
  },
});

// HeatingPresetTempsGroup = e.g.'gHeating_PresetTempNormal',e.g:
// Item BR_Heating_PresetTempNormal | 17.5
// Item CT_Heating_PresetTempNormal | 21
// Item FR_Heating_PresetTempNormal | 21
// Item ER_Heating_PresetTempNormal | 19
// Item HL_Heating_PresetTempNormal | 18
// Item OF_Heating_PresetTempNormal | 17.5
// Item AT_Heating_PresetTempNormal | 13
// roomPresetTimeOfDaySuffix , e.g. 'Morning', 'Evening', 'Day','Night', 'WE_Morning','WE_Evening'
function updateRoomSetPoints(gHeatingPresetTemps, presetTimeOfDaySuffix) {
  const presetIDString = 'HPSP';
  logger.warn(`>> HeatingPresetTempsGroup passed in: ${gHeatingPresetTemps} `);
  myutils.showGroupMembers(gHeatingPresetTemps);
  // get each room heating preset temp e.g. state/value of 'CT_HPSP_Morning' from th the settings webpage
  // and assign to the respective  preset(within the gHeating_PresetTempNormal group - passed in as gHeatingPresetTemps),
  // e.g. CT_Heating_PresetTempNormal = state/value of 'CT_HPSP_Morning'
  items.getItem(gHeatingPresetTemps).members.forEach((destinationItem) => {
    // get the string parts we need to build the webpage var to get temp from
    // e.g. <roomPrefix>_HPSP_<presetTimeOfDySuffix>, e.g. 'CT_HPSP_Morning'

    // e.g item = CT_Heating_PresetTempNormal
    // e.g item.state = CT_Heating_PresetTempNormal.state == 21.0
    // e.g roomPrefix == 'CT'
    const roomPrefix = `${destinationItem.name.toString().substr(0, destinationItem.name.indexOf('_'))}`;// get first index of '_'
    logger.warn(`>>> roomPrefix : ${roomPrefix} `);
    logger.warn(`>>> presetTimeOfDaySuffix : ${presetTimeOfDaySuffix} `);
    logger.warn(`>> destination preset item name  : ${destinationItem.name} `);
    // presetTimeOfDaySuffix , e.g. 'Morning', 'Evening', 'Day','Night', 'WE_Morning','WE_Evening'
    destinationItem.state = `${roomPrefix}_HPSP_${presetTimeOfDaySuffix}`;
    logger.warn(`>> destination setpoint Item : ${destinationItem.name}, is now: : ${destinationItem.state} `);

    // build the string representing the source item name - (from the web page)
    // so we can get its state/value and  pass to the respective preset
    const sourceRoomTempItemName = `${roomPrefix}_${presetIDString}_${presetTimeOfDaySuffix}`;
    logger.warn(`>> source web page temp preset item name  : ${sourceRoomTempItemName} `);
    const sourceItem = items.getItem(sourceRoomTempItemName);
    // sourceItem.state = `${roomPrefix}_HPSP_${presetTimeOfDaySuffix}`;
    logger.warn(`>> sourceItem setpoint ITEM_NAME: ${sourceItem.name}, STATE: : ${sourceItem.state} `);
    logger.warn(`>>== asssigningg sourceItem setpoint: ${sourceItem.name}, STATE: : ${sourceItem.state} `);
    logger.warn(`>>== to destination preset: ${destinationItem.name}, STATE: : ${destinationItem.state} `);
    // destinationItem.state = sourceItem.state;
    destinationItem.postUpdate(sourceItem.state);

    logger.warn(`>>== destination preset now is: ${destinationItem.name}, STATE: : ${destinationItem.state} `);

    logger.warn(`>> HeatingPresetTempsGroup now contains: ${gHeatingPresetTemps} `);
    myutils.showGroupMembers(gHeatingPresetTemps);

    logger.warn('\n');
  });
  // now send those presets defined by params passed in above to the actual room heaters (note only get updated if master mode is 'auto'
  // actually processed in file 'heating_send_presets)
  items.getItem('Heating_UpdateHeaters').postUpdate('ON');
}
// @rule("heating cron weekday evening", description="heating cron weekday evening", tags=["heating", "cron"])# description and tags are optional
// @when(ir.getItem("CRON_HPSP_Time_5").getState().toString())
// def heating_cron9(event):
//     for item in ir.getItem("gHeating_PresetTempNormal").members:
//         item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Evening").state # prefix =  # get prefix eg FR, CT etc
//         LogAction.logWarn("CRON set setpoints", "===> _HPSP_Evening setpoint Item : {}, is now: {}", item.name, item.state)
//     events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc

// # ! WEEKENDS
// @rule("7 am weekend", description="7:00 am weekend", tags=["heating", "cron"])# description and tags are optional
// @when(ir.getItem("CRON_HPSP_Time_6").getState().toString())
// def heating_cron11(event):
//     for item in ir.getItem("gHeating_PresetTempNormal").members:
//         item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_WE_Morning").state # prefix =  # get prefix eg FR, CT etc
//         LogAction.logWarn("CRON set setpoints", "===> _HPSP_WE_Morning setpoint Item : {}, is now: {}", item.name, item.state)
//     events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc

// @rule("4:30pm weekend", description="4:30pm weekend", tags=["heating", "cron"])# description and tags are optional
// @when(ir.getItem("CRON_HPSP_Time_7").getState().toString())
// def heating_cron12(event):
//     for item in ir.getItem("gHeating_PresetTempNormal").members:
//         item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_WE_Evening").state # prefix =  # get prefix eg FR, CT etc
//         LogAction.logWarn("CRON set setpoints", "===> _HPSP_WE_Evening setpoint Item : {}, is now: {}", item.name, item.state)
//     events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc

// # ! EVERY DAY
// @rule("12pm alldays", description="12pm alldays", tags=["heating", "cron"])# description and tags are optional
// @when(ir.getItem("CRON_HPSP_Time_8").getState().toString())
// def heating_cron9(event):
//     night_heating()

// def night_heating():
//     for item in ir.getItem("gHeating_PresetTempNormal").members:
//         item.state = ir.getItem( item.name[:item.name.find('_')] + "_HPSP_Night").state # prefix =  # get prefix eg FR, CT etc
//         LogAction.logWarn("CRON set setpoints", "===> _HPSP_Night setpoint Item : {}, is now: {}", item.name, item.state)
//     events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc

// # con tue,wed,thur morn early
// @rule("conservatory early tue,wed,thurs", description="conservatory early tue,wed,thurs", tags=["heating", "cron"])# description and tags are optional
// @when(ir.getItem("CRON_HPSP_Time_9").getState().toString())
// def heating_cron9(event):
//     # start just the conservatory early - see how to do just tue,wed,thurs
//     item = ir.getItem("CT_Heating_PresetTempNormal")
//     item.state = ir.getItem( "CT_HPSP_Morning").state # prefix =  # get prefix eg FR, CT etc
//     LogAction.logWarn("CRON conservatoryearly start", "===> _HPSP_Morning setpoint Item : {}, is now: {}", item.name, item.state)
//     events.sendCommand("Heating_UpdateHeaters", "ON") #trigger updating of heaters and boiler etc
