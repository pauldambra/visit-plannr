
const destinationReadModel = require('./destinationReadModel.js')
const streamNames = require('./destinations/destinations-read-model/streamNames')

module.exports = {
  withStreamReader: (streamReader) => ({
    withReadModelWriter: (modelWriter) => ({
      writeModelsFor: (event) =>
        streamNames.from(event.Records)
          .map(streamReader.readStream)
          .map(destinationReadModel.createFrom)
          .map(modelWriter.write)
    })
  })
}
