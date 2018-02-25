const map = require('./destinations/dynamoDbMap')

const guid = require('guid')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')

const geolocationValidator = require('./destinations/geolocationValidator')

exports.handler = (event, context, callback) => {
  const receivedEvent = map.from(event)

  streamRepo = streamRepo || makeStreamRepository.for(dynamoDbClient.connect())

  console.log(`received event: ${JSON.stringify(receivedEvent)}`)

  geolocationValidator
    .tryValidating({
      event: receivedEvent
    })
    .then(() => {
      streamRepo.writeToStream({
        streamName: receivedEvent.StreamName,
        guidGenerator: guid,
        event: {
          correlationId: receivedEvent.event.correlationId,
          type: 'geolocationValidated'
        }
      })
      console.log(`written validation event for geolocation: ${JSON.stringify(event.geolocation)}`)
      callback(null, 'done')
    })
    .catch(callback)
}
