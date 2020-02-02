const chai = require('chai')
const expect = chai.expect
const httpResponse = require('../../src/destinations/propose-destination/httpResponse')

describe('the http responses', function () {
  it('can send success', function () {
    let responseSent

    httpResponse.success('only used to log', (_, response) => { responseSent = response })

    expect(responseSent.statusCode).to.equal(200)
  })

  it('can send invalid request', function () {
    let responseSent

    httpResponse.invalid(
      { message: 'the error message' },
      'only used to log',
      (_, response) => { responseSent = response })

    expect(responseSent.statusCode).to.equal(400)
    expect(responseSent.body).to.equal('the error message')
  })
})
