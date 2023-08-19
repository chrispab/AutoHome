// timeline/ timepicker tlpSingle Setup
// version 3.0.2
// ToSe 

/////////////////////////////////////////////////////////////////////////////////////
/*
next steps:

*/
/////////////////////////////////////////////////////////////////////////////////////

const tlpSingleSetup = {
  template: `
    <div class="singleSetup">
      <section>
        <section class="siS-sec">
          <div class="siS-headline">
            {{content.tf0008}}
          </div>
          <div class="siS-workingArea siS-headline1">
            <span>{{headline}}</span>
            <div class="mdl-textfield mdl-js-textfield has-placeholder">
              <input class="mdl-textfield__input" type="text" :id="headline" :placeholder="headline" v-model="headline">
            </div>
          </div>
        </section>
        <section class="siS-sec">
          <div class="siS-headline">
            {{content.tf0118}}
          </div>
          <div class="siS-workingArea">
            <div class="siS-sunEvents_activ">
              <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="tlp_sw1">
                <input type="checkbox" id="tlp_sw1" class="mdl-switch__input"  v-model="sun_events"/>
                <span class="mdl-switch__label">{{content.tf0203}}</span>
              </label>
            </div>
            <div class="siS-controls-row">
              <div>{{content.tf0120}}</div>
              <div class="siS-controls-sunOffset"><span v-if="sunrise_offset > 0">+</span>{{sunrise_offset}} h</div>
              <div>
                <input class="mdl-slider mdl-js-slider" type="range"  min="-5" max="5" step="0.25" tabindex="0" v-model="sunrise_offset" :disabled="!sun_events"/>
              </div>
            </div>
            <div class="siS-controls-row">
              <div>{{content.tf0121}}</label>
              </div>
              <div class="siS-controls-sunOffset"><span v-if="sunset_offset> 0">+</span>{{sunset_offset}} h</div>
              <div>
                <input class="mdl-slider mdl-js-slider" type="range"  min="-5" max="5" step="0.25" tabindex="0" v-model="sunset_offset" :disabled="!sun_events"/>
              </div>
            </div>
          </div>
        </section>
        <section class="siS-sec">
          <div class="siS-headline">
            {{content.tf0119}}
          </div>
          <div class="siS-workingArea">
            <div class="siS-alias-row">
              <div v-for="(el,idx) in switchStates" :key="idx">
                <span>{{el[0]}} -</span>
                <div class="mdl-textfield mdl-js-textfield has-placeholder">
                  <input class="mdl-textfield__input" type="text" :id="idx" :placeholder="el[1]" v-model="switchStates[idx][1]">
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <section class="siS-controls">
        <button class="mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect mdl-button--accent" @click="sendControls('abort')">{{content.tf0001}}</button>
        <button class="mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect mdl-button--accent" @click="sendControls('save')">{{content.tf0000}}</button>
      </section>
    </div>
  `,
  data: function() {
    return {
      sun_events: false,
      sunset_offset: 0,
      sunrise_offset: 0,
      headline: '',
      switchStates: [],
    }
  },
  props: {
    content: {},
    params: {},
  },
  created() {
    this.sun_events = this.params['sun_events']
    this.sunset_offset = this.params['sunset_offset']
    this.sunrise_offset = this.params['sunrise_offset']
    this.headline = this.params['headline']
    this.switchStates = this.params['switchStates'].map(el => [...el])
  },
  methods: {
    sendControls(val) {
      this.$emit('clicked',[val, {
         'sun_events' : this.sun_events,
         'sunset_offset' : this.sunset_offset,
         'sunrise_offset' : this.sunrise_offset,
         'headline' : this.headline,
         'switchStates' : this.switchStates
      }])
    },
  }
}
export default tlpSingleSetup