// from core.rules import rule
// from core.triggers import when
// from core.actions import ScriptExecution

// @rule("Turn ON conservatory lights via proxy", description="Handles fan actions", tags=["conservatory", "fan"])
// # @when("Item CT_Temperature changed")
// @when("Item conservatoryLightsProxy changed from OFF to ON")
// def conservatory_lights_on(event):
//     conservatory_lights_on.log.info("Turn ON the Conservatory lights via proxy")
//     events.sendCommand("gConservatoryFairyLights", "ON")
//     events.sendCommand("workLightsPowerSocket", "ON")
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

// @rule("Turn OFF conservatory lights via proxy", description="Handles fan actions", tags=["conservatory", "fan"])
// @when("Item conservatoryLightsProxy changed from ON to OFF")
// def conservatory_lights_off(event):
//     conservatory_lights_off.log.info("Turn Off the Conservatory lights via proxy")
//     events.sendCommand("gConservatoryFairyLights", "OFF")
//     # events.postUpdate("gConservatoryFairyLights", "OFF")
//     # events.postUpdate("ZbColourBulb01Switch", "OFF")
//     events.sendCommand("workLightsPowerSocket", "OFF")
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
