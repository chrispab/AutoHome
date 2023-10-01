// timeline/ timepicker timeline inactive
// version 3.0.2
// ToSe 

/////////////////////////////////////////////////////////////////////////////////////
/*
next steps:

*/
/////////////////////////////////////////////////////////////////////////////////////

import content from './content.js'

const tlInactive = {
  template:`
    <div id="overlayDisable">
      <div id="overlayDisableContent">
        <div>{{tf0202}}</div>
        <div id="reactivate" class="activation" @click="reactivate">
          <div>{{tf0203}}</div>
        </div>
      </div>
    </div>
  `,
  props: {
    tf0202: '',
    tf0203: ''
  },
  methods: {
    reactivate() {
      this.$emit('click')
    }
  }
}
export default tlInactive