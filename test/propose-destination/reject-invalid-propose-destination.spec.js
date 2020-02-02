const commandHandler = require('../../src/destinations/propose-destination/commandHandler')
const NoGeoLocationProvided = require('../../src/destinations/propose-destination/NoGeoLocationProvided')
const NoNameProvided = require('../../src/destinations/propose-destination/NoNameProvided')

const chai = require('chai')
const expect = chai.expect

describe('when proposing a destination', function () {
  it('rejects destinations with no geolocation', async function () {
    const persistenceMechanism = {
      writeToStream: (stream, event) => {
        return new Promise((resolve, reject) => {
          reject(new Error('should not get this far'))
        })
      }
    }

    let caughtError = null
    await commandHandler
      .apply({
        command: { name: 'the destination name' },
        streamRepository: persistenceMechanism
      })
      .catch(err => (caughtError = err))

    expect(caughtError).to.exist
      .and.be.instanceof(NoGeoLocationProvided)
      .and.have.property('message', 'destinations must include a location.')
  })

  it('rejects destinations with no name', async function () {
    const persistenceMechanism = {
      writeToStream: (stream, event) => {}
    }

    let caughtError = null
    await commandHandler
      .apply({
        command: { geolocation: {} },
        streamRepository: persistenceMechanism
      })
      .catch(err => (caughtError = err))

    expect(caughtError).to.exist
      .and.be.instanceof(NoNameProvided)
      .and.have.property('message', 'destinations must include a name.')
  })
})
