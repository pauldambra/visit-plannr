
const map = require('./destinations/map')
const commandHandler = require('./destinations/commandHandler')
const guid = require('./GUID')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')

exports.handler = (event, context, callback) => {
  const proposeDestination = map.fromAPI(event, 'proposeDestination')

  streamRepo = streamRepo || makeStreamRepository.for(dynamoDbClient.connect(), guid)

  commandHandler
    .apply({
      command: proposeDestination,
      type: 'destinationProposed',
      streamName: 'destination',
      streamRepository: streamRepo
    })
    .then(() => map.toSuccessResponse(proposeDestination, callback))
    .catch((err) => map.toResponseForInvalidRequest(err, proposeDestination, callback))
}
