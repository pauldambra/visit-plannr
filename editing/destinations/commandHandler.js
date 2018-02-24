const NoGeoLocationProvided = require('./NoGeoLocationProvided')
const NoNameProvided = require('./NoNameProvided')

const eventFrom = command => {
  return {
    name: command.name,
    geolocation: command.geolocation,
    type: 'destinationCreated'
  }
}

const processChain = (ev, opts) => {
  validateGeoLocation(ev, opts, validateName)
}

const writeToStream = (ev, opts) => {
  const correlationId = opts.guidGenerator.generate()

  const streamName = `destination-${correlationId}`
  ev.correlationId = correlationId

  opts.streamRepository.writeToStream({
    streamName,
    event: ev,
    onSuccess: opts.onSuccess,
    onError: opts.onError,
    guidGenerator: opts.guidGenerator
  })
}

const validateName = (ev, opts, next) => {
  if (!ev.name) {
    const err = new NoNameProvided(
      'destinations must include a name.',
      {
        command: opts.command,
        event: ev
      }
    )
    opts.onError(err)
  }
  next(ev, opts)
}

const validateGeoLocation = (ev, opts, next) => {
  if (!ev.geolocation) {
    const err = new NoGeoLocationProvided(
      'destinations must include a location.',
      {
        command: opts.command,
        event: ev
      }
    )
    opts.onError(err)
  }
  next(ev, opts, writeToStream)
}

const apply = (opts) => {
  const ev = eventFrom(opts.command)

  processChain(ev, opts)
}

module.exports = {
  apply
}
