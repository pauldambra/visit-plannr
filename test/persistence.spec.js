const streamRepoFactory = require('../destinations/make-stream-repository')
const expect = require('chai').expect

describe('the stream repository', function () {
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
    ).then(writtenItem => {
      expect(writtenItem.TableName).to.equal('visitplannr-events')
      expect(writtenItem.Item.StreamName).to.equal('arbitrary-string-a-generated-guid')
      expect(writtenItem.Item.EventId).to.equal('a-generated-guid')
      expect(writtenItem.Item.event).to.deep.equal({
        test: 'poo',
        correlationId: 'a-generated-guid'
      })
      done()
    })
  })
})
