const streamRepoFactory = require('../destinations/make-stream-repository')
const expect = require('chai').expect

describe('the repo', function () {
  it('can write to the stream', function (done) {
    const guid = {
      generate: () => 'a-generated-guid'
    }

    const documentDBClient = {
      put: (item, cb) => {
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
      }
    }
    const streamRepo = streamRepoFactory.for(documentDBClient)
    streamRepo.writeToStream(
      {
        streamName: 'arbitrary-string',
        event: {test: 'poo'},
        onSuccess: null,
        onError: null,
        guidGenerator: guid
      }
    )
  })
})
