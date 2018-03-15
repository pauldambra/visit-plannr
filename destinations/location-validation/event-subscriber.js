
module.exports = {
  for: (geolocationValidator, eventWriter) => ({
    apply: (events, callback) => {
      console.log(`received events: ${JSON.stringify(events)}`)

      const writePromises = events.map(e => {
        return geolocationValidator
          .tryValidate(e)
          .then(() => {
            return eventWriter.writeSuccess(e)
          })
          .catch(err => {
            return eventWriter.writeFailure(err, e)
          })
      })

      Promise.all(writePromises)
        .then(() => callback(null, `wrote ${writePromises.length} promises`))
        .catch(err => callback(err))
    }
  })
}
