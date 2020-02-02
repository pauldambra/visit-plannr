const expect = require('chai').expect
const handler = require('../../destinations/cloudfront/handler.js')
const eventFor = require('./s3-event.js')

describe('the cdn invalidator', function () {
  it('invalidates a single changed file', async function () {
    const indexChangedEvent = eventFor([{
      file: 'index.html',
      etag: 'anarbitraryetag'
    }])

    let invalidationParams
    await handler
      .withCDN({
        createInvalidation: (params) => {
          invalidationParams = params
          return {
            promise: () => Promise.resolve(['wat'])
          }
        }
      })
      .withDistribution('123456')
      .withTimestampSource({ stringify: () => 'thetimestamp' })
      .invalidate(indexChangedEvent)

    expect(invalidationParams.DistributionId).to.eql('123456')
    expect(invalidationParams.InvalidationBatch.Paths.Quantity).to.eql(1)
    expect(invalidationParams.InvalidationBatch.Paths.Items).to.eql(['/'])
    expect(invalidationParams.InvalidationBatch.CallerReference).to.eql('index.html-anarbitraryetag-thetimestamp')
  })

  it('invalidates multiple changed files', async function () {
    const changedFiles = eventFor([
      { file: 'index.html', etag: 'anarbitraryetag' },
      { file: 'another.html', etag: 'anotheretag' }
    ])

    let invalidationParams
    await handler
      .withCDN({
        createInvalidation: (params) => {
          invalidationParams = params
          return {
            promise: () => Promise.resolve(['wat'])
          }
        }
      })
      .withDistribution('123456')
      .withTimestampSource({ stringify: () => 'thetimestamp' })
      .invalidate(changedFiles)

    expect(invalidationParams.DistributionId).to.eql('123456')
    expect(invalidationParams.InvalidationBatch.Paths.Quantity).to.eql(2)
    expect(invalidationParams.InvalidationBatch.Paths.Items).to.eql(['/', 'another.html'])
    expect(invalidationParams.InvalidationBatch.CallerReference).to.eql(
      'index.html-anarbitraryetag-thetimestamp-another.html-anotheretag-thetimestamp')
  })
})
