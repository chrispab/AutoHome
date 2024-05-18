const {
    log, items, rules, actions, time, triggers,
} = require('openhab');
const { alerting, utils } = require('openhab-my-utils');

var ruleUID = "lg_tv";

const logger = log(ruleUID);
// log:set DEBUG org.openhab.automation.openhab-js.lg_tv
// log:set INFO org.openhab.automation.openhab-js.lg-tv
let tStartup;

scriptLoaded = function scriptLoaded() {
    logger.info('scriptLoaded - System started - LG TV startup settings');

    // logger.info('startup- set Kodi_CT_Online_Status status ');
    // const thingStatusInfo = actions.Things.getThingStatusInfo('kodi:kodi:4cc97fc0-c074-917d-e452-aed8219168eb');
    // logger.info('Thing Kodi_CT_Online_Status status', thingStatusInfo.getStatus());

    // if (thingStatusInfo.getStatus().toString() == 'ONLINE') {
    //     items.getItem('Kodi_CT_Online_Status').postUpdate('ONLINE');
    // } else {
    //     items.getItem('Kodi_CT_Online_Status').postUpdate('OFFLINE');
    // }

    // if (!tStartup) {
    //     tStartup = actions.ScriptExecution.createTimer(time.toZDT((5 * 1000)), () => {
    //         tv_startup_tbody();
    //     });
    // }
    actions.Voice.say('LG TV startup');
};

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
        //   triggers.ItemStateChangeTrigger('vCT_TVKodiSpeakers2', 'OFF', 'ON')
    ],
    execute: (event) => {
        // save selected app name
        logger.debug(`CT_TV_Application: ${items.getItem('CT_TV_Application').state}`);
        logger.debug(`event.itemName: ${event.itemName}`);


        utils.showEvent(event, logger);
        appn = items.getItem(event.itemName).state;
        items.getItem('CT_TV_LastApp').sendCommand(appn);
        logger.debug(`CT_TV_LastApp.state: ${items.getItem('CT_TV_LastApp').state}`);

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
        logger.debug(`CT_TV_Application: ${items.getItem('CT_TV_Application').state}`);
        logger.debug(`event.itemName: ${event.itemName}`);

        //RESTORE
        utils.showEvent(event, logger);
        appn = items.getItem('CT_TV_LastApp').state;
        items.getItem('CT_TV_Application').sendCommand(items.getItem('CT_TV_LastApp').state);
        logger.debug(`CT_TV_LastApp.state: ${items.getItem('CT_TV_LastApp').state}`);

    },
});