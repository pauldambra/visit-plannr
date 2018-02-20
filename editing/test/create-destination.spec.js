const destinations = require('../destinations')
const chai = require('chai')
const expect = chai.expect

const assertOnSuccess = (done, actualStreamName, actualEvent) => {
  return () => {
    expect(actualEvent).to.deep.equal({
      type: 'destinationCreated',
      name: 'the destination name',
      geolocation: {something: 'provided'}
    })
    expect(actualStreamName).to.include('destination-')
    done()
  }
}

describe('when creating a destination', function () {
  it('writes an event to a new stream', function (done) {
    const persistenceMechanism = {
      writeToStream: (stream, event, onSuccess, onError) => {
        onSuccess(stream, event)()
      }
    }

    destinations.apply({
      command: {name: 'the destination name', geolocation: {something: 'provided'}},
      onSuccess: (stream, event) => assertOnSuccess(done, stream, event),
      onError: () => done('oh! oh! should not get here')
    }, persistenceMechanism)
  })
})
