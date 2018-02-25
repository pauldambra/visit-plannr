const NoGeoLocationProvided = require('./NoGeoLocationProvided')
const NoNameProvided = require('./NoNameProvided')

const eventFrom = (command, eventType) => {
  return {
    name: command.name,
    geolocation: command.geolocation,
    type: eventType
  }
}

const writeToStream = (opts) => {
  const correlationId = opts.guidGenerator.generate()

  const streamName = `destination-${correlationId}`
  opts.event.correlationId = correlationId

  return new Promise((resolve, reject) => {
    opts.streamRepository
      .writeToStream({
        streamName,
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
    opts.event = eventFrom(opts.command, opts.type)

    return validateGeoLocation(opts)
      .then(validateName)
      .then(writeToStream)
  }
}
