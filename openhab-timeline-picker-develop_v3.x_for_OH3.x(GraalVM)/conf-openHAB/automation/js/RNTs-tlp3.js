// timeline/ timepicker control
// version 3.0.2
// ToSe 
//

// to do's:
// 
//

// limitations:
// every change will update items in max 2 minutes (worst case)
// 


const previousStates = {}                                                       // nessesary for event mode and restoring previous state

////////// functions ////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * convert value from JAVA object to JS object
 * @param {string} key key for releated value
 * @param {stringifyed JAVA object} rawConf JAVA object with key, value pairs
 */
const extractValueFromJAVA = (rawConf, key) => {
  for (elJAVA of rawConf) {
    const confEL = elJAVA.slice(1).slice(0,-1).split(';')
    if ((confEL[0].split('=')[1]) == key) {
      const typeEL = confEL[1].split('=')[1]
      switch (typeEL) {
        case 'ArrayList': {                                                           // parse and return an array of strings
          const elValue = confEL[2].split('=')[1].slice(1).slice(0,-1).split(',')
          const returnState = []
          for (el of elValue) returnState.push(el.trim())
          return returnState
        }
        case 'Boolean': return (confEL[2].split('=')[1] === 'true')                   // parse and return a boolean
        case 'BigDecimal': return parseFloat(confEL[2].split('=')[1])                 // parse and return a decimal
        case 'String': return confEL[2].split('=')[1]                                 // parse and return a string
        default: { console.Error('tlp - E003: error in function convert JAVA object to JS object'); return ''; }
      }
    }
  }
  return ''
}
 
