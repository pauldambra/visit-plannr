
const destinationReadModel = require('./destinationReadModel.js')
const streamNames = require('./destinations/destinations-read-model/streamNames')

module.exports = {
  withStreamReader: (streamReader) => ({
    withReadModelWriter: (modelWriter) => ({
      writeModelsFor: (event) =>
        streamNames
          .from(event.Records)
          .map(streamName => {
            const stream = streamReader.readStream(streamName)
            return destinationReadModel.createFrom(stream)
          })
          .map(readModel => {
            return modelWriter.write(readModel)
          })
    })
  })
}
