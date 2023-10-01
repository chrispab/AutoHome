// timeline/ timepicker control
// version 3.0.2
// ToSe 

/////////////////////////////////////////////////////////////////////////////////////
/*
next steps:
* headline from param and thing
* opts - Parameter: deactivation, dark, event, (everthing with yes and no) 
* dark mode for Headline and config


*/
/////////////////////////////////////////////////////////////////////////////////////

import timeScale from './timeScale.js'
import tlpAdminsetup from './tlpAdminSetup.js'
import tlpSinglesetup from './tlpSingleSetup.js'
import tlInactive from './tlInactive.js'
import content from './content.js'
import prefs from './prefs.js'
import tlpThing from './tlp_thing_controller.js'
import tlpItem from './tlp_item_controller.js'

const xScale = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']

new Vue({
  el: '#app',
  components: {
    timeScale,
    tlInactive,
    tlpAdminsetup,
    tlpSinglesetup,
  },
  data: () => ({
    device: '',                   // variables for presentation zoom slider and slider for shift timeintervall in sitemap
    orientation: 'portrait',      //
    zoomVisible: false,           //
    zoomForced: 'auto',           // 
    zoomFactor: 0,                //
    currTime:  12,                //
    initValue: {},                // buffer for data structure
    yAxisLabel: [],
    switchStates: [],
    currSwitchstate: 0,
    scaleValueColors: [],
    eventMode: false,
    tl_active: true,              // timeline active = true
    debounceTimer: null,          // debonce timer for activation/deactivation
    settingsVisible: true,        // show settings icon
    settingCurrent: false,        // current state of showing setup page
    sun_events: false,
    sunrise_offset: 0,
    sunset_offset: 0,
    sun_active_item: 0,
    // new variables and used variables
    headline: '',
    id: '',
    initComplete: false,          // true when all nessesary data fetched
    content: {},                  // object for all textfields
    messageHeader: 'tf0006',      // activate user messages
    messageContent1: 'tf0108',    // standard messages at start
    messageContent2: '',          // standard messages at start
    messageButtons: false,        // show button[s] under an warn or error message
    messageButton1: 'tf0001',     // content message buttons
    messageButton2: 'tf0002',     // content message buttons
    messageButton1Func: '',
    messageButton2Func: '',
    mCColor: 2,                   // [0 .. error, 1 .. warn, 2 .. note]
    darkMode: false,
    deactivation: false,          // switch for activation/deactivation visible
    mode: [],
    changed: false,               // if timeline changed than true
    editAllow: false,             // edit timeline only when true
    colorsManualSet: false,       // schauen ob benötigt !!!!
    adminSetup: false,
    token: ''                     // token for openHAB REST- Interface
  }),
  computed: {
    zoomFactor1: function() {
      return (this.zoomFactor == 0) ? 1 : this.zoomFactor * 3
    },
    currTime1: function() {
      return this.currTime * 1
    },
    currTimeScale: function() {
      let startIndex = this.currTime - (24 /this.zoomFactor1 / 2)
      if (startIndex < 0) startIndex = 0
      if ((startIndex + (24 / this.zoomFactor1)) > 24) startIndex = (24 - (24 / this.zoomFactor1))
      let endIndex = startIndex + (24 /this.zoomFactor1)
      return xScale.filter((val,index) => ((this.zoomFactor1 == 1) && (index % 2 == 0)) || ((this.zoomFactor1 != 1) && ((index >= startIndex) && (index <= endIndex))))
    },
    xAxisTimeScale: function() {
      return ((this.device == 'Mobile') && (this.orientation == 'portrait')) ? xScale.filter((val,index) => (index % 4 == 0)) : xScale.filter((val,index) => (index % 2 == 0))
    }
  },
  created() {
    this._initTimelineView()
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.screenChanged)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.screenChanged)
  },
  methods: {
    // set content and color from message card in html
    // default: everthing is clear
    //
    _setMessageInHTML(header = '', content1 = '', content2 = '', color = 0) {
      this.messageContent1 = content1
      this.messageContent2 = content2
      this.messageHeader = header
      this.mCColor = color
    },
    // set content for message buttons
    // default: cancel and continue
    // @param1: 
    _setMessageButtons(buttonsVisible = false, button1 = '', button2 = '', button1Func = '', button2Func = '') {
      this.messageButton1 = button1
      this.messageButton2 = button2
      this.messageButton1Func = button1Func
      this.messageButton2Func = button2Func
      this.messageButtons = buttonsVisible
    },
    _buttonHandler(val = '') {
      if (val !== '') this[val]()
    },
    _setMessageBreak() {
      this._setMessageInHTML('tf0006', 'tf0115','',2)
      this._setMessageButtons(false)
    },
    _createNewTimeline() {
      this._getParamsFromURL()
      this._setMessageInHTML('')
      this.changed = true
    },
    _mapCurrentLine(val) {
      return (val === '15' || val === '17') ? '1' : (val === '67') ? '6' : val
    },
    _getParamsFromURL() {
      // extract all parameter or defaults
      let urlParams = new URLSearchParams(window.location.search)
      this.switchStates = (urlParams.get('states') ?? 'OFF,ON').split(',')        // switch states
      this.switchStates.splice(6)                                                 // cancel from position six
      this.eventMode = urlParams.has('event')                                     // select event trigger
      if (this.eventMode) this.switchStates.unshift(this.content['tf0011'])       // add state manuell
      this.switchStates = this.switchStates.map(el => el.split('@')).map(el => [el[0], el[1] === undefined ? el[0] : el[1]])
      this.yAxisLabel = (urlParams.get('mode') ?? '1,2,3,4,5,6,7').split(',').sort().map(el => {
        if (el === '17') return this.content['tf0201'][0]
        if (el === '15') return this.content['tf0201'][1]
        if (el === '67') return this.content['tf0201'][9]
        return this.content['tf0201'][parseInt(el) + 1]
      })
      for (let i = 1; i < 8; i++) Vue.set(this.initValue, i, Array(96).fill(this.eventMode ? 0 : 1))
      this.mode = (urlParams.get('mode') ?? '1,2,3,4,5,6,7').split(',')
      // check selected days for valid values, duplicates and ordering
      let yAxisError = true
      if (this.mode.every(el => { return ["1","2","3","4","5","6","7","15","17","67"].includes(el) })) {
        yAxisError = false
        this.mode = (this.mode.includes("17")) ? ["17"] : [...new Set(this.mode)].sort()
        if (this.mode.includes("15")) {
          let cond1 = this.mode.every(el => ["6","7","15"].includes(el))
          let cond2 = this.mode.every(el => ["67","15"].includes(el))
          if (!((cond1 && !cond2) || (!cond1 && cond2))) yAxisError = true
        }
        if (this.mode.includes("67") && this.mode.every(el => ["6","7","67"].includes(el))) yAxisError = true  // das muss nochmal geprüft werden !!!!!
      }
      if (yAxisError) this._setMessageInHTML('tf0005', 'tf0114', 'tf0115')
      this._mapParamColor()
    },
    _mapParamColor() {
      // call after the event mode is dedictate
      let urlParams = new URLSearchParams(window.location.search)
      let colorSet = urlParams.get('colorset')
      this.scaleValueColors = [...prefs.colorsets["1"]]                 // select default colorset
      if (colorSet !== null) {
        let csArray = colorSet.split(',')
        csArray.splice(7)
        // check is selected colorset not empty and exist key in prefs
        if ((csArray.length == 1) && (csArray[0] in prefs.colorsets)) this.scaleValueColors = [...prefs.colorsets[csArray[0]]]
        if (!this.eventMode) this.scaleValueColors.shift()
        if ((csArray.length > 1)) {
          this.scaleValueColors = this.scaleValueColors.map((color, idx) => (csArray[idx] === undefined) ? color : '#' + csArray[idx])
        }
      } else if (!this.eventMode) this.scaleValueColors.shift()
    },
     // common helper functions
    _arrayEquals(a, b) {
      return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every(el => b.includes(el))
    },
    toggleEdit() {
      this.editAllow = !this.editAllow
    },
    tlChanged() {
      this.changed = true
    },
    _initTimelineView() {
      const _getParamsFromThing = (r) => {
        this.sunset_active = r['configuration']['sunsetActive']
        this.sun_events = r['configuration']['sunEvents']
        this.sunrise_offset = r['configuration']['sunriseOffset']
        this.sunset_offset = r['configuration']['sunsetOffset']
        this.headline = r['configuration']['headline']
        this.switchStates = r['configuration']['states'].map(el => el.split('@')).map(el => [el[0], el[1] === undefined ? el[0] : el[1]])
        this.tl_active = r['configuration']['active']
        this.eventMode = r['configuration']['event']
        this.mode = r['configuration']['mode']
        if (this.eventMode) this.switchStates.unshift(this.content['tf0011'])       // remove state manuell
        this.yAxisLabel = r['configuration']['mode'].sort().map(el => {
          if (el === '17') return this.content['tf0201'][0]
          if (el === '15') return this.content['tf0201'][1]
          if (el === '67') return this.content['tf0201'][9]
          return this.content['tf0201'][parseInt(el) + 1]
        })
        for (let i = 1; i < 8; i++) Vue.set(this.initValue, i, [...r['configuration'][i]])
        this._mapParamColor()
      }
  
      this.editAllow = false
      this.changed = false
      let urlParams = new URLSearchParams(window.location.search)
      this.content = {...(content?.[urlParams.get('lang')] ?? content['en'])}
      this.id = urlParams.get('id')
      this.token = btoa(urlParams.get('token'))                                   // token for REST-Interface
      this.adminSetup = urlParams.has('admin')

      if (!this.adminSetup) {
        // if required id passed as parameter
        if (this.id !== null) {
          tlpThing.get_id(this.id, this.token)
            .then (r => {
              // parse all view releated url parameter
    
              this._getParamsFromURL()            // create all params from url and standard values in extra function
              this.deactivation = urlParams.has('deactivation')
              let zoom = (urlParams.get('zoom') ?? 'auto')
              this.zoomForced = zoom === 'no' ? 'no' : zoom === 'force' ? 'force' : 'auto'
              this.screenChanged()
    
              if (typeof r === 'string' && r.includes('error:')) {
                console.log('id and/ or thing dosent exist, questiion: should be create?')
                // message id dosen't exist
                // question: create or abort
                // when cancel stop and show note
                // when ok than start creating thing and or channel
                
                this._setMessageInHTML('tf0005', 'tf0110', 'tf0012', 0)
                this._setMessageButtons(true, 'tf0001', 'tf0003', '_setMessageBreak','_createNewTimeline')
              } else {
                // check for parameter conf
                // conf == ui -> drop url parameter
                // conf == params -> url parameter are relevant, check for changes (default)
                let conf = urlParams.get('conf') ?? 'params'
    
                switch (conf) {
                  case ('params'): {
                    // compare parameter in thing and url | check : mode, states, event
                    let tlpParamsEqual = true
                    if (urlParams.has('event') !== r['configuration']['event']) tlpParamsEqual = false
                    if (urlParams.get('states')) {
                      let urlOnlyStates = urlParams.get('states').split(',').map(el => el.split('@')).map(el => el[0].toUpperCase())
                      let thingOnlyStates = r['configuration']['states'].map(el => el.split('@')).map(el => el[0].toUpperCase())
                      urlOnlyStates.splice(6)
                      if (!this._arrayEquals(urlOnlyStates,thingOnlyStates)) tlpParamsEqual = false
                    }
                    if (urlParams.get('mode')) {
                      if (!this._arrayEquals(urlParams.get('mode').split(','),(r['configuration']['mode']))) tlpParamsEqual = false
                    }
    
                    _getParamsFromThing(r)            // create all params from thing
                    if (!tlpParamsEqual) {
                      // create all params from url and standard values or hold the thing params
                      // extract tlp- params from thing
                      // contine -> url param's have high priority -> this means: create a new timeline with the same id (update this id)
                      this._setMessageInHTML('tf0007', 'tf0111', 'tf0116', 1)
                      this._setMessageButtons(true, 'tf0001', 'tf0002', '_setMessageInHTML', '_createNewTimeline')   // function for creating a new timeline with current parameter
                    } else this._setMessageInHTML()   // parameter are different -> warn message, ask if continue
                    break
                  }
                  case ('ui'): {
                    _getParamsFromThing(r)            // create all params from thing; changes are possible in setup area
                    this._setMessageInHTML('')
                    break
                  }
                  default: this._setMessageInHTML('tf0005', 'tf0114', '', 0)    // parameter conf with wrong value in url
                }
              }
            })
            .catch((err) => { console.log(err) })     // prüfen, ob Abarbeitung des Fehlers notwendig ist !! to do !!
        } else this._setMessageInHTML('tf0005', 'tf0114')
      }
    },
    setCurrentSwitchState(key) {
      this.currSwitchstate = key
    },
    saveTimeline() {
      // this function copy's the data from day 1 or day 6 into the other days then mode 15,17 or 67 selected
      // better commend is nessesary
      const mapDays = (day) => {
        if (this.mode.includes('17')) return '1'
        if (this.mode.includes('15') && ['2','3','4','5'].some(el => day === el)) return '1'
        if (this.mode.includes('67') && (day === '7')) return '6'
        return day
      }
      const getLinkedItemsFromURL = () => {
        let urlParams = new URLSearchParams(window.location.search)
        return (urlParams.get('linkedItems') ?? '').split(',')
      }
      const data = {
          "uid": `tlpicker:tlp:home:${this.id}`,                        // value for id: the real id
          "id": this.id,                                                // unique id for each time line
          "channelTypeUID": "tlp:timeline",                             // könnte notwendig sein ??? (wenn ja muss der wert zenztal gespeichert werden)
          "defaultTags": [],
          "properties": {},
          "configuration": {
            "headline": this.headline,                                  // show this in the timelinepicker widget
            "mode": this.mode,                                          // 
            "states": this.switchStates.map(el => `${el[0]}@${el[1]}`), // switch states, "manuell" will be automatic added when event mode active
            "linkedItems": getLinkedItemsFromURL(),                     // items to switch; note: this items are only valid when for this id no config in file exist
            "event": this.eventMode,                                    // true .. event mode active, false .. event mode inactive
            //"lastItemState": null,                                      // stores the last switch state for event mode (internal use)                   // this is not nessesary, can be removed !!!!!!!!
            "active": this.tl_active,     //prüfen                      // true .. timeline active, false ..  timeline temporaly inactive
            "sunEvents": this.sun_events,                               // true .. sunset/sunrise active, false .. sunset/sunrise inactive
            "sunriseOffset": this.sunrise_offset,                       // sunrise offset
            "sunsetOffset": this.sunset_offset,                         // sunset offset
            "1": this.initValue[mapDays('1')],                          // key for monday to sunday
            "2": this.initValue[mapDays('2')],                          // 96 entry's for each 15min of day
            "3": this.initValue[mapDays('3')],                          // 
            "4": this.initValue[mapDays('4')],                          // 
            "5": this.initValue[mapDays('5')],                          // 
            "6": this.initValue[mapDays('6')],                          //
            "7": this.initValue[mapDays('7')]                           //
          }
        }

      tlpThing.update_id(data, this.token)
        .then(r => {
          this.changed = false
          console.log(`tlp id ${data.id} - update succeed`)
          this._triggerOH_rule()
        })
        .catch(err => console.log(err))
    },
    discardChanges() {
      this._initTimelineView()
    },
    activateSettings() {
      this.settingCurrent = true
    },
    // --- function for setup --------------
    singlesetup_action(param) {
      if (param[0] === 'abort') this.settingCurrent = false
      if (param[0] === 'save') {
        this.sun_events = param[1]['sun_events']
        this.sunset_offset = param[1]['sunset_offset']
        this.sunrise_offset = param[1]['sunrise_offset']
        this.headline = param[1]['headline']
        this.switchStates = param[1]['switchStates'].map(el => [...el])
        this.settingCurrent = false

        // remove sun events when action is deactivated
        if (!this.sun_events) {
          Object.keys(this.initValue).forEach(el => {
            this.initValue[el].forEach((j,idx) => { if (j > 10) Vue.set(this.initValue[el], idx, j - Math.floor(j/10) * 10) })
          })
        }
        this.saveTimeline()
      }
    },
    select_sun_item(key) {
      this.sun_active_item = key
    },
    toggleDisable() {
      this.tl_active = !this.tl_active
      if (this.debounceTimer != null) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(this._debounceTimerFunc, 2000)
    },
    _triggerOH_rule() {
      const toggle_tlpTriggeritem = (currState) => {
        tlpItem.sendCommand('tlpTrigger', this.token, currState !== 'trigger1' ? 'trigger1' : 'trigger2')   // toggle helper item betwenn two values, this will trigger the rule
          .catch(err => console.log(err))
      }
      const innerFct_Item = (r) => {
        if (r === null) {
          tlpItem.updateItem('tlpTrigger', this.token)                    // create helper item
            .then(r1 => toggle_tlpTriggeritem(r1.state))
            .catch(err => console.log(err))
          return
        }
        toggle_tlpTriggeritem(r.state)
      }

      tlpItem.checkItem('tlpTrigger', this.token)                         // check exist helper item
        .then(r => innerFct_Item(r))
        .catch(err => console.log(err))
    },
    _debounceTimerFunc() {
      if (this.tl_active != this.initValue["active"]) {
        this.initValue["active"] = this.tl_active
        this.saveTimeline()
      }
      this.debounceTimer = null
    },
    screenChanged(event) {
      //this.screenWidth = document.documentElement.clientWidth;
      //this.screen Height = document.documentElement.clientWidth;
      
      // recognize device type
      if(navigator.userAgent.match(/mobile/i)) {
        this.device = 'Mobile'
      } else if (navigator.userAgent.match(/iPad|Android|Touch/i)) {
        this.device = 'Tablet'
      } else {
        this.device = 'Desktop'
      }
      // set zoom variables for presentation in sitemap
      this.zoomVisible = ((this.device != 'Desktop') && (this.zoomForced != 'no')) ? true : false
      if (this.zoomForced == 'force') this.zoomVisible = true

      // recognize device orientation
      if (window.matchMedia("(orientation: portrait)").matches) this.orientation = 'portrait' 
      if (window.matchMedia("(orientation: landscape)").matches) this.orientation = 'landscape' 
    }
  }
})