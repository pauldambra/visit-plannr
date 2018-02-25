const streamRepoFactory = require('../destinations/make-stream-repository')
const expect = require('chai').expect

describe('the repo', function () {
  it('decorates the event when writing to the stream', function (done) {
    const fakeGuidGenerator = {
      generate: () => 'a-generated-guid'
    }

    const fakeDynamoDbClient = {
      put: (params, callback) => { callback() }
    }

    const streamRepo = streamRepoFactory.for(fakeDynamoDbClient, fakeGuidGenerator)

    streamRepo.writeToStream(
      {
        streamName: 'arbitrary-string',
        event: {test: 'poo'}
      }
    ).then(item => {
      expect(item).to.deep.equal(
        {
          TableName: 'visitplannr-events',
          Item: {
            StreamName: 'arbitrary-string',
            EventId: 'a-generated-guid',
            event: {test: 'poo'}
          }
        })
      done()
    })
  })
})
