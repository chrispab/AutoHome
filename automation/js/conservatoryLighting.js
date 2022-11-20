const { myutils } = require('personal');
const {
  log, items, triggers, rules,
} = require('openhab');

rules.JSRule({
  name: 'Turn ON conservatory lights via proxy',
  description: 'Turn ON conservatory lights via proxy',
  triggers: [triggers.ItemStateChangeTrigger('conservatoryLightsProxy', 'OFF', 'ON')],
  execute: (event) => {
    console.error('£££:  Turn ON the Conservatory lights via proxy');

    // myutils.showEvent(event);

    items.getItem('gConservatoryFairyLights').sendCommand('ON');
    items.getItem('workLightsPowerSocket').sendCommand('ON');
  },
});

rules.JSRule({
  name: 'Turn OFF conservatory lights via proxy',
  description: 'Turn OFF conservatory lights via proxy',
  triggers: [triggers.ItemStateChangeTrigger('conservatoryLightsProxy', 'ON', 'OFF')],
  execute: (event) => {
    console.error('£££:  Turn OFF the Conservatory lights via proxy');

    // myutils.showEvent(event);

    items.getItem('gConservatoryFairyLights').sendCommand('OFF');
    items.getItem('workLightsPowerSocket').sendCommand('OFF');
  },
});
