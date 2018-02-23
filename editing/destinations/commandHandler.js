const NoGeoLocationProvided = require('./NoGeoLocationProvided')
const NoNameProvided = require('./NoNameProvided')

const eventFrom = command => {
  return {
    name: command.name,
    geolocation: command.geolocation,
    type: 'destinationCreated'
  }
}

const apply = (opts) => {
  const ev = eventFrom(opts.command)

  if (!ev.geolocation) {
    const err = new NoGeoLocationProvided(
      'destinations must include a location.',
      {
        command: opts.command,
        event: ev
      }
    )
    opts.onError(err)
    return
  }

  if (!ev.name) {
    const err = new NoNameProvided(
      'destinations must include a name.',
      {
        command: opts.command,
        event: ev
      }
    )
    opts.onError(err)
    return
  }

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

module.exports = {
  apply
}
