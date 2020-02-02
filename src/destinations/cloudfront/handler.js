
const extractPathsFrom = event => {
  const records = event.Records || []
  return records
    .map(r => r.s3 && r.s3.object && r.s3.object.key)
    .map(p => p === 'index.html' ? '/' : p)
}

const makeCallerReference = (event, timestamps) => {
  const records = event.Records || []
  const items = records
    .map(r => ({
      key: r.s3 && r.s3.object && r.s3.object.key,
      tag: r.s3 && r.s3.object && r.s3.object.eTag,
      stamp: timestamps.stringify()
    }))
  const references = items.map(x => `${x.key}-${x.tag}-${x.stamp}`)
  return references.join('-')
}

module.exports = {
  withCDN: cloudfront => ({
    withDistribution: distributionId => ({
      withTimestampSource: timestamps => ({
        invalidate: event => {
          const paths = extractPathsFrom(event)

          const params = {
            DistributionId: distributionId, /* required */
            InvalidationBatch: { /* required */
              CallerReference: makeCallerReference(event, timestamps), /* required */
              Paths: { /* required */
                Quantity: paths.length, /* required */
                Items: paths
              }
            }
          }
          return cloudfront.createInvalidation(params).promise()
        }
      })
    })
  })
}
