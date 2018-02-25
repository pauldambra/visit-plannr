
const fromAPI = (apiEvent, type) => {
  const dest = JSON.parse(apiEvent.body)
  const parsedCommand = {
    name: dest.name,
    geolocation: dest.geolocation,
    type
  }
  console.log(`received ${type} command: ${JSON.stringify(parsedCommand)}`)
  return parsedCommand
}

const toSuccessResponse = (command, callback) => {
  console.log(`successfully written event from command: ${JSON.stringify(command)}`)
  callback(null, {
    statusCode: 200,
    body: 'OK'
  })
}

const toResponseForInvalidRequest = (err, command, callback) => {
  console.log(`error: ${err} writing event from command: ${JSON.stringify(command)}`)
  callback(null, {
    statusCode: 400,
    body: err.message
  })
}

module.exports = {
  fromAPI,
  toSuccessResponse,
  toResponseForInvalidRequest
}
