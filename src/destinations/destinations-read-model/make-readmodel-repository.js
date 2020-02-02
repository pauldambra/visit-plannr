
const DynamoDbPutFailed = require('../DynamoDbPutFailed')

module.exports = {
  for: (tableName, dynamoDbClient, guidGenerator) => {
    return {
      write: readModel => {
        var params = {
          TableName: tableName,
          Item: readModel
        }

        return new Promise((resolve, reject) => {
          dynamoDbClient.put(params, function (err, data) {
            if (err) {
              reject(new DynamoDbPutFailed(`could not write ${readModel} to table ${tableName}: ` + JSON.stringify(err)))
            } else {
              resolve(params)
            }
          })
        })
      },
      read: limit => {
        return dynamoDbClient.query({
          ExpressionAttributeNames: {
            '#t': 'type'
          },
          ExpressionAttributeValues: {
            ':d': 'destination'
          },
          ScanIndexForward: false, // descending sort
          KeyConditionExpression: '#t = :d',
          Limit: limit,
          TableName: tableName
        }).promise()
      }
    }
  }
}
