
module.exports = function (_chai, utils) {
  utils.addMethod(_chai.Assertion.prototype, 'withinOneSecondOf', function (actual) {
    const expectedDate = new Date(utils.flag(this, 'object'))
    const actualDate = new Date(actual)
    const diff = Math.abs(expectedDate - actualDate)

    this.assert(
      diff <= 1000,
      'expected #{exp} to be within one second of #{act}',
      'expected #{exp} to not be within one second of #{act}',
      expectedDate, // expected value
      actualDate // actual value
    )
  })

  utils.addMethod(_chai.Assertion.prototype, 'withinOneSecondOfNow', function () {
    const expectedDate = new Date(utils.flag(this, 'object'))
    const actualDate = new Date()
    const diff = Math.abs(expectedDate - actualDate)

    this.assert(
      diff <= 1000,
      `expected #{exp} to be within one second of now (#{act}) was ${diff} milliseconds different`,
      `expected #{exp} to not be within one second of now (#{act}) was ${diff} milliseconds different`,
      expectedDate, // expected value
      actualDate // actual value
    )
  })
}
