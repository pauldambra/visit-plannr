module.exports = class DynamoDbPutFailed extends Error {
  constructor (...args) {
    super(...args)
    Error.captureStackTrace(this, DynamoDbPutFailed)
  }
}
