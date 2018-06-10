
const readModelUpdateHandler = require('./destinations/destinations-read-model/readModelUpdateHandler.js')

const guid = require('./GUID')
const dynamoDbClient = require('./destinations/dynamoDbClient')

let streamReader
const makeStreamRepository = require('./destinations/make-stream-repository')
const eventsTableName = process.env.EVENTS_TABLE || 'visitplannr-events'

let readModelWriter
const makeReadModelRepository = require('./destinations/destinations-read-model/make-readmodel-repository')
const readModelsTableName = process.env.READMODEL_TABLE || 'vistplannr-readmodels'

const terminalEventType = process.env.TERMINAL_EVENT || 'locationValidated'

exports.handler = async event => {
  streamReader = streamReader || makeStreamRepository.for(
    eventsTableName,
    dynamoDbClient.documentClient(),
    guid)

  readModelWriter = readModelWriter || makeReadModelRepository.for(
    readModelsTableName,
    dynamoDbClient.documentClient(),
    guid)

  const writes =
    await readModelUpdateHandler
      .withStreamReader(streamReader)
      .withReadModelWriter(readModelWriter)
      .allowingModelsWithStatus(terminalEventType)
      .writeModelsFor(event)

  return Promise.all(writes)
}
