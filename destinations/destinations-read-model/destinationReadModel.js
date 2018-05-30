
module.exports = {
  apply: events => events.reduce((model, event) => {
    switch (event.type) {
      case 'destinationProposed':
        model.name = event.name
        model.geolocation = event.geolocation
        break
      case 'geolocationValidationSucceeded':
        model.status = 'valid'
        break
      case 'geolocationValidationFailed':
        model.status = 'failed'
        break
    }

    return model
  }, {status: 'pending'})
}
