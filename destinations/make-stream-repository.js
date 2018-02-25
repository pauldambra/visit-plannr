
const tableName = process.env.EVENTS_TABLE || 'visitplannr-events'

const DynamoDbPutFailed = require('./DynamoDbPutFailed')

module.exports = {
  for: (dynamoDbClient, guidGenerator) => {
    return {
      writeToStream: (opts) => {
        var params = {
          TableName: tableName,
          Item: {
            StreamName: opts.streamName,
            EventId: guidGenerator.generate(),
            event: opts.event
          }
        }

        return new Promise((resolve, reject) => {
          dynamoDbClient.put(params, function (err, data) {
            if (err) {
              reject(new DynamoDbPutFailed('could not write to table: ' + JSON.stringify(err)))
            } else {
              resolve(params)
            }
          })
        })
      }
    }
  }
}
