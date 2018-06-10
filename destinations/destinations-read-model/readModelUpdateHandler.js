
const destinationReadModel = require('./destinationReadModel.js')
const streamNames = require('./streamNames')

module.exports = {
  withStreamReader: streamReader => ({
    withReadModelWriter: modelWriter => ({
      allowingModelsWithStatus: status => ({
        writeModelsFor: async event => {
          console.log(`processing trigger event: ${JSON.stringify(event)}`)

          const readPromises = streamNames
            .from(event.Records)
            .map(cs => streamReader.readStream({streamName: cs}))

          const streamsOfEvents = await Promise.all(readPromises)

          const writes = streamsOfEvents
            .map(streamOfWrappedEvents => streamOfWrappedEvents.map(x => x.event))
            .map(destinationReadModel.apply)
            .filter(m => m.status === status)
            .map(modelWriter.write)

          return writes
        }
      })
    })
  })
}
