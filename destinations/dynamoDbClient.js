
const AWS = require('aws-sdk')
const awsRegion = process.env.AWS_REGION || 'eu-west-2'

let dynamoDbClient
const makeClient = () => {
  const options = {
    region: awsRegion
  }
  dynamoDbClient = new AWS.DynamoDB.DocumentClient(options)
  return dynamoDbClient
}

module.exports = {
  connect: () => dynamoDbClient || makeClient()
}
