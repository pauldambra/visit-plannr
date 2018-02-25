
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
  const y = {}

  Object.keys(x).forEach(key => {
    const value = x[key]

    if ((typeof value === 'object') && (value !== null)) {
      // wat about arrays :(
      if (value.M) {
        y[key] = unmarshal(value.M)
      } else {
        const theUnmarshalledValue = value[Object.keys(value)[0]]
        y[key] = theUnmarshalledValue
      }
    } else {
      y[key] = value
    }
  })

  return y
}

module.exports = {
  from: (dynamoDbEvent) => {
    return (dynamoDbEvent.Records || [])
      .filter(r => r.eventName === 'INSERT')
      .map(r => r.dynamodb.NewImage)
      .map(r => ({
        EventId: r.EventId.S,
        StreamName: r.StreamName.S,
        event: unmarshal(r.event.M)
      }))
  }
}
