
const AWS = require('aws-sdk')
const awsRegion = process.env.AWS_REGION || 'eu-west-2'

let dynamoDbClient
let documentClient

const makeClient = endpoint => {
  const options = {
    region: awsRegion
  }

  options.endpoint = endpoint || 'http://dynamodb:8000'

  dynamoDbClient = new AWS.DynamoDB(options)
  options.service = dynamoDbClient
  documentClient = new AWS.DynamoDB.DocumentClient(options)
  return documentClient
}

module.exports = {
  documentClient: (endpoint) => documentClient || makeClient(endpoint),
  dynamoDbClient: (endpoint) => dynamoDbClient || makeClient(endpoint)
}
