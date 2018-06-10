
module.exports = {
  apply: events => {
    const readModel = events.reduce((model, event) => {
      switch (event.type) {
        case 'destinationProposed':
          model.name = event.name
          model.geolocation = event.geolocation
          model.timestamp = event.timestamp
          break
        case 'geolocationValidationSucceeded':
          model.status = 'locationValidated'
          break
        case 'geolocationValidationFailed':
          model.status = 'failed'
          break
      }

      return model
    }, {status: 'pending', type: 'destination'})

    console.log(`built readmodel ${JSON.stringify(readModel)} from events ${JSON.stringify(events)}`)
    return readModel
  }
}
