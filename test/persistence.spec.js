const streamRepoFactory = require('../destinations/make-stream-repository')
const expect = require('chai').expect

describe('the stream repository', function () {
  const fakeGuidGenerator = {
    generate: () => 'a-generated-guid'
  }

  const fakeDynamoDbClient = {
    put: (params, callback) => { callback() }
  }

  const streamRepo = streamRepoFactory.for(fakeDynamoDbClient, fakeGuidGenerator)

  let writeToTheStream

  beforeEach(function () {
    writeToTheStream = streamRepo.writeToStream(
      {
        streamName: 'arbitrary-string',
        event: {winnie: 'pooh'}
      }
    )
  })

  it('decorates the event with a correlation id', function (done) {
    writeToTheStream
      .then(writtenItem => {
        expect(writtenItem.Item.event).to.deep.equal({
          winnie: 'pooh',
          correlationId: 'a-generated-guid'
        })
        done()
      })
      .catch(done)
  })

  it('writes to the expected table', function (done) {
    writeToTheStream
      .then(writtenItem => {
        expect(writtenItem.TableName).to.equal('visitplannr-events')
        done()
      })
      .catch(done)
  })

  it('adds the correlation id to the stream name', function (done) {
    writeToTheStream
      .then(writtenItem => {
        expect(writtenItem.Item.StreamName).to.equal('arbitrary-string-a-generated-guid')
        done()
      })
      .catch(done)
  })

  it('writes an event id guid', function (done) {
    writeToTheStream
      .then(writtenItem => {
        expect(writtenItem.Item.EventId).to.equal('a-generated-guid')
        done()
      })
      .catch(done)
  })
})
