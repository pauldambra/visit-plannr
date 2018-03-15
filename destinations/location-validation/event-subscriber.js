
module.exports = {
  for: (geolocationValidator, eventWriter) => ({
    apply: (events, callback) => {
      const writePromises = events.map(receivedEvent => {
        return geolocationValidator
          .tryValidate(receivedEvent)
          .then(() => { return eventWriter.writeSuccess(receivedEvent) })
          .catch(err => { return eventWriter.writeFailure(err, receivedEvent) })
      })

      Promise.all(writePromises)
        .then(() => callback(null, `wrote ${writePromises.length} promises`))
        .catch(err => callback(err))
    }
  })
}