//
// ----- rules ----------------------------------------------------------------------------------------------------------
//
rules.JSRule({
  name: "RNTs - timelinepicker",
  description: "server side script for timelinepicker",
  triggers: [
    triggers.GenericCronTrigger("0 0/2 * 1/1 * ? *"),                                     // run every 2  minutes
    // triggers.GenericCronTrigger("0/15 * * ? * * *  "),                                 // run every 15 seconds, for debug only
    triggers.ItemStateChangeTrigger("tlpTrigger"),                                        // automatic generated item for triggering rule when changed in ui
    triggers.SystemStartlevelTrigger(100)
  ],
  execute: function(event){
    // console.info("------------ timeline picker 3 -------------")
    
    let tlp_ids = {}

    try {
      let loadConfig = false
      const tlpThingJAVA = things.getThing('tlpicker:tlp:home').rawThing
      const thingConfig = tlpThingJAVA.getConfiguration().toString().slice(14).slice(0, -1).replaceAll('}, ', '}}, ').split('}, ')

      const tlpThing = {
        "configuration": {
          "sunriseItem": extractValueFromJAVA(thingConfig, 'sunriseItem'),
          "sunsetItem": extractValueFromJAVA(thingConfig, 'sunsetItem')
        },
        "channels": []
      }
      
      tlpThingJAVA.getChannels().forEach(ch => {
        const extractID = id => { return id.slice(id.lastIndexOf(':') + 1)}
        const channelID = extractID(ch.getUID().toString())
        const channelConfig = ch.getConfiguration().toString().slice(14).slice(0, -1).replaceAll('}, ', '}}, ').split('}, ')
      
        tlpThing['channels'].push({
          "id": channelID,
          "configuration": {
            "1": extractValueFromJAVA(channelConfig, '1').map(el => parseInt(el)),
            "2": extractValueFromJAVA(channelConfig, '2').map(el => parseInt(el)),
            "3": extractValueFromJAVA(channelConfig, '3').map(el => parseInt(el)),
            "4": extractValueFromJAVA(channelConfig, '4').map(el => parseInt(el)),
            "5": extractValueFromJAVA(channelConfig, '5').map(el => parseInt(el)),
            "6": extractValueFromJAVA(channelConfig, '6').map(el => parseInt(el)),
            "7": extractValueFromJAVA(channelConfig, '7').map(el => parseInt(el)),
            "sunEvents": extractValueFromJAVA(channelConfig, 'sunEvents'),
            "active": extractValueFromJAVA(channelConfig, 'active'),
            "sunsetOffset": extractValueFromJAVA(channelConfig, 'sunsetOffset'),
            "sunriseOffset": extractValueFromJAVA(channelConfig, 'sunriseOffset'),
            "states": extractValueFromJAVA(channelConfig, 'states'),
            "mode": extractValueFromJAVA(channelConfig, 'mode'),
            "event": extractValueFromJAVA(channelConfig, 'event'),
            "linkedItems": extractValueFromJAVA(channelConfig, 'linkedItems'),
          }
        })
      })

      try {
        tlp_ids = require('../conf/00_RNTs-tlp3_conf.js').tlp_ids
        loadConfig = true
      } catch(e) {
        console.warn('tlp - W001: no config file exist')
      }

      try {
        // calculate minutes since midnight & day of week
        const d0 = new Date(), d1 = new Date(d0)
        const msSinceMidnight = d1 - d0.setHours(0,0,0,0)
        const currTimeInterval = Math.floor(msSinceMidnight / 60000 / 15)
        let currDay = d0.getDay()
        if (currDay == 0) currDay = 7 
        
        tlpThing["channels"].forEach(el => {
          const id = el["id"]
          let itemToSwitch = []
          // check linked items in file or thing

          if (loadConfig && (id in tlp_ids)) {
            tlp_ids[id].split(',').forEach(arg => { 
              if (arg !== '') itemToSwitch.push(arg.trim())
            })
          } else itemToSwitch = el["configuration"]["linkedItems"]

          if (itemToSwitch.length > 0 && itemToSwitch[0] !== '') {
            const channel_conf = el["configuration"]
            const active = channel_conf["active"]

            if (active) {
              const sunEvents = channel_conf?.sunEvents
              let newStateIndex = channel_conf[currDay][currTimeInterval]
              const event = channel_conf?.event
              
              let skip = false
              if (sunEvents) {
                if (newStateIndex > 10) {
                  // this is a state with sun condition
                  // >20 is after sunrise and befor sunset == sun is shining
                  // >10 <20 is befor sunrise or after sunset == no sun

                  const sunriseItem = items.getItem(tlpThing["configuration"]["sunriseItem"])
                  const sunsetItem = items.getItem(tlpThing["configuration"]["sunsetItem"])
                  let sunrise_ms = null, sunset_ms = null

                  if ((sunriseItem !== null) && (sunriseItem.type === 'DateTimeItem')) {
                    sunrise_ms = (new Date(sunriseItem.state)).getTime() + (channel_conf["sunriseOffset"] ??= 0) * 60 * 60000
                  } else {
                    skip = true
                    console.warn('tlp - W003: defined item for sunrise is wrong | id= ' +  id)
                  }  
                  if ((sunsetItem !== null) && (sunsetItem.type === 'DateTimeItem')) {
                    sunset_ms = (new Date(sunsetItem.state)).getTime() + (channel_conf["sunsetOffset"] ??= 0) * 60 * 60000
                  } else {
                    skip = true
                    console.warn('tlp - W004: defined item for sunset is wrong | id= ' +  id)
                  }  

                  // check if sun condition true
                  const currentIsSun = Date.now() > sunrise_ms && Date.now() < sunset_ms
                  skip = newStateIndex > 20 ? !currentIsSun : currentIsSun
                  newStateIndex -= newStateIndex > 20 ? 20 : 10
                }
              }
                  
              if (!skip) {
                newStateIndex -= 1
                let newState = newStateIndex != -1 ? channel_conf["states"][newStateIndex].split('@')[0] : undefined

                itemToSwitch.forEach(iTS => {
                  if (items.getItem(iTS) != null) {
                    if (event) {
                      if ((newStateIndex != -1) && (previousStates[iTS] == undefined)) previousStates[iTS] = items.getItem(iTS).state
                      if ((newStateIndex == -1) && (previousStates[iTS] != undefined)) {
                        newState = previousStates[iTS]
                        previousStates[iTS] = undefined
                      }
                    }
                    // if ((newState != undefined) && (items.getItem(iTS).state != newState)) console.info('tlp - H001: switched Item: ' + iTS + ' | state: ' + newState)    // only for testing
                    if ((newState != undefined) && (items.getItem(iTS).state != newState)) items.getItem(iTS).sendCommandIfDifferent(newState)
                  } else console.warn('tlp - W004: unknown item to switch | id= ' +  id)
                })    
              }
            }
          } else console.warn('tlp - W002: no items defined to switch | id= ' +  id)
        })
      } catch (e) {
        console.error('tlp - E002: error in inner loop', e)
      }
    } catch(e) {
      console.error('tlp - E001: error as calling tlp data', e)
    }
  }
})
