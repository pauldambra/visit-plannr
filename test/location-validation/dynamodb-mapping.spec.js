const dynamoDbReader = require('../../src/destinations/dynamoDbReader.js')
const expect = require('chai').expect

const dynamoDbEvent = require('../exampleDynamoDbEvent')()

describe('events from dynamodb', function () {
  it('can be mapped to a domain event', function () {
    const domainEvents = dynamoDbReader.toDomainEvent(dynamoDbEvent.Records)
    expect(domainEvents[0]).to.deep.equal({
      StreamName: 'destination-8402e864-ba86-4986-2a13-818929514e36',
      EventId: 'd95fe21f-491d-4122-226a-af27eb99933c',
      event: {
        name: 'test',
        correlationId: '8402e864-ba86-4986-2a13-818929514e36',
        type: 'destinationProposed',
        geolocation: 'xyz'
      }
    })
  })

  it('ignores other event types', function () {
    dynamoDbEvent.Records.push({
      dynamodb: {
        NewImage: {
          event: {
            M: {
              type: 'an event we wrote but not something that should be processed'
            }
          }
        }
      }
    })
    const domainEvents = dynamoDbReader.toDomainEvent(dynamoDbEvent.Records)
    expect(domainEvents.length).to.equal(1)
  })
})
