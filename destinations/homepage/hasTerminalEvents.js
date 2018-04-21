
const mapDomainEvent = require('../dynamoDbMap')

module.exports =
  (lambdaDynamoTrigger, terminalEventType) =>
    mapDomainEvent
      .from(lambdaDynamoTrigger, terminalEventType)
      .length >= 1
