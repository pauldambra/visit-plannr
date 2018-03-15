const geolocationValidator = require('../../destinations/location-validation/geolocationValidator')
const expect = require('chai').expect
const InvalidGeoLocationProvided = require('../../destinations/location-validation/InvalidGeolocationProvided')

describe('validating geolocations', function () {
  it('identifies valid co-ordinates', function (done) {
    geolocationValidator
      .tryValidate({
        event: {
          geolocation: {latitude: 0, longitude: 1}
        }
      })
      .then(() => done())
      .catch(done)
  })

  it('(because dynamodb seems to necessitate it) can parse string values from valid co-ordinates', function (done) {
    geolocationValidator
      .tryValidate({
        event: {
          geolocation: {latitude: '0.12', longitude: '1.23'}
        }
      })
      .then(() => done())
      .catch(done)
  })

  it('can flag proposed locations with invalid locations', function (done) {
    geolocationValidator
      .tryValidate({
        event: {
          geolocation: 'not valid?'
        }
      })
      .then(() => {
        done('oh! oh!')
      })
      .catch(err => {
        expect(err).to.exist
          .and.be.instanceof(InvalidGeoLocationProvided)
          .and.have.property('message', '{"geolocation":"not valid?"} does not have a valid geolocation. Found: {"hasGeolocation":true,"geolocationHasTwoKeys":false,"latitudeIsNumeric":false,"longitudeIsNumeric":false}')
        done()
      })
  })
})
