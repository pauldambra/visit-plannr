
exports.handler = (event, context, callback) => {
  console.log(`received event: ${JSON.stringify(event)}`)
  callback(null, {
    statusCode: 200,
    body: 'OK'
  })
}
