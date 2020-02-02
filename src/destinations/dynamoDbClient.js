
const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const awsRegion = process.env.AWS_REGION || 'eu-west-2'

let dynamoDbClient
let documentClient

const setDynamoDbEndpoint = (options, endpoint) => {
  if (endpoint) {
    options.endpoint = endpoint
  } else if (process.env.AWS_SAM_LOCAL) {
    options.endpoint = 'http://dynamodb:8000'
  }
  return options
}

const makeClient = endpoint => {
  let options = {
    region: awsRegion
  }

  options = setDynamoDbEndpoint(options, endpoint)

  dynamoDbClient = new AWS.DynamoDB(options)
  options.service = dynamoDbClient
  documentClient = new AWS.DynamoDB.DocumentClient(options)
  return documentClient
}

module.exports = {
  documentClient: (endpoint) => documentClient || makeClient(endpoint),
  dynamoDbClient: (endpoint) => dynamoDbClient || makeClient(endpoint)
}
