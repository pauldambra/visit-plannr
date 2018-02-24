
const AWS = require('aws-sdk')
const awsRegion = process.env.AWS_REGION || 'eu-west-2'
const isLocalEnvironment = process.env.AWS_SAM_LOCAL

let dynamoDbClient
const makeClient = () => {
  const options = {
    region: awsRegion
  }
  console.log(`env: ${JSON.stringify(process.env)} so isLocalEnvironment? ${isLocalEnvironment}`)
  if (isLocalEnvironment) {
    options.endpoint = 'http://0.0.0.0:8000'
  }
  console.log(`connecting to dynamo with options ${JSON.stringify(options)}`)
  dynamoDbClient = new AWS.DynamoDB.DocumentClient(options)
  return dynamoDbClient
}

module.exports = {
  connect: () => dynamoDbClient || makeClient()
}
