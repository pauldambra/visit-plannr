
const DynamoDbPutFailed = require('../DynamoDbPutFailed')

module.exports = {
  for: (tableName, dynamoDbClient, guidGenerator) => {
    return {
      write: readModel => {
        // TODO how do we handle duplicates or updates?

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
      }
    }
  }
}
