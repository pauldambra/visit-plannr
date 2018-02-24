
const mapper = require('./destinations/mapper')
const commandHandler = require('./destinations/commandHandler')
const guid = require('./GUID')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')

exports.handler = (event, context, callback) => {
  const proposeDestination = mapper.from(event, 'proposeDestination')

  streamRepo = streamRepo || makeStreamRepository.for(dynamoDbClient.connect())

  commandHandler.apply(
    {
      command: proposeDestination,
      type: 'destinationProposed',
      onSuccess: () => mapper.toSuccessResponse(proposeDestination, callback),
      onError: (err) => mapper.toResponseForInvalidRequest(err, proposeDestination, callback),
      streamRepository: streamRepo,
      guidGenerator: guid
    }
  )
}
