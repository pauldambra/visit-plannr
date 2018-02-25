const map = require('../destinations/dynamoDbMap')
const expect = require('chai').expect

const dynamoDbEvent = {
  'Records': [
    {
      'eventID': '79e91d2b44008188f4e7f33543c74925',
      'eventName': 'INSERT',
      'eventVersion': '1.1',
      'eventSource': 'aws:dynamodb',
      'awsRegion': 'eu-west-2',
      'dynamodb': {
        'ApproximateCreationDateTime': 1519495740,
        'Keys': {
          'StreamName': {
            'S': 'destination-8402e864-ba86-4986-2a13-818929514e36'
          },
          'EventId': {
            'S': 'd95fe21f-491d-4122-226a-af27eb99933c'
          }
        },
        'NewImage': {
          'StreamName': {
            'S': 'destination-8402e864-ba86-4986-2a13-818929514e36'
          },
          'EventId': {
            'S': 'd95fe21f-491d-4122-226a-af27eb99933c'
          },
          'event': {
            'M': {
              'name': {
                'S': 'test'
              },
              'correlationId': {
                'S': '8402e864-ba86-4986-2a13-818929514e36'
              },
              'type': {
                'S': 'destinationProposed'
              },
              'geolocation': {
                'S': 'xyz'
              }
            }
          }
        },
        'SequenceNumber': '100000000000417865903',
        'SizeBytes': 308,
        'StreamViewType': 'NEW_IMAGE'
      },
      'eventSourceARN': 'arn:aws:dynamodb:eu-west-2:390409371039:table/visitplannr-EventsTable-1JN530QBX3LTR/stream/2018-02-24T17:55:57.742'
    }
  ]
}

describe('events from dynamodb', function () {
  it('can be mapped to a domain event', function () {
    const domainEvents = map.from(dynamoDbEvent)
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
    const domainEvents = map.from(dynamoDbEvent)
    expect(domainEvents.length).to.equal(1)
  })
})
