
const tableName = process.env.EVENTS_TABLE || 'visitplannr-events'

module.exports = {
  for: dynamoDbClient => {
    return {
      writeToStream: (stream, event, onSuccess, onError) => {
        var params = {
          TableName: tableName,
          Item: {
            StreamName: stream,
            EventId: 'some-guid',
            event: event
          }
        }
        dynamoDbClient.put(params, function (err, data) {
          if (err) {
            console.log(data, 'data')
            console.log(dynamoDbClient, 'dbclient')
            onError('could not write to table: ' + JSON.stringify(err))
          } else {
            onSuccess()
          }
        })
      }
    }
  }
}
