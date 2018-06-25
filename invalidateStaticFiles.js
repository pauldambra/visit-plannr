const AWS = require('aws-sdk')
const cloudfront = new AWS.CloudFront()
const ssm = new AWS.SSM();
const fileChanged = require('./destinations/cloudfront/handler.js')
const timestamps = require('./destinations/timestamps.js')

let cloudfrontDistributionIdParam

exports.handler = async event => {

  cloudfrontDistributionIdParam = cloudfrontDistributionIdParam ||
    await ssm.getParameter({Name: process.env.PARAM_NAME})
      .promise()

  console.log(cloudfrontDistributionIdParam, 'working with cloudfrontDistributionIdParam')
  const invalidations =
    await fileChanged
      .withCDN(cloudfront)
      .withDistribution(cloudfrontDistributionIdParam.Parameter.Value)
      .withTimestampSource(timestamps)
      .invalidate(event)

  return Promise.all(invalidations)
}
