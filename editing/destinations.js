const NoGeoLocationProvided = require('./NoGeoLocationProvided')
const NoNameProvided = require('./NoNameProvided')
const crypto = require('crypto')

const eventFrom = command => {
  return {
    name: command.name,
    geolocation: command.geolocation,
    type: 'destinationCreated'
  }
}

// from https://gist.github.com/jed/982883
const generateId = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a => ((a ^ crypto.randomBytes(1)[0] * 16 >> a / 4).toString(16))[0])

const apply = (opts, repo) => {
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

  const streamName = `destination-${generateId()}`
  repo.writeToStream(streamName, ev, opts.onSuccess, opts.onError)
}

module.exports = {
  apply
}
