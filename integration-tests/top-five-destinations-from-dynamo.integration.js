const expect = require('chai').expect

const now = (new Date()).toISOString().replace(/:/g, '-')
const tableName = `theTable-${now}`
const streamName = `theStream-${now}`

const guid = require('../GUID.js')
const dynamoDbClient = require('../destinations/dynamoDbClient').documentClient('http://0.0.0.0:8000')
const makeStreamRepository = require('../destinations/make-stream-repository')
const streamRepo = makeStreamRepository.for(tableName, dynamoDbClient, guid)

const geolocationEventWriter =
  require('../destinations/location-validation/geolocation-validation-event-writer')
    .for(streamRepo)

const recentDestinations = require('../destinations/homepage/recentDestinations')
const destinationProposed = require('../destinations/propose-destination/destinationProposed.event.js')
const dynamoStreamsTable = require('./dynamoEventStreamTable.js')

const writeSixDestinationsToDynamo = async () => {
  const writes = ['one', 'two', 'three', 'four', 'five', 'six'].map(async (e, i) => {
    const writtenEvent = await streamRepo.writeToStream({
      streamName,
      event: destinationProposed(e, {x: i, y: i})
    })

    await geolocationEventWriter.writeSuccess(writtenEvent.Item)
  })
  await Promise.all(writes)
}

describe('reading top five destinations back from dynamodb', function () {
  it('reads the five most recent', async function () {
    await dynamoStreamsTable.create(tableName)
    await writeSixDestinationsToDynamo()

    const topFive = recentDestinations.topFive(dynamoDbClient)
    console.log(topFive)
    expect(topFive.length).to.eql(5)
    // expect 6 down to 2
  })
})
