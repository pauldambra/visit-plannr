'use strict'
const mapper = require('./mapper')

exports.handler = (event, context, callback) => {
  const createCommand = mapper.from(event)
  console.log(createCommand)

  callback(null, {
    statusCode: 200,
    body: 'OK'
  })
}
