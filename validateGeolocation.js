const map = require('./destinations/dynamoDbMap')

const guid = require('./GUID')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')

const geolocationValidator = require('./destinations/geolocationValidator')

exports.handler = (event, context, callback) => {
  const receivedEvents = map.from(event)

  streamRepo = streamRepo || makeStreamRepository.for(dynamoDbClient.connect(), guid)

  console.log(`received events: ${JSON.stringify(receivedEvents)}`)

  receivedEvents.forEach(receivedEvent => {
    geolocationValidator
      .tryValidate({
        event: receivedEvent
      })
      .then(() => {
        streamRepo
          .writeToStream({
            streamName: receivedEvent.StreamName,
            guidGenerator: guid,
            event: {
              triggeringEvent: receivedEvent.EventId,
              correlationId: receivedEvent.event.correlationId,
              type: 'geolocationValidationSucceeded'
            }
          })
          .then(() => console.log(`written validation succeeded event for geolocation: ${JSON.stringify(event.geolocation)}`))
          .catch(err => console.log(`failed writing validation succeeded event: ${JSON.stringify(err)} for event: ${JSON.stringify(event)}`))
      })
      .catch(() => {
        streamRepo
          .writeToStream({
            streamName: receivedEvent.StreamName,
            guidGenerator: guid,
            event: {
              triggeringEvent: receivedEvent.EventId,
              correlationId: receivedEvent.event.correlationId,
              type: 'geolocationValidationFailed'
            }
          })
          .then(() => console.log(`written validation failed event for geolocation: ${JSON.stringify(event.geolocation)}`))
          .catch(err => console.log(`failed writing validation failed event: ${JSON.stringify(err)} for event: ${JSON.stringify(event)}`))
      })
  })

  callback(null, 'done')
}
