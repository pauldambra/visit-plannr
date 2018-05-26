
const dynamoDb = require('../destinations/dynamoDbClient.js')

const paramsFor = tableName => ({
  AttributeDefinitions: [
    {
      AttributeName: 'EventId',
      AttributeType: 'S'
    },
    {
      AttributeName: 'StreamName',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'StreamName',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'EventId',
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  TableName: tableName,
  StreamSpecification: {
    StreamEnabled: false
  }
})

const create = tableName =>
  dynamoDb.dynamoDbClient('http://0.0.0.0:8000').createTable(paramsFor(tableName)).promise()

module.exports = {
  create
}
