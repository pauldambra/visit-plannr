const geolocationValidator = require('../../destinations/location-validation/geolocation-validator')
const expect = require('chai').expect
const InvalidGeoLocationProvided = require('../../destinations/location-validation/InvalidGeolocationProvided')

describe('validating geolocations', function () {
  it('returns valid co-ordinates', async function () {
    const candidate = {
      event: {
        geolocation: {latitude: 0, longitude: 1}
      }
    }

    const result = await geolocationValidator.tryValidate(candidate)
    expect(result).to.eql(candidate.event)
  })

  it('(because dynamodb seems to necessitate it) can parse string values from valid co-ordinates', async function () {
    const candidate = {
      event: {
        geolocation: {latitude: '0.12', longitude: '1.23'}
      }
    }

    const result = await geolocationValidator.tryValidate(candidate)
    expect(result).to.equal(candidate.event)
  })

  it('can flag proposed locations with invalid locations', async function () {
    let caughtError

    await geolocationValidator
      .tryValidate({
        event: {
          geolocation: 'not valid?'
        }
      })
      .catch(err => {
        caughtError = err
      })

    expect(caughtError).to.exist
      .and.be.instanceof(InvalidGeoLocationProvided)
      .and.have.property('message', '{"geolocation":"not valid?"} does not have a valid geolocation. Found: {"hasGeolocation":true,"geolocationIsObject":false,"geolocationHasTwoKeys":true,"latitudeIsNumeric":false,"longitudeIsNumeric":false}')
  })
})
