const chai = require('chai')
const dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
const expect = chai.expect

const geolocationValidator = require('../../src/destinations/location-validation/geolocation-validator')
const geolocationEventWriter = require('../../src/destinations/location-validation/geolocation-validation-event-writer')
const makeEventSubscriber = require('../../src/destinations/location-validation/event-subscriber')

const severalFakeEvents = () => {
  const fakeEvent = {
    event: {
      geolocation: {
        latitude: '0',
        longitude: '0'
      }
    }
  }
  return [
    fakeEvent,
    fakeEvent,
    fakeEvent
  ]
}

const simulateSlowWriteToDynamo = () => {
  const now = new Date().getTime()
  while (new Date().getTime() < now + 200) { /* do nothing */ }
}

const assertAllOfTheEventsHaveWritten = (actual, expected) => {
  expect(actual).to.equal(expected)
}

describe('the event subscriber can handle multiple events', function () {
  it('without calling back it is finished before they write to dynamo', function (done) {
    let writesCompleted = 0

    const fakeSlowStreamRepo = {
      writeToStream: () => {
        return new Promise((resolve, reject) => {
          simulateSlowWriteToDynamo()
          writesCompleted++
          resolve()
        })
      }
    }

    const eventWriter = geolocationEventWriter.for(fakeSlowStreamRepo)

    const eventSubscriber = makeEventSubscriber.for(geolocationValidator, eventWriter)

    const events = severalFakeEvents()

    eventSubscriber.apply(
      events,
      (err, complete) => {
        expect(err).to.be.null()
        expect(complete).to.not.be.null()

        assertAllOfTheEventsHaveWritten(writesCompleted, events.length)

        done()
      })
  })
})
