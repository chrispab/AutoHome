const {
  log, items, rules, actions, time, triggers,
} = require('openhab');
const { alerting, utils } = require('openhab-my-utils');

const ruleUID = 'lg_tv';

const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.lg_tv
// log:set INFO org.openhab.automation.openhab-js.lg-tv
// log:set debug org.openhab.binding.lgwebos
// log:set INFO org.openhab.binding.lgwebos

scriptLoaded = function scriptLoaded() {
  logger.info('scriptLoaded - System started - LG TV startup settings');
  actions.Voice.say('TV');
};

// Group gTVApplication
// Group gTVPower

// Group LivingRoom_TV ["Television"]
// Switch LivingRoom_TV_Power  "Living Room TV Power" ["Control", "Power"] (LivingRoom_TV, gTVPower) { channel="lgwebos:WebOSTV:living:power", autoupdate="false" }
// String LivingRoom_TV_Application "Application [%s]" ["Status"] (LivingRoom_TV, gTVApplication) { channel="lgwebos:WebOSTV:living:appLauncher"}
//   # If using text-based items definition, uncomment the following line
// # provider!(:persistent)

// rule "TV: Keep track of app changes" do
//   changed gTVApplication.members, for: 1.minute
//   run do |event|
//     next unless event.item.points(Semantics::Power).first.on?
//     next if !event.item.state || event.item.state.to_s.empty?
//     next if event.item.metadata["last_app"]&.value == event.item.state.to_s

//     event.item.metadata["last_app"] = event.item.state.to_s
//     logger.info "#{event.item.equipment.name} app saved: #{event.item.state}"
//   end
// end
rules.JSRule({
  name: 'TV: Keep track of app changes',
  description: 'TV: Keep track of app changes',
  triggers: [
    triggers.GroupStateChangeTrigger('gTVApplication'),
  ],
  execute: (event) => {
    // save selected app name
    logger.debug(`1. TV: Keep track of app changes: current CT_TV_Application.state: ${items.getItem('CT_TV_Application').state}`);

    // dont update if shutting down or starting up -  undef
    utils.showEvent(event, logger);

    if (items.getItem('CT_TV_Power').state === 'ON') {
      const appName = event.newState;
      logger.debug(`2.  TV: appName = event.newState ${appName}`);
      if (appName === undefined || appName === 'com.webos.app.hdmi2') {
        logger.debug(`3.TV: (appName === undefined || appName === 'com.webos.app.hdmi2'),  not updating CT_TV_LastApp.state with: ${appName}`);
      } else {
        items.getItem('CT_TV_LastApp').sendCommand(appName);
        logger.debug(`4.TV: Keep track of app changes: new CT_TV_LastApp.state: ${appName}`);
      }
    }
  },
});

// rule "TV: Restore Last App" do
//   changed gTVPower.members, to: ON, for: 5.seconds
//   run do |event|
//     application = event.item.points.member_of(gTVApplication).first
//     next unless %w[com.webos.app.livetv com.webos.app.hdmi HDMI].include? application.state.to_s

//     last_app = application.metadata["last_app"]&.value
//     next unless last_app

//     application << last_app
//     logger.info("TV State Restored last app: #{last_app} on #{event.item.equipment.name}")
//   end
// end

rules.JSRule({
  name: 'TV: Restore Last App',
  description: 'TV: Restore Last App',
  triggers: [
    triggers.GroupStateChangeTrigger('gTVPower', 'OFF', 'ON'),
  ],
  execute: (event) => {
    logger.debug('0--TV-Restore - gTVPower OFF->ON');
    utils.showEvent(event, logger);
    logger.debug(`1--TV-Restore - event.itemName: ${event.itemName}`);

    const appName = items.getItem('CT_TV_LastApp').state;
    logger.debug(`2--TV-Restore - get appName from CT_TV_LastApp: ${appName}`);

    // wait for app data to come back from tv on power up
    actions.ScriptExecution.createTimer(time.ZonedDateTime.now().plusSeconds(15), () => {
      logger.debug(`3--TV-Restore -  appName passed into timer: ${appName}`);

      if (appName === undefined) {
        items.getItem('CT_TV_Application').sendCommand('com.webos.app.home');
        logger.debug('4--TV-Restore - appName == undefined..set default CT_TV_LastApp.state: com.webos.app.home');
      } else {
        items.getItem('CT_TV_Application').sendCommand(appName);
        logger.debug(`5--TV-Restore - restoring CT_TV_LastApp.state to: ${appName}`);
      }
    });
  },
});
