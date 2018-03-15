const map = require('./destinations/dynamoDbMap')

const guid = require('./GUID')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')

const geolocationValidator = require('./destinations/geolocationValidator')

const geolocationValidationStreams = require('./destinations/location-validation/geolocation-validation-streams')
let geolocationValidationStreamRepo

exports.handler = (event, context, callback) => {
  const receivedEvents = map.from(event)

  streamRepo = streamRepo || makeStreamRepository.for(dynamoDbClient.connect(), guid)
  geolocationValidationStreamRepo = geolocationValidationStreamRepo || geolocationValidationStreams.for(streamRepo)

  console.log(`received events: ${JSON.stringify(receivedEvents)}`)

  receivedEvents.forEach(receivedEvent => {
    geolocationValidator
      .tryValidate(receivedEvent)
      .then(() => geolocationValidationStreamRepo.writeSuccess(receivedEvent))
      .catch(err => geolocationValidationStreamRepo.writeFailure(err, receivedEvent))
  })

  callback(null, 'done')
}
