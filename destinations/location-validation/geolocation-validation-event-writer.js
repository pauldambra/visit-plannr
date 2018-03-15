
module.exports = {
  for: (streamRepo) => {
    return {
      writeSuccess: receivedEvent => {
        return streamRepo
          .writeToStream({
            streamName: receivedEvent.StreamName,
            event: {
              triggeringEvent: receivedEvent.EventId,
              correlationId: receivedEvent.event.correlationId,
              type: 'geolocationValidationSucceeded'
            }
          })
      },
      writeFailure: (err, receivedEvent) => {
        console.log({
          err,
          receivedEvent
        }, 'event failed geolocation')

        return streamRepo
          .writeToStream({
            streamName: receivedEvent.StreamName,
            event: {
              triggeringEvent: receivedEvent.EventId,
              correlationId: receivedEvent.event.correlationId,
              type: 'geolocationValidationFailed'
            }
          })
      }
    }
  }
}
