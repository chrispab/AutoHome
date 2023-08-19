// timeline/ timepicker time scale
// version 3.0.2
// ToSe 

/////////////////////////////////////////////////////////////////////////////////////
/*
next steps:

*/
/////////////////////////////////////////////////////////////////////////////////////

const timeScale = {
  template: `
    <div class="day"
      @mouseleave="focus('leave')"
      @mouseup="mouseLeftUp()"
      @touchend="touchEnd"
    >
      <div v-for="i in _range()" class="unit"
        :key="i"
        :style="{background: _getBackground(i)}"
        :class="{lineL: i == 0}"
        :data-tpidx="i"
        @mouseenter="mouseMove(i)"
        @mousedown="mouseLeftDown(i)"
        @touchstart="touchStart"
        @touchmove="touchMove"
      >
        <div :class="{lineR: (i+1) % 4 == 0}"></div>
        <div :class="{lineR: (i+1) % 4 == 0, sunLine : _sunLine(i)}"></div>
        <div class="sunanchor" v-if="_placeSunEvent(i, null)">
          <div class="sunWrapper">
            <div class="sun"><i class="material-icons">wb_sunny</i></div>
            <div class="cross" v-if="_placeSunEvent(i, 'notSun')"><i class="material-icons">close</i></div>
          </div>
        </div>
        <div :class="{lineR: (i+1) % 4 == 0}"></div>
        <div :class="{lineR: (i+1) % 2 == 0}"></div>
        <div class="lineR"></div>
        <div class="lineR" :style="{background: _eventLine(i)}"></div>
      </div>
    </div>
  `,
  data: function() {
    return {
      mouseLeftPressed: false,
      previousDragIndex: -1,
      touchStarted: false,
    }
  },
  props: {
    indexLine: "",
    zoomFactor: { type: Number },
    currTime: { type: Number },
    currSwitchstate: 0,
    sunActiveItem: 0,
    eventMode: {
      type: Boolean,
      default: true,
    },
    editAllow: false,
    scaleColors: {
      type: Array,
      default: function() { return [] }
    },
    initValue: {
      type: Object,
      default: function() { return {} }
    }
  },
  computed: {
    scaleSegmentWidth() {
      return ('calc(100% / 96 * ' + this.zoomFactor + ')')
    },
    sunEventPosition() {
      let positions = []
      let lastValue = this.initValue[this.indexLine][0]
      let lastIdx = 0
      
      this.initValue[this.indexLine].forEach((el, idx) => {
        if (el !== lastValue) {
          if (lastValue > 10) {
            positions.push({
              pos: Math.floor((idx + lastIdx) / 2),
              key: lastValue
            })
          }
          lastValue = el
          lastIdx = idx
        }
      })
      if (lastValue > 10) {
        positions.push({
          pos: Math.floor((this.initValue[this.indexLine].length + lastIdx) / 2),
          key: lastValue
        })
      }
      return positions
    }
  },
  methods: {
    focus(val) {
      if (this.editAllow) {
        this.mouseLeftPressed = false
        this.previousDragIndex = -1
      }
    },
    touchStart() {
      if (this.editAllow) {
        this.previousDragIndex = -1
        this.touchStarted = true
      }
    },
    touchEnd() {
      this.previousDragIndex = -1
      this.touchStarted = false
    },
    touchMove(event) {
      if (!this.touchStarted) return

      var touchLocation = event.touches[0];
      let el = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
      let unitElement = el.parentElement
      if (unitElement && unitElement.className === "unit") {
        // Touch over scale
        let idx = unitElement.getAttribute("data-tpidx")
        let setState = (this.eventMode && (this.currSwitchstate == 0)) ? 0 : this.currSwitchstate
        if (this.sunActiveItem !== 0) setState = setState + this.sunActiveItem * 10
        if (this.previousDragIndex > 0) {
          let start = Math.min(this.previousDragIndex, idx)
          let end = Math.max(this.previousDragIndex, idx)
          for (let i = start; i <= end; i++) {
            Vue.set(this.initValue[this.indexLine], i, setState + 1);
          }
        } else {
          Vue.set(this.initValue[this.indexLine], idx, setState + 1);
        }
        this.onModifyData()
        this.previousDragIndex = idx
        event.preventDefault()
      } else {
        // Touch over wrong element
        this.previousDragIndex = -1
        this.touchStarted = false
      }
    },
    mouseMove(idx) {
      if (this.editAllow && this.mouseLeftPressed) {
        let setState = (this.eventMode && (this.currSwitchstate == 0)) ? 0 : this.currSwitchstate
        if (this.sunActiveItem !== 0) setState = setState + this.sunActiveItem * 10
        let start = Math.min(this.previousDragIndex, idx)
        let end = Math.max(this.previousDragIndex, idx)
        for (let i = start; i <= end; i++) Vue.set(this.initValue[this.indexLine], i, setState + 1)
        this.previousDragIndex = idx
      }
    },
    mouseLeftDown(idx) {
      if (this.editAllow) {
        this.mouseLeftPressed = true
        this.previousDragIndex = idx;
        let setState = (this.eventMode && (this.currSwitchstate == 0)) ? 0 : this.currSwitchstate
        if (this.sunActiveItem !== 0) setState = setState + this.sunActiveItem * 10
        Vue.set(this.initValue[this.indexLine], idx, setState + 1)
        this.onModifyData()
      }
    },
    mouseLeftUp() {
      if (this.editAllow) {
        this.mouseLeftPressed = false
        this.previousDragIndex = -1
      }
    },
    onModifyData() {
      this.$emit('clicked')
    },
    _getBackground(idx) {
      let baseSwitchValue = this.initValue[this.indexLine][idx] - 1
      let originSwitchState = baseSwitchValue % 10
      return this.scaleColors[originSwitchState]
    },
    _sunLine(idx) {
      // let options = Math.floor(baseSwitchValue / 10)
      // if options greather than 0 --> progress some options
      return Math.floor((this.initValue[this.indexLine][idx] - 1) / 10) > 0 ? true : false
    },
    _placeSunEvent(i, event) {
      let el = this.sunEventPosition.find(el => el.pos == i)
      if (el) {
        if (event === null) return true
        return (el.key > 9 && el.key < 20) && event === 'notSun' ? true : false
      }
      return false
    },
    _eventLine(idx) {
      if ((this.initValue[this.indexLine][idx] - 1) === -1) return this.scaleColors[0]
    },
    _range() {
      let start = this.currTime - (24 / this.zoomFactor/2)
      if (start < 0) start = 0
      if ((start + (24 / this.zoomFactor)) > 24) start = 24 * (1 - 1 / this.zoomFactor)
      start = start * 4
      let diff = 96 / this.zoomFactor
      return [...Array(diff)].map((_, idx) => start + idx)
    }
  }
}
export default timeScale