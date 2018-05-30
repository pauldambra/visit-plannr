
const dynamoDbReader = require('../dynamoDbReader.js')

module.exports =
  (lambdaDynamoTrigger, terminalEventType) =>
    dynamoDbReader
      .toDomainEvent(lambdaDynamoTrigger)
      .filter(de => de.event.type === terminalEventType)
      .length >= 1
