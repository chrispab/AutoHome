// https://community.openhab.org/t/roku-support-on-oh3-using-http-binding/110533/16
const {
    log, items, rules, actions, time, triggers,
  } = require('openhab');
  
  var ruleUID = "roku";
  const logger = log(ruleUID);
  // log:set DEBUG org.openhab.automation.openhab-js.roku
  // log:set INFO org.openhab.automation.openhab-js.roku
  scriptLoaded = function () {
    logger.info(`scriptLoaded - ${ruleUID}`);
  };


// triggers:
//   - id: "1"
//     configuration:
//       itemName: rokuitem
    type: core.ItemStateUpdateTrigger
// conditions: []
// actions:
//   - inputs: {}
//     id: "2"
//     configuration:
//       type: application/javascript
//       script: >+
//         //need below to log to openhab.log file

//         var logger = Java.type('org.slf4j.LoggerFactory').getLogger('org.openhab.rule.' + ctx.ruleUID);

        //below is if you are going to use the ececute command

        var Exec = Java.type("org.openhab.core.model.script.actions.Exec");

        //below is also needed for the execute command

        var Duration = Java.type("java.time.Duration");


        var HttpUtil = Java.type("org.openhab.core.io.net.http.HttpUtil");

        var HttpGet = Java.type("org.openhab.core.model.script.actions.HTTP");


        var PORT = "8060"

        var IP = "192.168.1.212"


        var stateof = event.itemState.toString() ;

        logger.info("results = " + stateof);



        switch(stateof) {
         case "KEY_POWER":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/PowerOn", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_PLAY":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Play", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_PAUSE":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Play", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_REWIND":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Rev", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_FF":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Fwd", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_FF":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Up", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_LEFT":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Left", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_ENTER":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Select", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_RIGHT":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Right", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_DOWN":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Down", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_HOME":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Home", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_RETURN":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/InstantReplay", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_BACK":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/keypress/Back", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_NETFLIX":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/launch/12", 20000);
          logger.info('Play key pressed');
            break;

          case "KEY_AMAZON":
             HttpUtil.executeUrl("POST","http://"+IP+":"+PORT+"/launch/13", 20000);
          logger.info('Play key pressed');
            break;

            
          default:
              logger.info('Nothing ran');

        }    

    type: script.ScriptAction