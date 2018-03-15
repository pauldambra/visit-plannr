
const httpResponse = require('./destinations/propose-destination/httpResponse')
const mapCommand = require('./destinations/propose-destination/mapCommand')

const guid = require('./GUID')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')

const commandHandler = require('./destinations/propose-destination/commandHandler')

exports.handler = (event, context, callback) => {
  const proposeDestination = mapCommand.fromAPI(event, 'proposeDestination')

  streamRepo = streamRepo || makeStreamRepository.for(dynamoDbClient.connect(), guid)

  commandHandler
    .apply({
      command: proposeDestination,
      type: 'destinationProposed',
      streamName: 'destination',
      streamRepository: streamRepo
    })
    .then(() => httpResponse.success(proposeDestination, callback))
    .catch((err) => httpResponse.invalid(err, proposeDestination, callback))
}
