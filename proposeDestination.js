
const map = require('./destinations/map')
const commandHandler = require('./destinations/commandHandler')
const guid = require('./GUID')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')

exports.handler = (event, context, callback) => {
  const proposeDestination = map.fromAPI(event, 'proposeDestination')

  streamRepo = streamRepo || makeStreamRepository.for(dynamoDbClient.connect())

  commandHandler.apply(
    {
      command: proposeDestination,
      type: 'destinationProposed',
      onSuccess: () => map.toSuccessResponse(proposeDestination, callback),
      onError: (err) => map.toResponseForInvalidRequest(err, proposeDestination, callback),
      streamRepository: streamRepo,
      guidGenerator: guid
    }
  )
}
