const geolocationValidator = require('../destinations/geolocationValidator')
const expect = require('chai').expect
const InvalidGeoLocationProvided = require('../destinations/InvalidGeolocationProvided')

describe('validating geolocations', function () {
  it('identifies valid co-ordinates', function (done) {
    geolocationValidator
      .tryValidate({
        geolocation: {latitude: 0, longitude: 1}
      })
      .then(() => done())
      .catch(done)
  })

  it('can flag proposed locations with invalid locations', function (done) {
    geolocationValidator
      .tryValidate({
        geolocation: 'not valid?'
      })
      .then(() => {
        done('oh! oh!')
      })
      .catch(err => {
        expect(err).to.exist
          .and.be.instanceof(InvalidGeoLocationProvided)
          .and.have.property('message', '"not valid?" is not a geolocation')
        done()
      })
  })
})
