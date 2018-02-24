
const tableName = process.env.EVENTS_TABLE || 'visitplannr-events'

module.exports = {
  for: dynamoDbClient => {
    return {
      writeToStream: (opts) => {
        var params = {
          TableName: tableName,
          Item: {
            StreamName: opts.streamName,
            EventId: opts.guidGenerator.generate(),
            event: opts.event
          }
        }
        dynamoDbClient.put(params, function (err, data) {
          if (err) {
            opts.onError('could not write to table: ' + JSON.stringify(err))
          } else {
            opts.onSuccess()
          }
        })
      }
    }
  }
}
