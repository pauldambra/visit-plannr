'use strict'
const mapper = require('./mapper')
const destinations = require('./destinations')
const AWS = require('aws-sdk')

const streamRepoFactory = require('stream-repo-factory')
let streamRepo

const createStreamRepo = () => {
  const dynamodbClient = new AWS.DynamoDB.DocumentClient()
  return streamRepoFactory.for(dynamodbClient)
}

exports.handler = (event, context, callback) => {
  const createCommand = mapper.from(event)
  console.log(`received create destination command: ${createCommand}`)

  streamRepo = streamRepo || createStreamRepo()

  destinations.apply(
    {
      command: createCommand,
      onSuccess: () => {
        console.log(`written event from command: ${createCommand}`)
        callback(null, {
          statusCode: 200,
          body: 'OK'
        })
      },
      onError: err => {
        console.log(`error: ${err} writing event from command: ${createCommand}`)
        callback(null, {
          statusCode: 400,
          body: err.message
        })
      }
    },
    streamRepo
  )
}
