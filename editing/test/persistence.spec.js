const streamRepoFactory = require('../destinations/make-stream-repository')
const expect = require('chai').expect

describe('the repo', function () {
  it('can write to the stream', function (done) {
    const documentDBClient = {
      put: (item, cb) => {
        expect(item).to.deep.equal(
          {
            TableName: 'visitplannr-events',
            Item: {
              stream: 'something',
              event: {test: 'poo'}
            }
          })
        done()
      }
    }
    const streamRepo = streamRepoFactory.for(documentDBClient)
    streamRepo.writeToStream('something', {test: 'poo'})
  })
})
