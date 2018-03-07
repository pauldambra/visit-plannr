
const success = (command, callback) => {
  console.log(`successfully written event from command: ${JSON.stringify(command)}`)
  callback(null, {
    statusCode: 200,
    body: 'OK'
  })
}

const invalid = (err, command, callback) => {
  console.log(`error: ${err} writing event from command: ${JSON.stringify(command)}`)
  callback(null, {
    statusCode: 400,
    body: err.message
  })
}

module.exports = {
  success,
  invalid
}
