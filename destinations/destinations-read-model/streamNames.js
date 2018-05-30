const dynamoDbReader = require('../dynamoDbReader.js')

module.exports = {
  from: e => dynamoDbReader.toDomainEvent(e).map(x => x.StreamName)
}
