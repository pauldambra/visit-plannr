
const applyDestinationProposed = (model, event) => {
  if (event.type === 'destinationProposed') {
    model.name = event.name
    model.geolocation = event.geolocation
  }
  return model
}

const applyGeolocationValidationResult = (model, event) => {
  if (event.type === 'geolocationValidationSucceeded') {
    model.status = 'valid'
  }
  if (event.type === 'geolocationValidationFailed') {
    model.status = 'failed'
  }
  return model
}

module.exports = {
  apply: events => events.reduce((model, event) => {
    model = applyDestinationProposed(model, event)
    model = applyGeolocationValidationResult(model, event)
    return model
  }, {status: 'pending'})
}
