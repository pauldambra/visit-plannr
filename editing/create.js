'use strict'
const mapper = require('./mapper')
const destinations = require('./destinations')
const persistence = {}

exports.handler = (event, context, callback) => {
  const createCommand = mapper.from(event)
  console.log(`received create destination command: ${createCommand}`)

  destinations.apply(
    {
      command: createCommand,
      onSuccess: () => {
        callback(null, {
          statusCode: 200,
          body: 'OK'
        })
      },
      onError: err => {
        callback(null, {
          statusCode: 400,
          body: err.message
        })
      }
    },
    persistence
  )
}
