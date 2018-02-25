const InvalidGeolocationProvided = require('./InvalidGeolocationProvided')

const isNumeric = n =>
  !Number.isNaN(parseFloat(n)) && Number.isFinite(n)

const isCoordinate = geolocation =>
  Object.keys(geolocation).length === 2 &&
  isNumeric(geolocation.latitude) &&
  isNumeric(geolocation.longitude)

module.exports = {
  tryValidate: event => new Promise((resolve, reject) => {
    if (isCoordinate(event.geolocation)) {
      resolve(event)
    } else {
      reject(new InvalidGeolocationProvided(`${JSON.stringify(event.geolocation)} is not a geolocation`))
    }
  })
}
