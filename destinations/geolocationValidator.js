const InvalidGeolocationProvided = require('./InvalidGeolocationProvided')

const strictlyParseFloat = n => {
  if (/^(-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(n)) {
    return Number(n)
  }
  return NaN
}

const isNumeric = n =>
  !Number.isNaN(strictlyParseFloat(n)) && Number.isFinite(n)

module.exports = {
  tryValidate: dynamoDbEvent => new Promise((resolve, reject) => {
    const coordinateValidation = {
      hasGeolocation: dynamoDbEvent.event.hasOwnProperty('geolocation'),
      geolocationHasTwoKeys: Object.keys(dynamoDbEvent.event.geolocation).length === 2,
      latitudeIsNumeric: isNumeric(strictlyParseFloat(dynamoDbEvent.event.geolocation.latitude)),
      longitudeIsNumeric: isNumeric(strictlyParseFloat(dynamoDbEvent.event.geolocation.longitude))
    }

    const isCoordinate =
      coordinateValidation.hasGeolocation &&
      coordinateValidation.geolocationHasTwoKeys &&
      coordinateValidation.latitudeIsNumeric &&
      coordinateValidation.longitudeIsNumeric

    if (isCoordinate) {
      resolve(dynamoDbEvent.event)
    } else {
      reject(new InvalidGeolocationProvided(
        `${JSON.stringify(dynamoDbEvent.event)} does not have a valid geolocation. Found: ${JSON.stringify(coordinateValidation)}`
      ))
    }
  })
}
