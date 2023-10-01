// timeline/ timepicker thing controller
// version 3.0.3
// ToSe 

/////////////////////////////////////////////////////////////////////////////////////
/*
next steps:

*/
/////////////////////////////////////////////////////////////////////////////////////

import tlpItem from "./tlp_item_controller.js"

const openHAB_url = window.location.origin
const timeLinePickerUID = 'tlpicker:tlp:home'

class tlpThing {

  // get and check timelinepicker thing
  static get(token) {
    return new Promise((resolve, reject) => {
      try {
        const myHeaders = new Headers()
        myHeaders.append('Accept', 'application/json')
        myHeaders.append('Authorization', 'Basic ' + token)

        const myRequest = new Request(openHAB_url + '/rest/things/' + timeLinePickerUID , {
          method: 'GET',
          headers: myHeaders,
          mode: 'cors',           // notwendig ????
          cache: 'default',       // was passiert hier ???
        })

        resolve(
          fetch(myRequest)
            .then(response => response.json())
            .then(data => { return data })
            .catch(err => console.log(err))
        )
      } catch(err) {
        reject(err)
      }
    })
  }

  // create timelinepicker thing
  static create(token) {
    const tlpThing = {
      "label": "TimelinePicker",
      "UID": 'tlpicker:tlp:home',
      "thingTypeUID": "tlpicker:tlp",
      "channels": [],
      "editable": true
    }

    return new Promise((resolve, reject) => {
      try {
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        myHeaders.append('Authorization', 'Basic ' + token)

        const myRequest = new Request(openHAB_url + '/rest/things', {
          method: 'POST',
          headers: myHeaders,
          mode: 'cors',           // notwendig ????
          body: JSON.stringify(tlpThing)
        })

        resolve(
          fetch(myRequest)
            .then(response => response.json())
            .then(data => { return data })
            .catch(err => console.log(err))
        )
      } catch(err) {
        reject(err)
      }
    })
  }

  // update timelinepicker thing
  static update = (tlpThing, token) => {
    return new Promise(async (resolve, reject) => {
      try {
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        myHeaders.append('Authorization', 'Basic ' + token)

        const myRequest = new Request(openHAB_url + '/rest/things/' + timeLinePickerUID, {
          method: 'PUT',
          headers: myHeaders,
          mode: 'cors',           // notwendig ????
          body: JSON.stringify(tlpThing)
        })

        resolve(
          fetch(myRequest)
            .then(r => r.json())
            .then(r => { return r })
            .catch(err => console.log(err))
        )
      } catch(err) {
        reject(err)
      }
    })
  }

  // remove timelinepicker thing and ALL single timelines
  static complete_remove(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        myHeaders.append('Authorization', 'Basic ' + token)

        const myRequest = new Request(openHAB_url + '/rest/things/' + timeLinePickerUID + '?force=true', {
          method: 'DELETE',
          headers: myHeaders,
          mode: 'cors',           // notwendig ????
          body: JSON.stringify(tlpThing)
        })

        // remove the tlp helper item for triggering OH rule then exist
        tlpItem.removeItem('tlpTrigger', token)
        
        resolve(
          fetch(myRequest)
            .then(r => { return [] })
            .catch(err => console.log(err))
        )
      } catch(err) {
        reject(err)
      }
    })
  }

  // check if timelinepicker exist
  static get_id(id, token) {
    // get tlpThing
    // extract channels
    // check exist entry with this id

    return new Promise((resolve, reject) => {
      try {
        resolve(
          this.get(token)
            .then(r => {
              if (r['error'] === undefined) return r
              throw "error: the thing timelinepicker dosen't exist"
            })
            .then(r => {
              const idx = r['channels'].findIndex(el => el['id'] === id)
              return ((idx === -1) ? "error: the id dosen't exist" : r['channels'][idx])
            })
            .catch(err => {return err})
        )
      } catch (err) {
        reject(err)
      }
    })

  }

  // update or create single timeline and update thing
  static async update_id(data, token) {
    let tlpThing = await this.get(token)
    if ('error' in tlpThing) tlpThing = await this.create(token)

    let channels = tlpThing['channels']
    let idx = channels.findIndex(el => el['id'] === data['id'])
    if (idx !== -1) {
      tlpThing['channels'].splice(idx, 1, data)
    } else tlpThing['channels'].push(data)

    return new Promise((resolve, reject) => {
      resolve(
        this.update(tlpThing, token)
          .then(r => { return r })
          .catch(err => console.log(err))
      )
    })
  }

  // return all single timeline id's and headline
  static async getAll_id(token) {
    let tlpThing = await this.get(token)
    if ('error' in tlpThing) return {'error' : 'timeline picker thing dose not exist'}

    return new Promise((resolve, reject) => {
      resolve(
        tlpThing['channels']
      )
    })
  }

  // remove a single timelines
  static async remove_id(id, token) {
    let tlpThing = await this.get(token)
    if ('error' in tlpThing) return {'error' : 'timeline picker thing dose not exist'}

    let channels = tlpThing['channels']
    let idx = channels.findIndex(el => el['id'] === id)
    if (idx !== -1) tlpThing['channels'].splice(idx, 1)

    return new Promise((resolve, reject) => {
      if (tlpThing['channels'].length !== 0) {
        resolve(
          this.update(tlpThing, token)
            .then(r => { return r['channels'] })
            .catch(err => console.log(err))
            )
      } else {
        resolve(
          this.complete_remove(token)
            .then(r => { return r['channels'] })
            .catch(err => console.log(err))
        )
      } 
    })
  }

  // add an item to a existing timelinepicker
  // remove an item from existing timelinepicker
}
export default tlpThing