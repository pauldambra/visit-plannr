
module.exports = class InvalidGeolocationProvided extends Error {
  constructor (...args) {
    super(...args)
    Error.captureStackTrace(this, InvalidGeolocationProvided)
  }
}
