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

  describe('writing a new event with no correlation id', function () {
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

  describe('writing an event with a correlation id', function () {
    const existingEvent = {
      streamName: 'destination-8402e864-ba86-4986-2a13-818929514e36',
      event: {
        name: 'test',
        correlationId: '8402e864-ba86-4986-2a13-818929514e36',
        type: 'destinationProposed',
        geolocation: 'xyz'
      }
    }

    beforeEach(function () {
      writeToTheStream = streamRepo.writeToStream(existingEvent)
    })

    it('does not add a correlation id', function (done) {
      writeToTheStream
        .then(writtenItem => {
          const e = writtenItem.Item.event
          expect(e.correlationId).to.equal('8402e864-ba86-4986-2a13-818929514e36')
          done()
        })
        .catch(done)
    })

    it('does not add a correlation id to the stream name when it is already there', function (done) {
      writeToTheStream
        .then(writtenItem => {
          expect(writtenItem.Item.StreamName).to.equal('destination-8402e864-ba86-4986-2a13-818929514e36')
          done()
        })
        .catch(done)
    })
  })
})
