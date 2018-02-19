const destinations = require('../destinations')
const chai = require('chai')
const expect = chai.expect

describe('when creating a destination', function () {
  it('writes an event to a new stream', function (done) {
    let actualStreamName = ''
    let actualEvent = {}

    const persistenceMechanism = {
      generateId: () => 'my-guid',
      writeToStream: (stream, event) => {
        actualStreamName = stream
        actualEvent = event
      }
    }

    destinations.apply({
      command: {name: 'the destination name', geolocation: {something: 'provided'}},
      onSuccess: () => {
        expect(actualEvent).to.deep.equal({
          type: 'destinationCreated',
          name: 'the destination name',
          geolocation: {something: 'provided'}
        })
        expect(actualStreamName).to.equal('destination-my-guid')
        done()
      },
      onError: done
    }, persistenceMechanism)
  })
})
