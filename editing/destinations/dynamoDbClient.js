
const AWS = require('aws-sdk')
// const dynamodbURL = process.env.dynamodbURL || 'http://0.0.0.0:8000'
// const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || '1234567'
// const awsAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '7654321'
const awsRegion = process.env.AWS_REGION || 'eu-west-2'

let dynamoDbClient
const makeClient = () => {
  dynamoDbClient = new AWS.DynamoDB.DocumentClient({
    region: awsRegion
  })
  return dynamoDbClient
}

module.exports = {
  connect: () => dynamoDbClient || makeClient()
}
