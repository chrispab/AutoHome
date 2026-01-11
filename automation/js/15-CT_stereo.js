/* eslint-disable max-len */
const {
  time, log, items, rules, actions, triggers,
} = require('openhab');

const ruleUID = 'ct-stereo';
const logger = log(ruleUID);

const tToAmpIRPowerOn = 20;
const tToSelectAmpAux = 30;
const tToTurnOffStereo = 30;

const CT_stereo_off_timer = null;
rules.JSRule({
  name: 'turn ON conservatory stereo',
  description: 'turn ON conservatory stereo',
  triggers: [triggers.ItemStateChangeTrigger('vCT_stereo', 'OFF', 'ON')],
  execute: () => {
    logger.info('Turning on stereo - kodi, amp');
    items.getItem('bg_wifisocket_1_1_power').sendCommand('ON'); // kodi, amp, ir bridge, hdmi audio extractor
    // items.getItem("bg_wifisocket_1_1_power").sendCommand("ON");//kodi pi

    // if there is a request to turn off the stereo in progress cancel it as we want it on!
    // if (CT_stereo_off_timer && CT_stereo_off_timer.isActive()) {
    //   CT_stereo_off_timer.cancel();
    // }

    // actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(tToAmpIRPowerOn), () => {
    //   items.getItem('amplifier_IR_PowerOn').sendCommand('ON'); // IR code
    //   logger.info('STEREO - IR turn on amp from standby');
    // });
    // actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(tToSelectAmpAux), () => {
    //   items.getItem('amplifier_IR_Aux').sendCommand('ON'); // IR code

    //   logger.info('STEREO - IR amp switch to AUX source');
    // });
  },
});

rules.JSRule({
  name: 'turn OFF conservatory stereo',
  description: 'turn OFF conservatory stereo',
  triggers: [
    // triggers.ItemStateUpdateTrigger("vCT_stereo", "OFF"),
    triggers.ItemStateChangeTrigger('vCT_stereo', 'ON', 'OFF'),
  ],
  execute: () => {
    //! if being turned off by ct tv coming on then dont do the normal off routine
    if (items.getItem('vCT_TVKodiSpeakers').state === 'ON') {
      // someone is turning on ct tv
      logger.info(
        'CT tv being turned on - Stereo is ON - so dont switch off the stereo - kodi, amp, and bridges reused',
      );
      // items.getItem('vCT_stereo').postUpdate('OFF'); //turn off virt trigger
      return;
    }
    logger.info('Turning OFF stereo - kodi, amp, and bridges');
    items.getItem('Kodi_CT_systemcommand').sendCommand('Shutdown'); // shutdown CT Pi
    // logger.info("err 2");
    const ampOffItem = items.getItem('amplifier_IR_PowerOff', true);
    if (ampOffItem) {
      ampOffItem.sendCommand('ON');
    } else {
      logger.warn("Item 'amplifier_IR_PowerOff' not found, skipping IR command");
    }

    logger.info('STEREO - turned OFF amp, and bridges');
    // if stereo off timer is not defined or completed, restart the stereo off timer
    // if (!CT_stereo_off_timer || !CT_stereo_off_timer.isActive()) {
    //   CT_stereo_off_timer = actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(tToTurnOffStereo), () => {
    items.getItem('bg_wifisocket_1_1_power').sendCommand('OFF'); // CT kodi, amp, ir bridge, hdmi audio extractor
    items.getItem('vCT_stereo').postUpdate('OFF'); // turn off virt trigger

    logger.info('STEREO - turned OFF kodi');
    // });
    // }
  },
});
