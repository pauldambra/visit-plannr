const AWS = require('aws-sdk')
const region = process.env.AWS_REGION || 'eu-west-2'
const s3 = new AWS.S3({region})

let documentClient
const dynamoDbClient = require('./destinations/dynamoDbClient')
const lambdaHandler = require('./destinations/homepage/handler')
const readModelsTableName = process.env.READMODEL_TABLE || 'vistplannr-readmodels'

exports.handler = async event => {
  documentClient = documentClient || dynamoDbClient.documentClient()

  const handler = lambdaHandler
    .withTableName(readModelsTableName)
    .withDocumentClient(documentClient)
    .withStorage(s3, 'visitplannr-site-home')

  const promise = handler(event)

  promise.catch(err => console.log(err, 'error generating homepage'))
  return promise
}
