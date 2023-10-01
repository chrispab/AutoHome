// timeline/ timepicker item controller
// version 3.0.3
// ToSe 

/////////////////////////////////////////////////////////////////////////////////////
/*
next steps:

*/
/////////////////////////////////////////////////////////////////////////////////////

const openHAB_url = window.location.origin
const timeLinePickerUID = 'tlpicker:tlp:home'

const tlpItem = class {

  // get and check item
  static checkItem(item, token) {
    return new Promise((resolve, reject) => {
      try {
        const myHeaders = new Headers()
        myHeaders.append('Accept', 'application/json')
        myHeaders.append('Authorization', 'Basic ' + token)

        const myRequest = new Request(openHAB_url + '/rest/items/' + item , {
          method: 'GET',
          headers: myHeaders,
          mode: 'cors',           // notwendig ????
          cache: 'default',       // was passiert hier ???
        })

        resolve(
          fetch(myRequest)
            .then(response => response.json())
            .then(r => { return r['error'] === undefined ? r : null })
            .catch(err => console.log(err))
        )
      } catch(err) {
        reject(err)
      }
    })
  }

  // update and/or create item
  static updateItem(item, token) {
    return new Promise((resolve, reject) => {
      try {
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        myHeaders.append('Accept', 'application/json')
        myHeaders.append('Authorization', 'Basic ' + token)

        const itemContent = {
            "type": "String",
            "name": item,
            "label": item
        }

        const myRequest = new Request(openHAB_url + '/rest/items/' + item, {
          method: 'PUT',
          headers: myHeaders,
          body: JSON.stringify(itemContent)
        })

        resolve(
          fetch(myRequest)
            .then(response => response.json())
            .then(r => { return r })
            .catch(err => console.log(err))
        )
      } catch(err) {
        reject(err)
      }
    })
  }

    // send command to item
    static sendCommand(item, token, command) {
      return new Promise((resolve, reject) => {
        try {
          const myHeaders = new Headers()
          myHeaders.append('Content-Type', 'text/plain')
          myHeaders.append('Authorization', 'Basic ' + token)
  
          const myRequest = new Request(openHAB_url + '/rest/items/' + item, {
            method: 'POST',
            headers: myHeaders,
            body: command
          })
  
          resolve(
            fetch(myRequest)
              // .then(response => response.json())
              .then(data => { return data })
              .catch(err => console.log(err))
          )
        } catch(err) {
          reject(err)
        }
      })
    }

  // remove item
  static removeItem(item, token) {
    return new Promise((resolve, reject) => {
      try {
        const myHeaders = new Headers()
        myHeaders.append('Accept', 'application/json')
        myHeaders.append('Authorization', 'Basic ' + token)

        const myRequest = new Request(openHAB_url + '/rest/items/' + item, {
          method: 'DELETE',
          headers: myHeaders
        })

        resolve(
          fetch(myRequest)
            .catch(err => console.log(err))
        )
      } catch(err) {
        reject(err)
      }
    })
  }
}
export default tlpItem