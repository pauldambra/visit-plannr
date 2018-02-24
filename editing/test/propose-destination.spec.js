const commandHandler = require('../destinations/commandHandler')
const chai = require('chai')
const expect = chai.expect

const assertOnSuccess = (done, actualStreamName, actualEvent) => {
  return () => {
    expect(actualEvent).to.deep.equal({
      correlationId: 'a-generated-guid',
      type: 'the desired event type',
      name: 'the destination name',
      geolocation: {something: 'provided'}
    })
    expect(actualStreamName).to.include('destination-')
    done()
  }
}

describe('when proposing a destination', function () {
  it('writes an event to a new stream', function (done) {
    const fakeStreamRepo = {
      writeToStream: (opts) => {
        opts.onSuccess(opts.streamName, opts.event)()
      }
    }

    const guid = {
      generate: () => 'a-generated-guid'
    }

    commandHandler.apply(
      {
        command: {name: 'the destination name', geolocation: {something: 'provided'}},
        type: 'the desired event type',
        onSuccess: (stream, event) => assertOnSuccess(done, stream, event),
        onError: () => done('oh! oh! should not get here'),
        streamRepository: fakeStreamRepo,
        guidGenerator: guid
      }
    )
  })
})
