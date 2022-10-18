const {
  log, items, rules, actions, triggers,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('cron setpoints.js');
const { timeUtils } = require('openhab_rules_tools');

// !this file must be reloaded if any presets are changed to register the new cron times

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
  logger.warn(`>> CRON--HEATING--CRON JOB: HeatingPresetTempsGroup passed in: ${gHeatingPresetTemps} `);
  myutils.showGroupMembers(gHeatingPresetTemps);
  // get each room heating preset temp e.g. state/value of 'CT_HPSP_Morning' from
  // the settings webpage and assign to the respective
  // preset(within the gHeating_PresetTempNormal group)- passed in as gHeatingPresetTemps),
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
    logger.warn(`>>> destination preset item name  : ${destinationItem.name} `);
    // presetTimeOfDaySuffix , e.g. 'Morning', 'Evening', 'Day','Night', 'WE_Morning','WE_Evening'
    // destinationItem.state = `${roomPrefix}_HPSP_${presetTimeOfDaySuffix}`;// eg CT_HPSP_Morning
    // const sourceNewSetpoint = `${roomPrefix}_HPSP_${presetTimeOfDaySuffix}`;// eg CT_HPSP_Morning

    logger.warn(`>> destination setpoint Item : ${destinationItem.name}, is now: : ${destinationItem.state} `);

    // build the string representing the source item name - (from the web page)
    // so we can get its state/value and  pass to the respective preset
    const sourceRoomTempItemName = `${roomPrefix}_${presetIDString}_${presetTimeOfDaySuffix}`;// eg CT_HPSP_Morning
    logger.warn(`>> source web page temp preset item name  : ${sourceRoomTempItemName} `);
    const sourceItem = items.getItem(sourceRoomTempItemName);
    // sourceItem.state = `${roomPrefix}_HPSP_${presetTimeOfDaySuffix}`;
    logger.warn(`>> sourceItem setpoint ITEM_NAME: ${sourceItem.name}, STATE: : ${sourceItem.state} `);
    logger.warn(`>>== asssigningg sourceItem setpoint: ${sourceItem.name}, STATE: : ${sourceItem.state} `);
    logger.warn(`>>== to destination preset: ${destinationItem.name}, STATE: : ${destinationItem.state} `);
    // destinationItem.state = sourceItem.state;
    if ((roomPrefix === 'CT') || (roomPrefix === 'AT') || (roomPrefix === 'OF')) {
      logger.error(`....>>== EXCLUDE: NOT updating  destination setpoint temperature preset by OLD CRON method, handled by new timelines. NAME: ${destinationItem.name}, STATE: : ${destinationItem.state} `);
    } else {
      destinationItem.postUpdate(sourceItem.state);
    }
    logger.warn(`>>== destination preset now is: ${destinationItem.name}, STATE: : ${destinationItem.state} `);
    logger.warn(`>> HeatingPresetTempsGroup now contains: ${gHeatingPresetTemps} `);
    myutils.showGroupMembers(gHeatingPresetTemps);
  });
  logger.warn('\n');
  // now send those presets defined by params passed in above to the actual room heaters
  // (note only get updated if master mode is 'auto'
  // actually processed in file 'heating_send_presets) forced by updating 'Heating_UpdateHeaters'
  items.getItem('Heating_UpdateHeaters').sendCommand('ON');
}
// ==============================================================================
rules.JSRule({
  name: 'CRON: update current room heating setpoints - 1',
  description: 'CRON heating cron 1',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_1').state.toString())],
  execute: () => {
    const temp = items.getItem('Outside_Temperature').state().floatValue();
    logger.warn(`PRE  check if cold enough to start heating: ${temp} `);
    if (temp < 10.0) {
      updateRoomSetPoints('gHeating_PresetTempNormal', 'Morning');
    }
  },
});

rules.JSRule({
  name: 'CRON: update current room heating setpoints - 2',
  description: 'CRON heating cron 2',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_2').state.toString())],
  execute: () => {
    const temp = items.getItem('Outside_Temperature').getState().floatValue();
    logger.warn(`PRE  check if cold enough to start heating: ${temp} `);
    if (temp < 13.0) {
      updateRoomSetPoints('gHeating_PresetTempNormal', 'Morning');
    }
  },
});

rules.JSRule({
  name: 'CRON: update current room heating setpoints - 3',
  description: 'CRON heating cron 3',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_3').state.toString())],
  execute: () => {
    logger.warn('start heating CRON_HPSP_Time_3: ');
    updateRoomSetPoints('gHeating_PresetTempNormal', 'Morning');
  },
});
rules.JSRule({
  name: 'CRON: update current room heating setpoints - 4',
  description: 'CRON heating cron 4',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_4').state.toString())],
  execute: () => {
    logger.warn('start heating CRON_HPSP_Time_4: ');
    updateRoomSetPoints('gHeating_PresetTempNormal', 'Day');
  },
});

rules.JSRule({
  name: 'CRON: update current room heating setpoints - 5',
  description: 'CRON heating cron 5',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_5').state.toString())],
  execute: () => {
    logger.warn('start heating CRON_HPSP_Time_5: ');
    updateRoomSetPoints('gHeating_PresetTempNormal', 'Evening');
  },
});

rules.JSRule({
  name: 'CRON: update current room heating setpoints - 6',
  description: 'CRON heating cron 6',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_6').state.toString())],
  execute: () => {
    logger.warn('start heating CRON_HPSP_Time_6: ');
    updateRoomSetPoints('gHeating_PresetTempNormal', 'WE_Morning');
  },
});

rules.JSRule({
  name: 'CRON: update current room heating setpoints - 7',
  description: 'CRON heating cron 7',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_7').state.toString())],
  execute: () => {
    logger.warn('start heating CRON_HPSP_Time_7: ');
    updateRoomSetPoints('gHeating_PresetTempNormal', 'WE_Evening');
  },
});

rules.JSRule({
  name: 'CRON: update current room heating setpoints - 8',
  description: 'CRON heating cron 8',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_8').state.toString())],
  execute: () => {
    logger.warn('start heating CRON_HPSP_Time_8: ');
    updateRoomSetPoints('gHeating_PresetTempNormal', 'Night');
  },
});

// # con tue,wed,thur morn extra early - for work
rules.JSRule({
  name: 'CRON: update current room heating setpoints - 9',
  description: 'CRON heating cron 9',
  triggers: [triggers.GenericCronTrigger(items.getItem('CRON_HPSP_Time_9').state.toString())],
  execute: () => {
    logger.warn('start heating CRON_HPSP_Time_8: ');
    updateRoomSetPoints('gHeating_PresetTempNormal', 'Morning');
  },
});

// ==================cron test =================
// rules.JSRule({
//   name: 'CRON: update current room heating setpoints - TEST',
//   description: 'CRON heating cron TEST',
//   triggers: [triggers.GenericCronTrigger('0/30 * * * * *')],
//   execute: () => {
//     logger.warn('----------------CRON TEST EVERY 30 secs --------------------');
//     updateRoomSetPoints('gHeating_PresetTempNormal', 'Night');
//   },
// });
