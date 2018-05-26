
const makeEvent = (streamName, eventId, correlationId, isSuccessEvent) => ({
  streamName,
  event: {
    triggeringEvent: eventId,
    correlationId: correlationId,
    type: isSuccessEvent ? 'geolocationValidationSucceeded' : 'geolocationValidationFailed'
  }
})

const success = (streamName, eventId, correlationId) =>
  makeEvent(streamName, eventId, correlationId, true)

const failure = (streamName, eventId, correlationId) =>
  makeEvent(streamName, eventId, correlationId, false)

module.exports = {
  success,
  failure
}
