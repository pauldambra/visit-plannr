
const DynamoDbPutFailed = require('./DynamoDbPutFailed')
const timestamps = require('./timestamps.js')

module.exports = {
  for: (tableName, dynamoDbClient, guidGenerator) => {
    return {
      writeToStream: (opts) => {
        let streamName = opts.streamName

        if (!opts.event.correlationId) {
          const correlationId = guidGenerator.generate()

          streamName = `${opts.streamName}-${correlationId}`
          opts.event.correlationId = correlationId
        }

        var params = {
          TableName: tableName,
          Item: timestamps.decorate({
            StreamName: streamName,
            EventId: guidGenerator.generate(),
            event: opts.event
          })
        }

        return new Promise((resolve, reject) => {
          dynamoDbClient.put(params, function (err, data) {
            if (err) {
              reject(new DynamoDbPutFailed(`could not write to table ${tableName}: ` + JSON.stringify(err)))
            } else {
              resolve(params)
            }
          })
        })
      }
    }
  }
}
