const expect = require('chai').expect
const hasTerminalEvents = require('../../destinations/homepage/hasTerminalEvents')

const arbitraryTerminalEventType = 'when-everything-is-said-and-done'
const terminalDynamoDbEvent = require('../exampleDynamoDbEvent')(arbitraryTerminalEventType)

describe('when checking if a valid location event has been written', function () {
  it('can find that terminal event', function () {
    expect(
      hasTerminalEvents(
        terminalDynamoDbEvent.Records,
        arbitraryTerminalEventType))
      .to.be.true()
  })

  it('can ignore unwanted events', function () {
    expect(
      hasTerminalEvents(
        terminalDynamoDbEvent.Records,
        'not the arbitraryTerminalEventType'))
      .to.be.false()
  })
})
