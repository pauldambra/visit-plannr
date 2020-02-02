const timestamps = require('../src/destinations/timestamps.js')
const chai = require('chai')
const expect = chai.expect

const eventTimestamps = require('./chai-event-timestamp.js')
chai.use(eventTimestamps)

describe('timestamps', function () {
  describe('can be tested with custom assertions', function () {
    it('can assert that two times are within 1 second of each other', function () {
      const arbitraryDateTime = new Date(2011, 4, 1, 14, 0, 12)
      const oneSecondLater = new Date(2011, 4, 1, 14, 0, 13)

      expect(oneSecondLater).to.be.withinOneSecondOf(arbitraryDateTime)
      expect(arbitraryDateTime).to.be.withinOneSecondOf(oneSecondLater)
    })

    it('can assert that two times are not within 1 second of each other', function () {
      const arbitraryDateTime = new Date(2011, 4, 1, 14, 0, 12)
      const oneSecondLater = new Date(2011, 4, 1, 14, 0, 14)

      expect(oneSecondLater).not.to.be.withinOneSecondOf(arbitraryDateTime)
      expect(arbitraryDateTime).not.to.be.withinOneSecondOf(oneSecondLater)
    })

    it('can assert that one time is within 1 second of now', function () {
      expect(new Date()).to.be.withinOneSecondOfNow()
    })
  })

  it('when given an instant in time can convert to iso-8601', function () {
    const monthIsZeroBasedDate = new Date(Date.UTC(2017, 4, 1, 15, 23, 24))
    const stringified = timestamps.stringify(monthIsZeroBasedDate)
    expect(stringified).to.eql('2017-05-01T15:23:24.000Z')
  })

  it('can convert now to iso-8601', function () {
    const stringified = timestamps.stringify()

    expect(stringified).to.be.withinOneSecondOfNow()
  })

  it('can decorate an arbitrary object with a timestamp', function () {
    const foo = {
      bar: 'baz'
    }
    const decorated = timestamps.decorate(foo)
    expect(decorated.timestamp).to.be.withinOneSecondOfNow()
  })
})
