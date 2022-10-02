const {
  log, items, rules, actions,
} = require('openhab');
const { myutils } = require('personal');

const logger = log('BG_Availability.js');
const { timeUtils } = require('openhab_rules_tools');

let tsceneStartup;

scriptLoaded = function () {
  logger.warn('StartUp - set up Item Scene_Goodnight');
  if (tsceneStartup === undefined) {
    tsceneStartup = actions.ScriptExecution.createTimer(timeUtils.toDateTime((45 * 1000)), () => {
      items.getItem('Scene_Goodnight').postUpdate('OFF');
    });
  }
};

let tgoodnight;
// @rule("Goodnight Going to bed", description="Goodnight Going to bed", tags=["scene"])
// @when("Item Scene_Goodnight changed from OFF to ON")
// def Scene_Goodnight(event):
//     # Scene_Goodnight.log.info("::Boiler_Control rule -> A Heater recieved a command - updating boiler state::")
//     LogAction.logError("Scene_Goodnight", "goodnight going to bed")
//     global tgoodnight

//     events.sendCommand("CT_FairyLights433Socket", "OFF")
//     events.sendCommand("ZbColourBulb01Switch", "OFF")
//     events.sendCommand("ZbColourBulb02Switch", "OFF")

//     events.sendCommand("radio", "OFF")
//     events.sendCommand("vCT_TVKodiSpeakers", "OFF")

//     events.postUpdate("CT_Heating_PresetTempNormal", items["CT_HPSP_Night"].toString())
//     events.postUpdate("FR_Heating_PresetTempNormal", items["FR_HPSP_Night"].toString())
//     events.postUpdate("ER_Heating_PresetTempNormal", items["ER_HPSP_Night"].toString())
//     events.postUpdate("AT_Heating_PresetTempNormal", items["AT_HPSP_Night"].toString())
//     events.postUpdate("BR_Heating_PresetTempNormal", items["BR_HPSP_Night"].toString())
//     events.postUpdate("OF_Heating_PresetTempNormal", items["OF_HPSP_Night"].toString())
//     events.postUpdate("HL_Heating_PresetTempNormal", items["HL_HPSP_Night"].toString())
//     events.sendCommand("Heating_UpdateHeaters", "OFF")
//     events.sendCommand("Heating_UpdateHeaters", "ON")

//     events.postUpdate("Scene_Goodnight", "OFF")
//     events.sendCommand("workLightsPowerSocket", "OFF")
//     events.sendCommand("workLightsPowerSocket", "OFF")
//     tgoodnight = ScriptExecution.createTimer(DateTime.now().plusSeconds(300), lambda: events.sendCommand("ZbWhiteBulb01Switch", "OFF"))
rules.JSRule({
  name: 'Goodnight Going to bed',
  description: 'Goodnight Going to bed',
  triggers: [triggers.ItemStateChangeTrigger('Scene_Goodnight', 'OFF', 'ON')],
  execute: (event) => {
    logger.warn(`Goodnight Going to bed, triggering item name: ${event.itemName} : ,  received  update event.receivedState: ${event.receivedState}`);
    //     events.sendCommand("CT_FairyLights433Socket", "OFF")
    //     events.sendCommand("ZbColourBulb01Switch", "OFF")
    //     events.sendCommand("ZbColourBulb02Switch", "OFF")
    items.getItem('CT_FairyLights433Socket').sendCommand('OFF');
    items.getItem('ZbColourBulb01Switch').sendCommand('OFF');
    items.getItem('ZbColourBulb02Switch').sendCommand('OFF');

    //     events.sendCommand("radio", "OFF")
    //     events.sendCommand("vCT_TVKodiSpeakers", "OFF")
    items.getItem('radio').sendCommand('OFF');
    items.getItem('vCT_TVKodiSpeakers').sendCommand('OFF');

    //     events.postUpdate("CT_Heating_PresetTempNormal", items["CT_HPSP_Night"].toString())
    //     events.postUpdate("FR_Heating_PresetTempNormal", items["FR_HPSP_Night"].toString())
    //     events.postUpdate("ER_Heating_PresetTempNormal", items["ER_HPSP_Night"].toString())
    //     events.postUpdate("AT_Heating_PresetTempNormal", items["AT_HPSP_Night"].toString())
    //     events.postUpdate("BR_Heating_PresetTempNormal", items["BR_HPSP_Night"].toString())
    //     events.postUpdate("OF_Heating_PresetTempNormal", items["OF_HPSP_Night"].toString())
    //     events.postUpdate("HL_Heating_PresetTempNormal", items["HL_HPSP_Night"].toString())
    //     events.sendCommand("Heating_UpdateHeaters", "OFF")
    //     events.sendCommand("Heating_UpdateHeaters", "ON")
    // get temp values from the web page defining room temp presets
    // and update 'XX_Heating_PresetTempNormal' items
    items.getItem('CT_Heating_PresetTempNormal').postUpdate(items.getItem('CT_HPSP_Night').toString());
    items.getItem('FR_Heating_PresetTempNormal').postUpdate(items.getItem('FR_HPSP_Night').toString());
    items.getItem('ER_Heating_PresetTempNormal').postUpdate(items.getItem('ER_HPSP_Night').toString());
    items.getItem('AT_Heating_PresetTempNormal').postUpdate(items.getItem('AT_HPSP_Night').toString());
    items.getItem('BR_Heating_PresetTempNormal').postUpdate(items.getItem('BR_HPSP_Night').toString());
    items.getItem('OF_Heating_PresetTempNormal').postUpdate(items.getItem('OF_HPSP_Night').toString());
    items.getItem('HL_Heating_PresetTempNormal').postUpdate(items.getItem('HL_HPSP_Night').toString());
    items.getItem('Heating_UpdateHeaters').sendCommand('OFF');
    items.getItem('Heating_UpdateHeaters').sendCommand('ON');

    //     events.postUpdate("Scene_Goodnight", "OFF")
    //     events.sendCommand("workLightsPowerSocket", "OFF")
    //     events.sendCommand("workLightsPowerSocket", "OFF")
    //     tgoodnight = ScriptExecution.createTimer(DateTime.now().plusSeconds(300), lambda: events.sendCommand("ZbWhiteBulb01Switch", "OFF"))
    items.getItem('Scene_Goodnight').postUpdate('OFF');
    items.getItem('workLightsPowerSocket').sendCommand('OFF');
    tgoodnight = actions.ScriptExecution.createTimer(timeUtils.toDateTime((300 * 1000)), () => {
      items.getItem('ZbWhiteBulb01Switch').sendCommand('OFF');
    });
  },
});
