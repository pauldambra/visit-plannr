
const dynamoDb = require('../src/destinations/dynamoDbClient.js')

const paramsFor = tableName => ({
  AttributeDefinitions: [
    {
      AttributeName: 'StreamName',
      AttributeType: 'S'
    },
    {
      AttributeName: 'timestamp',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'StreamName',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'timestamp',
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
  dynamoDb
    .dynamoDbClient('http://0.0.0.0:8000')
    .createTable(paramsFor(tableName))
    .promise()

module.exports = {
  create
}
