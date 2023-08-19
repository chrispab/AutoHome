// timeline/ timepicker admin
// version 3.0.2
// ToSe 

/////////////////////////////////////////////////////////////////////////////////////
/*
next steps:

*/
/////////////////////////////////////////////////////////////////////////////////////

import tlpThing from './tlp_thing_controller.js'
import tlpItem from './tlp_item_controller.js'

const tlpAdminSetup = {
  template: `
    <div class="adminSetup">
      <div class="adminHeader">
        <div>Timeline picker setup</div>
        <div v-if="markedID !== null" class="adminSetup-button" @click="uncheckID">
          {{content.tf0001}}
        </div>
      </div>
      <section class="adminSetup-sunItems">
        <div>
          <div>
            <i class="material-icons">
              <span v-if="sunriseState === false" class="adminSetup-sinItems-1">highlight_off</span>
              <span v-else-if="sunriseState === true" class="adminSetup-sinItems-2">check_circle_outline</span>
              <span v-else>help_outline</span>
            </i>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" id="sunriseID" placeholder="" v-model="sunriseItem" @change="_checkSunItems('sunriseSave')">
            <label class="mdl-textfield__label" for="sunriseID">item name for sunrise</label>
          </div>
          <div v-if="sunriseSave" class="adminSetup-button" @click="_abortSavingSunItem('sunrise')"><i class="material-icons">close</i></div>
          <div v-if="sunriseSave" class="adminSetup-button adminSetup-confirm" @click="_saveSunItem('sunriseItem')">
            {{content.tf0000}}
          </div>
        </div>
        <div>
          <div>
            <i class="material-icons">
              <span v-if="sunsetState === false" class="adminSetup-sinItems-1">highlight_off</span>
              <span v-else-if="sunsetState === true" class="adminSetup-sinItems-2">check_circle_outline</span>
              <span v-else>help_outline</span>
            </i>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" id="sunsetID" placeholder="" v-model="sunsetItem" @change="_checkSunItems('sunsetSave')">
            <label class="mdl-textfield__label" for="sunsetID">item name for sunset</label>
          </div>
          <div v-if="sunsetSave" class="adminSetup-button" @click="_abortSavingSunItem('sunset')"><i class="material-icons">close</i></div>
          <div v-if="sunsetSave" class="adminSetup-button adminSetup-confirm" @click="_saveSunItem('sunsetItem')">
            {{content.tf0000}}
          </div>
        </div>
      </section>
      <section class="adminSetup-list">
        <div v-for="(el,idx) of timelines"
          :key=idx
          class="adminSetup-listentry"
        >
          <div class="adminSetup-info">
            <div>id: {{el.id}}</div>
            <div>{{el.headline}}</div>
          </div>
          <div v-if="idx !== markedID" class="adminSetup-button" @click="removeID(idx)">
            {{content.tf0112}}
          </div>
          <div v-else class="adminSetup-button adminSetup-confirm" @click="removeID(idx)">
            {{content.tf0113}}
          </div>
          </div>
        <div v-if="timelines.length === 0" class="adminSetup-empty">
          {{content.tf0117}}
        </div>
      </section>
    </div>
  `,
  data: function() {
    return {
      timelines: [],
      markedID: null,
      sunriseItem: null,
      sunsetItem: null,
      sunriseState: null,
      sunsetState: null,
      sunriseSave: false,
      sunsetSave: false
    }
  },
  props: {
    content: {},
    token: ''
  },
  created() {
    this._initAdminSetupView()
  },
  methods: {
    removeID(idx) {
      if (this.markedID === idx) {
        this.markedID = null
        tlpThing.remove_id(this.timelines[idx]['id'], this.token)
          .then(r => this.timelines = this._mapChannels(r))
      } else this.markedID = idx
    },
    uncheckID() {
      this.markedID = null
    },
    _initAdminSetupView() {
      tlpThing.getAll_id(this.token)
        .then(r => {
          this.timelines = this._mapChannels(r)
        })
        tlpThing.get(this.token)
          .then(r => {
            this.sunriseItem = r['configuration']?.sunriseItem  ?? null
            this.sunsetItem = r['configuration']?.sunsetItem ?? null
            this._checkSunItems(null)
          })
    },
    _mapChannels(val) {
      return Array.isArray(val) ? val.map(el => {return {'id': el['id'], 'headline': el['configuration']['headline']}}) : []
    },
    _checkSunItems(val) {
      if (val !== null) this[val] = true

      if ((this.sunriseItem !== null) && (this.sunriseItem !== '')) {
        tlpItem.checkItem(this.sunriseItem, this.token)
          .then(r => this.sunriseState = r ? true : false)
      } else this.sunriseState = null
      if ((this.sunsetItem !== null) && (this.sunsetItem !== '')) {
        tlpItem.checkItem(this.sunsetItem, this.token)
          .then(r => this.sunsetState = r ? true : false)
      } else this.sunsetState = null
    },
    _saveSunItem(val) {
      tlpThing.get(this.token)
        .then(r => {
          r['configuration'][val] = this[val]
          tlpThing.update(r, this.token)
            .then(console.log('tlp config updated'))
            .catch(err => console.log(err))
        })
      if (val === 'sunriseItem') this.sunriseSave = false
      if (val === 'sunsetItem') this.sunsetSave = false
    },
    _abortSavingSunItem(val) {
      console.log(val)
      if (val === 'sunrise') {
        tlpThing.get(this.token)
        .then(r => {
          if (val === 'sunrise') {
            this.sunriseItem = r['configuration']?.sunriseItem  ?? null
            this.sunriseSave = false
          }
          if (val === 'sunset') {
            this.sunsetItem = r['configuration']?.sunsetItem  ?? null
            this.sunsetSave = false
          }
          this._checkSunItems(null)
        })

      }
    }
  }
}
export default tlpAdminSetup