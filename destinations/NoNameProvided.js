module.exports = class NoNameProvided extends Error {
  constructor (...args) {
    super(...args)
    Error.captureStackTrace(this, NoNameProvided)
  }
}
