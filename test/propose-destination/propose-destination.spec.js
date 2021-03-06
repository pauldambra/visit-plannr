const commandHandler = require('../../src/destinations/propose-destination/commandHandler')
const chai = require('chai')
const expect = chai.expect

describe('when proposing a destination', function () {
  it('writes an event to a new stream', async function () {
    let streamName
    let event

    const fakeStreamRepo = {
      writeToStream: (opts) => {
        streamName = opts.streamName
        event = opts.event
        return new Promise((resolve, reject) => { resolve() })
      }
    }

    await commandHandler
      .apply(
        {
          command: {
            name: 'the destination name',
            geolocation: { something: 'provided' }
          },
          streamName: 'the stream name',
          streamRepository: fakeStreamRepo
        }
      )

    expect(event).to.deep.equal({
      type: 'destinationProposed',
      name: 'the destination name',
      geolocation: { something: 'provided' }
    })
    expect(streamName).to.include('the stream name')
  })
})
