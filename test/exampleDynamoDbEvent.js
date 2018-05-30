
module.exports = (eventType, streamName) => ({
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
            'S': streamName || 'destination-8402e864-ba86-4986-2a13-818929514e36'
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
                'S': eventType || 'destinationProposed'
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
})
