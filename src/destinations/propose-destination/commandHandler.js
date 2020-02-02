const NoGeoLocationProvided = require('./NoGeoLocationProvided')
const NoNameProvided = require('./NoNameProvided')
const destinationProposed = require('./destinationProposed.event.js')

const eventFrom = (command) =>
  destinationProposed(command.name, command.geolocation)

const writeToStream = (opts) => {
  return new Promise((resolve, reject) => {
    opts.streamRepository
      .writeToStream({
        streamName: opts.streamName,
        event: opts.event
      })
      .then(resolve)
      .catch(reject)
  })
}

const validateName = (opts) => {
  if (!opts.event.name) {
    const err = new NoNameProvided(
      'destinations must include a name.',
      {
        command: opts.command,
        event: opts.event
      }
    )
    return Promise.reject(err)
  }
  return Promise.resolve(opts)
}

const validateGeoLocation = (opts) => {
  if (!opts.event.geolocation) {
    const err = new NoGeoLocationProvided(
      'destinations must include a location.',
      {
        command: opts.command,
        event: opts.event
      }
    )
    return Promise.reject(err)
  }
  return Promise.resolve(opts)
}

module.exports = {
  apply: (opts) => {
    opts.event = eventFrom(opts.command)

    return validateGeoLocation(opts)
      .then(validateName)
      .then(writeToStream)
  }
}
