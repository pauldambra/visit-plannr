const mapDomainEvent = require('./destinations/location-validation/dynamoDbMap')

const guid = require('./GUID')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')

const geolocationValidator = require('./destinations/location-validation/geolocation-validator')

const geolocationEventWriter = require('./destinations/location-validation/geolocation-validation-event-writer')
let eventWriter

const makeEventSubscriber = require('./destinations/location-validation/event-subscriber')

exports.handler = (event, context, callback) => {
  const receivedEvents = mapDomainEvent.from(event)

  streamRepo = streamRepo || makeStreamRepository.for(dynamoDbClient.connect(), guid)
  eventWriter = eventWriter || geolocationEventWriter.for(streamRepo)

  const eventSubscriber = makeEventSubscriber.for(geolocationValidator, eventWriter)

  eventSubscriber.apply(receivedEvents, callback)
}
