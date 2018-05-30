
/*
 DynamoDB returns JSON in a 'marshalled' format

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

  this is a relatively dumb method to flatten that structure
*/
const unmarshal = x => {
  return Object.keys(x).reduce((result, current) => {
    const value = x[current]

    if ((typeof value === 'object') && (value !== null)) {
      // wat about arrays :(
      if (value.M) {
        result[current] = unmarshal(value.M)
      } else {
        const theUnmarshalledValue = value[Object.keys(value)[0]]
        result[current] = theUnmarshalledValue
      }
    } else {
      result[current] = value
    }

    return result
  }, {})
}

module.exports = {
  toDomainEvent: (dynamoDbEvents, targetEventType) => {
    return (dynamoDbEvents || [])
      .filter(r => r.eventName === 'INSERT')
      .map(r => r.dynamodb.NewImage)
      .map(r => ({
        EventId: r.EventId.S,
        StreamName: r.StreamName.S,
        event: unmarshal(r.event.M)
      }))
  }
}
