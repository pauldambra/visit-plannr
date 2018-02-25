const commandHandler = require('../destinations/commandHandler')
const NoGeoLocationProvided = require('../destinations/NoGeoLocationProvided')
const NoNameProvided = require('../destinations/NoNameProvided')

const chai = require('chai')
const expect = chai.expect

describe('when proposing a destination', function () {
  it('rejects destinations with no geolocation', function (done) {
    const persistenceMechanism = {
      writeToStream: (stream, event) => {
        return new Promise((resolve, reject) => {
          reject(new Error('should not get this far'))
        })
      }
    }

    commandHandler
      .apply({
        command: {name: 'the destination name'},
        streamRepository: persistenceMechanism
      })
      .then(() => done('oh oh - should not get here'))
      .catch(err => {
        expect(err).to.exist
          .and.be.instanceof(NoGeoLocationProvided)
          .and.have.property('message', 'destinations must include a location.')
        done()
      })
  })

  it('rejects destinations with no name', function (done) {
    const persistenceMechanism = {
      writeToStream: (stream, event) => {}
    }

    commandHandler
      .apply({
        command: {geolocation: {}},
        streamRepository: persistenceMechanism
      })
      .then(() => done('oh oh - should not get here'))
      .catch(err => {
        expect(err).to.exist
          .and.be.instanceof(NoNameProvided)
          .and.have.property('message', 'destinations must include a name.')
        done()
      })
  })
})
