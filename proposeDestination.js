
const httpResponse = require('./destinations/propose-destination/httpResponse')
const mapCommand = require('./destinations/propose-destination/mapCommand')

const guid = require('./GUID')

let streamRepo
const dynamoDbClient = require('./destinations/dynamoDbClient')
const makeStreamRepository = require('./destinations/make-stream-repository')
const tableName = process.env.EVENTS_TABLE || 'visitplannr-events'

const commandHandler = require('./destinations/propose-destination/commandHandler')

exports.handler = (event, context, callback) => {
  const proposeDestination = mapCommand.fromAPI(event, 'proposeDestination')

  streamRepo = streamRepo || makeStreamRepository.for(tableName, dynamoDbClient.documentClient(), guid)

  commandHandler
    .apply({
      command: proposeDestination,
      streamName: 'destination',
      streamRepository: streamRepo
    })
    .then(() => httpResponse.success(proposeDestination, callback))
    .catch((err) => httpResponse.invalid(err, proposeDestination, callback))
}
