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

    it('decorates the event with a correlation id', async function () {
      const writtenItem = await writeToTheStream
      expect(writtenItem.Item.event).to.deep.equal({
        winnie: 'pooh',
        correlationId: 'a-generated-guid'
      })
    })

    it('writes to the expected table', async function () {
      const writtenItem = await writeToTheStream
      expect(writtenItem.TableName).to.equal('visitplannr-events')
    })

    it('adds the correlation id to the stream name', async function () {
      const writtenItem = await writeToTheStream
      expect(writtenItem.Item.StreamName).to.equal('arbitrary-string-a-generated-guid')
    })

    it('writes an event id guid', async function () {
      const writtenItem = await writeToTheStream
      expect(writtenItem.Item.EventId).to.equal('a-generated-guid')
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

    it('does not add a correlation id', async function () {
      const writtenItem = await writeToTheStream
      const e = writtenItem.Item.event
      expect(e.correlationId).to.equal('8402e864-ba86-4986-2a13-818929514e36')
    })

    it('does not add a correlation id to the stream name when it is already there', async function () {
      const writtenItem = await writeToTheStream
      expect(writtenItem.Item.StreamName).to.equal('destination-8402e864-ba86-4986-2a13-818929514e36')
    })
  })
})
