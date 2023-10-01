// incoming event in format "itemName": "v_CT_SetPoint_auto_update_by_timeline",
// now get the actual temp setpoint from the corresponding setpoit item
// e.g
// convert label from setpoit timeline to a temperature vales e.g. 'min' to 17.0
// roomPrefix is first 2 chars of triggering item name
const heaterPrefixPartial = itemName.toString().substr(itemName.indexOf('_') + 1);
const heaterPrefix = heaterPrefixPartial.substr(0, itemName.indexOf('_') + 1);
logger.info(`--->>> heaterPrefix : ${heaterPrefix}`);
