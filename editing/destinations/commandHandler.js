const NoGeoLocationProvided = require('./NoGeoLocationProvided')
const NoNameProvided = require('./NoNameProvided')

const eventFrom = command => {
  return {
    name: command.name,
    geolocation: command.geolocation,
    type: 'destinationCreated'
  }
}

class CommandPipeline {
  constructor () {
    this.functions = []
  }

  use (fn) {
    this.functions.push(fn)
    return this
  }

  run (ev, opts) {
    for (var i = 0; i < this.functions.length; i++) {
      const current = this.functions[i]
      const shouldContinue = current(ev, opts)
      if (!shouldContinue) break
    }
  }
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

  return true
}

const validateName = (ev, opts) => {
  if (!ev.name) {
    const err = new NoNameProvided(
      'destinations must include a name.',
      {
        command: opts.command,
        event: ev
      }
    )
    opts.onError(err)
    return false
  }
  return true
}

const validateGeoLocation = (ev, opts) => {
  if (!ev.geolocation) {
    const err = new NoGeoLocationProvided(
      'destinations must include a location.',
      {
        command: opts.command,
        event: ev
      }
    )
    opts.onError(err)
    return false
  }
  return true
}

const apply = (opts) => {
  const ev = eventFrom(opts.command)

  new CommandPipeline()
    .use(validateGeoLocation)
    .use(validateName)
    .use(writeToStream)
    .run(ev, opts)
}

module.exports = {
  apply
}
