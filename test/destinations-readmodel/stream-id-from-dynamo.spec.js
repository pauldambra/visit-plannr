const chai = require('chai')
const expect = chai.expect

const exampleEvent = require('../exampleDynamoDbEvent.js')
const streamId = require('../../src/destinations/destinations-read-model/streamNames.js')

describe('the stream name', function () {
  it('can be read from a dynamodb event', function () {
    const triggeringEvent = exampleEvent('arbitraryType', 'some-desired-value')
    const streamName = streamId.from(triggeringEvent.Records)
    expect(streamName).to.eql(['some-desired-value'])
  })
})
