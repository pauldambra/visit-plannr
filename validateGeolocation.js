
exports.handler = (event, context, callback) => {
  console.log(`received event: ${JSON.stringify(event)}`)
  callback(null, 'done')
}
