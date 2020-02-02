const geolocationEvent = require('./geolocationValidation.event.js')

module.exports = {
  for: (streamRepo) => {
    return {
      writeSuccess: receivedEvent => {
        return streamRepo
          .writeToStream(
            geolocationEvent.success(
              receivedEvent.StreamName,
              receivedEvent.EventId,
              receivedEvent.event.correlationId
            )
          )
      },
      writeFailure: (err, receivedEvent) => {
        console.log({
          err,
          receivedEvent
        }, 'event failed geolocation')

        return streamRepo
          .writeToStream(
            geolocationEvent.failure(
              receivedEvent.StreamName,
              receivedEvent.EventId,
              receivedEvent.event.correlationId
            )
          )
      }
    }
  }
}
