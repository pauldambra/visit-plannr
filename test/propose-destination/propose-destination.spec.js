const commandHandler = require('../../destinations/propose-destination/commandHandler')
const chai = require('chai')
const expect = chai.expect

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

    commandHandler
      .apply(
        {
          command: {
            name: 'the destination name',
            geolocation: {something: 'provided'}
          },
          streamName: 'the stream name',
          type: 'the desired event type',
          streamRepository: fakeStreamRepo
        }
      )
      .then(() => {
        expect(event).to.deep.equal({
          type: 'the desired event type',
          name: 'the destination name',
          geolocation: {something: 'provided'}
        })
        expect(streamName).to.include('the stream name')
        done()
      })
      .catch(done)
  })
})
