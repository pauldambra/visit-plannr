
module.exports = {
  for: dynamoDbClient => {
    return {
      writeToStream: (stream, event, onSuccess, onError) => {
        var params = {
          TableName: 'visitplannr-events',
          Item: {
            stream: stream,
            event: event
          }
        }
        dynamoDbClient.put(params, function (err, data) {
          if (err) {
            onError('could not write to table: ' + JSON.stringify(err))
          } else {
            onSuccess()
          }
        })
      }
    }
  }
}
