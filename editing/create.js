
const mapper = require('./destinations/mapper')
const commandHandler = require('./destinations/commandHandler')
const guid = require('./GUID')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')

exports.handler = (event, context, callback) => {
  const createDestination = mapper.from(event)

  streamRepo = streamRepo || makeStreamRepository.for(dynamoDbClient.connect())

  commandHandler.apply(
    {
      command: createDestination,
      onSuccess: () => mapper.toSuccessResponse(createDestination, callback),
      onError: (err) => mapper.toResponseForInvalidRequest(err, createDestination, callback),
      streamRepository: streamRepo,
      guidGenerator: guid
    }
  )
}
