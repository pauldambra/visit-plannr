const makeStreamRepository = require('../../src/destinations/make-stream-repository.js')
const chai = require('chai')
const expect = chai.expect

describe('reading from the stream repository', function () {
  let eventCount = 0
  const fakeGuidGenerator = {
    generate: () => {
      return `a-generated-guid-${++eventCount}`
    }
  }

  const fakeDynamoDbClient = {
    query: (params, callback) => {
      return {
        promise: () => Promise.resolve({
          Count: 3,
          Items: [{}, {}, {}]
        })
      }
    }
  }

  const streamRepo = makeStreamRepository.for('anArbitraryTable', fakeDynamoDbClient, fakeGuidGenerator)

  it('can read all of the events from a stream.', async function () {
    const events = await streamRepo.readStream({ streamName: 'a-stream-guid' })
    expect(events.length).to.eql(3)
  })
})
