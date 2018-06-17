const dynamoDbReader = require('./destinations/dynamoDbReader')

const guid = require('./GUID')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')
const tableName = process.env.EVENTS_TABLE || 'visitplannr-events'

const geolocationValidator = require('./destinations/location-validation/geolocation-validator')

const geolocationEventWriter = require('./destinations/location-validation/geolocation-validation-event-writer')
let eventWriter

const makeEventSubscriber = require('./destinations/location-validation/event-subscriber')

exports.handler = (event, context, callback) => {
  streamRepo = streamRepo || makeStreamRepository.for(tableName, dynamoDbClient.documentClient(), guid)
  eventWriter = eventWriter || geolocationEventWriter.for(streamRepo)

  const eventSubscriber = makeEventSubscriber.for(geolocationValidator, eventWriter)

  // TODO this isn't a hexagon, dozy Paul - why does the handler know so much
  const receivedEvents = dynamoDbReader.toDomainEvent(event.Records)
  console.log(`read ${JSON.stringify(receivedEvents)} events from inbound trigger ${JSON.stringify(event)}`)

  eventSubscriber.apply(
    receivedEvents.filter(de => de.event.type === 'destinationProposed'),
    callback
  )
}
