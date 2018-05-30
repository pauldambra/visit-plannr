const chai = require('chai')
const expect = chai.expect

const destinationProposedEvent = require('../../destinations/propose-destination/destinationProposed.event.js')
const geolocationValidationEvent = require('../../destinations/location-validation/geolocationValidation.event.js')
const destinationReadModel = require('../../destinations/destinations-read-model/destinationReadModel.js')

describe('the destination read model', function () {
  it('can apply a destination proposed event', function () {
    const stream = [
      destinationProposedEvent('foo', {x: 0, y: 100})
    ]
    const readModel = destinationReadModel.apply(stream)

    expect(readModel.status).to.eql('pending')
    expect(readModel.name).to.eql('foo')
    expect(readModel.geolocation).to.eql({x: 0, y: 100})
  })

  it('can apply a valid geolocation event', function () {
    const stream = [
      geolocationValidationEvent.success().event
    ]
    const readModel = destinationReadModel.apply(stream)

    expect(readModel.status).to.eql('valid')
  })

  it('marks the model as invalid if validation did not succeed', function () {
    const stream = [
      geolocationValidationEvent.failure().event
    ]
    const readModel = destinationReadModel.apply(stream)

    expect(readModel.status).to.eql('failed')
  })

  it('can apply an entire stream', function () {
    const stream = [
      destinationProposedEvent('foo', {x: 0, y: 100}),
      geolocationValidationEvent.success().event
    ]
    const readModel = destinationReadModel.apply(stream)

    expect(readModel.status).to.eql('valid')
    expect(readModel.name).to.eql('foo')
    expect(readModel.geolocation).to.eql({x: 0, y: 100})
  })
})
