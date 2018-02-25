const commandHandler = require('../destinations/commandHandler')
const chai = require('chai')
const expect = chai.expect

const assertOnSuccess = (done, actualStreamName, actualEvent) => {
  expect(actualEvent).to.deep.equal({
    correlationId: 'a-generated-guid',
    type: 'the desired event type',
    name: 'the destination name',
    geolocation: {something: 'provided'}
  })
  expect(actualStreamName).to.include('destination-')
  done()
}

describe('when proposing a destination', function () {
  it('writes an event to a new stream', function (done) {
    let streamName
    let event

    const fakeStreamRepo = {
      writeToStream: (opts) => {
        streamName = opts.streamName
        event = opts.event
        return new Promise((resolve, reject) => { resolve() })
      }
    }

    const guid = {
      generate: () => 'a-generated-guid'
    }

    commandHandler
      .apply(
        {
          command: {name: 'the destination name', geolocation: {something: 'provided'}},
          type: 'the desired event type',
          onSuccess: () => assertOnSuccess(done, streamName, event),
          onError: () => done('oh! oh! should not get here'),
          streamRepository: fakeStreamRepo,
          guidGenerator: guid
        }
      )
      .then(() => assertOnSuccess(done, streamName, event))
      .catch(done)
  })
})
