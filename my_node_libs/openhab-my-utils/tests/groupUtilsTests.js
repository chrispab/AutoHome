// These are included strictly for demonstration purposes to demonstrate how to use the library.
// If you want to run this you need to use your own Group Items and look at the log to make sure
// the results make sense.
var { utils } = require('openhab-my-utils');
var logger = log('openhab-my-utils');


let itemName = "v_CT_anything_nsns";
let roomPrefix = utils.getLocationPrefix(itemName, logger);
logger.info(`roomPrefix: ${roomPrefix}`);
logger.info('roomPrefix: {}',roomPrefix);

itemName = "CT_anything_nsns";
roomPrefix = utils.getLocationPrefix(itemName, logger);
logger.info(`roomPrefix: ${roomPrefix}`);
logger.info('roomPrefix: {}',roomPrefix);



// var names = groupUtils.membersToMappedList('ServiceStatuses', i => i.label, i => i.state == 'ON');
// logger.info('There are {} services that are ON', names.length);
// logger.info(names);

// var doors = groupUtils.descendentsToMappedList('Family_Room', i => i.label, i => i.name.includes('oor'));
// logger.info('There are {} doors in the family room', doors.length);
// logger.info(doors);


// var namesStr = groupUtils.membersToString('ServiceStatuses', ', ', i => i.label, i => i.state = 'ON');
// logger.info('The services that are ON include: {}', namesStr);


// var doorsStr = groupUtils.descendentsToString('Family_Room', ', ', i => i.label, i => i.name.includes('oor'));
// logger.info('The doors in the family room include: {}', doorsStr);

// var humSum = groupUtils.reduceMemberStates('MinIndoorHumidity', (sum, val) => sum += val, i => !i.isUninitialized);
// logger.info('Sum of humidities is {}', humSum);

// var desDum = groupUtils.reduceDecendentStates('Family_Room', (sum, val) => sum += val, i => i.type == 'NumberItem' && !i.isUninitialized );
// logger.info('States of the number Items in the family room is {}', desDum);

// var sumList = groupUtils.sumList(items.getItem('MinIndoorHumidity').members);
// logger.info('Sum humidity {}', sumList);

// var avgList = groupUtils.avgList(items.getItem('MinIndoorHumidity').members);
// logger.info('Avg humidity {}', avgList);

// var minList = groupUtils.minList(items.getItem('MinIndoorHumidity').members);
// logger.info('Min humidity {}', minList);

// var maxList = groupUtils.maxList(items.getItem('MinIndoorHumidity').members);
// logger.info('Max humidity {}', maxList);

// var count = groupUtils.countList(items.getItem('AllLights').members, i => i.state == 'ON');
// logger.info('There are {} lights on', count);