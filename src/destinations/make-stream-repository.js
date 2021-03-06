
const DynamoDbPutFailed = require('./DynamoDbPutFailed')
const timestamps = require('./timestamps.js')

module.exports = {
  for: (tableName, dynamoDbClient, guidGenerator) => {
    return {
      writeToStream: opts => {
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
              console.log(`wrote ${JSON.stringify(params)} to stream: '${opts.streamName}'`)
              resolve(params)
            }
          })
        })
      },
      readStream: async opts => {
        console.log(`reading stream: ${JSON.stringify(opts)}`)
        const params = {
          ExpressionAttributeNames: {
            '#s': 'StreamName'
          },
          ExpressionAttributeValues: {
            ':s': opts.streamName
          },
          ScanIndexForward: true, // ascending sort
          KeyConditionExpression: '#s = :s',
          TableName: tableName
        }

        const readResults = await dynamoDbClient.query(params).promise()

        // TODO needs paging but not until the events are much bigger or more numerous

        console.log(`read ${readResults.Count} items from ${JSON.stringify(opts)}`)
        return readResults.Items
      }
    }
  }
}
