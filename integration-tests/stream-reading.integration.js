const expect = require('chai').expect

const destinationProposedEvent = require('../destinations/propose-destination/destinationProposed.event.js')
const geolocationValidationEvent = require('../destinations/location-validation/geolocationValidation.event.js')

const now = (new Date()).toISOString().replace(/:/g, '-')
const tableName = `theTable-${now}`
const streamName = `theStream-${now}`
const differentStream = `theOtherStream-${now}`

const guid = require('../GUID.js')
const dynamoDbClient = require('../destinations/dynamoDbClient').documentClient('http://0.0.0.0:8000')
const makeStreamRepository = require('../destinations/make-stream-repository.js')

const streamRepo = makeStreamRepository.for(tableName, dynamoDbClient, guid)

const eventStreamTable = require('./dynamoEventStreamTable.js')

const addEventsToStream = async (stream, destination, eventTime) => {
  const destinationProposed = destinationProposedEvent(destination, { x: 0, y: 100 })
  destinationProposed.timestamp = eventTime

  const firstWrite = await streamRepo.writeToStream({
    streamName: stream,
    event: destinationProposed
  })

  const validated = geolocationValidationEvent.success()
  validated.correlationId = firstWrite.Item.event.correlationId

  await streamRepo.writeToStream({
    streamName: firstWrite.Item.StreamName,
    event: validated
  })

  return firstWrite.Item.StreamName
}

describe('reading events from a stream', function () {
  before(async function () {
    await eventStreamTable.create(tableName)
  })

  it('can return all the events oldest first', async function () {
    this.timeout(5000)

    const writtenStreamName = await addEventsToStream(streamName, 'inside query', '2017-04-01T01:00')
    await addEventsToStream(differentStream, 'outside of query', '2017-05-01T01:00')

    const events = await streamRepo.readStream({
      streamName: writtenStreamName
    })

    expect(events.length).to.eql(2)
  })
})
