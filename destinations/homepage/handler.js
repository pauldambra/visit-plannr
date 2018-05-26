
const hasTerminalEvents = require('./hasTerminalEvents')
// const generate = require('./htmlGenerator')

module.exports = {
  withDependencies: (terminalEventType, dynamoDbClient) => {
    return async (event) => {
      if (hasTerminalEvents(event, terminalEventType)) {
        // const locations = await getMostRecentDestinations(dynamoDbClient)
        // const html = await generate.homePage(locations)
        // return writeToS3(html, s3)
      } else {
        return `no terminal events of type ${terminalEventType}`
      }
    }
  }
}
