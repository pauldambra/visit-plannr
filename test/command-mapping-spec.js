const chai = require('chai')
const expect = chai.expect
const mapCommand = require('../destinations/mapCommand')

const exampleEvent = {
  httpMethod: 'POST',
  body: '{"name":"destination","geolocation": {"type": "coordinate", "lat": 0.0, "long": 0.0}}',
  resource: '/',
  requestContext: {
    resourcePath: '/',
    httpMethod: 'POST',
    stage: 'prod',
    identity: { sourceIp: '127.0.0.1:59297' }
  },
  queryStringParameters: {},
  headers: {
    Accept: '*/*',
    'Content-Length': '35',
    'Content-Type': 'application/json',
    'User-Agent': 'curl/7.54.0'
  },
  pathParameters: null,
  stageVariables: null,
  path: '/'
}

describe('the command mapper', function () {
  it('can convert a create command out of an HTTP post', function () {
    const command = mapCommand.fromAPI(exampleEvent, 'a command type')
    expect(command).to.deep.equal({
      name: 'destination',
      geolocation: {
        'type': 'coordinate',
        'lat': 0.0,
        'long': 0.0
      },
      type: 'a command type'
    })
  })
})
