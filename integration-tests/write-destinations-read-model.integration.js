const expect = require('chai').expect

const destinationProposedEvent = require('../src/destinations/propose-destination/destinationProposed.event.js')
const geolocationValidationEvent = require('../src/destinations/location-validation/geolocationValidation.event.js')
const destinationReadModel = require('../src/destinations/destinations-read-model/destinationReadModel.js')

const now = (new Date()).toISOString().replace(/:/g, '-')
const tableName = `theTable-${now}`

const guid = require('../src/GUID.js')
const dynamoDbClient = require('../src/destinations/dynamoDbClient').documentClient('http://0.0.0.0:8000')
const makeReadModelRepository = require('../src/destinations/destinations-read-model/make-readmodel-repository.js')
const readModelRepo = makeReadModelRepository.for(tableName, dynamoDbClient, guid)

const dynamoReadModelsTable = require('./dynamoReadModelsTable.js')

const readModelWithEventTimestamp = timestamp => {
  const destinationProposed = destinationProposedEvent('foo', { x: 0, y: 100 })
  destinationProposed.timestamp = timestamp
  const stream = [
    destinationProposed,
    geolocationValidationEvent.success().event
  ]
  return destinationReadModel.apply(stream)
}

describe('destination read models', function () {
  before(async function () {
    await dynamoReadModelsTable.create(tableName)
  })

  it('can be written to dynamodb', async function () {
    const readModel = readModelWithEventTimestamp('2017-04-01T01:00')

    const writtenItem = await readModelRepo.write(readModel)

    expect(writtenItem.Item.timestamp).to.eql('2017-04-01T01:00')
  })

  it('can be read in descending time order', async function () {
    console.log('---------------------------------------------')

    const eventTimestamps = [
      '2018-04-01T01:00',
      '2018-07-02T01:00', // jump forward in time
      '2018-04-03T01:00',
      '2018-03-01T01:00', // jump backward in time
      '2018-04-04T01:00',
      '2018-04-05T01:00',
      '2018-04-06T01:00'
    ]

    await Promise.all(
      eventTimestamps
        .map(readModelWithEventTimestamp)
        .map(readModelRepo.write)
    )

    const readResults = await readModelRepo.read(5)

    expect(readResults.Count).to.eql(5)
    expect(readResults.ScannedCount).to.eql(5)

    const timestamps = readResults.Items.map(i => i.timestamp)

    expect(timestamps).to.eql([
      '2018-07-02T01:00', // jump forward in time
      '2018-04-06T01:00',
      '2018-04-05T01:00',
      '2018-04-04T01:00',
      '2018-04-03T01:00'
    ])
  })
})
