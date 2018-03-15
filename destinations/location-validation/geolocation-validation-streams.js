
module.exports = {
  for: (streamRepo) => {
    return {
      writeSuccess: receivedEvent => {
        streamRepo
          .writeToStream({
            streamName: receivedEvent.StreamName,
            event: {
              triggeringEvent: receivedEvent.EventId,
              correlationId: receivedEvent.event.correlationId,
              type: 'geolocationValidationSucceeded'
            }
          })
          .then(() => console.log(`written validation succeeded event for geolocation: ${JSON.stringify(receivedEvent)}`))
          .catch(err => console.log(`failed writing validation succeeded event: ${JSON.stringify(err)} for event: ${JSON.stringify(receivedEvent)}`))
      },
      writeFailure: (err, receivedEvent) => {
        console.log(err, 'event failed geolocation')
        streamRepo
          .writeToStream({
            streamName: receivedEvent.StreamName,
            event: {
              triggeringEvent: receivedEvent.EventId,
              correlationId: receivedEvent.event.correlationId,
              type: 'geolocationValidationFailed'
            }
          })
          .then(() => console.log(`written validation failed event for geolocation: ${JSON.stringify(receivedEvent)}`))
          .catch(err => console.log(`failed writing validation failed event: ${JSON.stringify(err)} for event: ${JSON.stringify(receivedEvent)}`))
      }
    }
  }
}
