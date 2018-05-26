// const AWS = require('aws-sdk')
// const s3 = new AWS.S3({region: this.config.aws.region})

const dynamoDbClient = require('./destinations/dynamoDbClient')
const terminalEventType = process.env.terminalEventType
const lambdaHandler = require('./destinations/homepage/handler')
/**
  triggered on any write to the dynamodb stream
  if that write was a successful terminal event for a destination
  then it regenerates the home page HTML to s3
**/
exports.handler = async event => {
  return lambdaHandler
    .withDependencies(terminalEventType, dynamoDbClient.documentClient())(event)
}
