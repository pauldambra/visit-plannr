module.exports = class NoGeoLocationProvided extends Error {
  constructor (...args) {
    super(...args)
    Error.captureStackTrace(this, NoGeoLocationProvided)
  }
}
