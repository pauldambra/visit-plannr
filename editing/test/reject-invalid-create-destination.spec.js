const destinations = require('../destinations/commandHandler')
const NoGeoLocationProvided = require('../destinations/NoGeoLocationProvided')
const NoNameProvided = require('../destinations/NoNameProvided')

const chai = require('chai')
const expect = chai.expect

describe('when creating a destination', function () {
  it('rejects destinations with no geolocation', function (done) {
    const persistenceMechanism = {
      writeToStream: (stream, event) => {}
    }

    destinations.apply({
      command: {name: 'the destination name'},
      onSuccess: () => done('oh oh - should not get here'),
      onError: err => {
        expect(err).to.exist
          .and.be.instanceof(NoGeoLocationProvided)
          .and.have.property('message', 'destinations must include a location.')
        done()
      }
    }, persistenceMechanism)
  })

  it('rejects destinations with no name', function (done) {
    const persistenceMechanism = {
      writeToStream: (stream, event) => {}
    }

    destinations.apply({
      command: {geolocation: {}},
      onSuccess: () => done('oh oh - should not get here'),
      onError: err => {
        expect(err).to.exist
          .and.be.instanceof(NoNameProvided)
          .and.have.property('message', 'destinations must include a name.')
        done()
      }
    }, persistenceMechanism)
  })
})
