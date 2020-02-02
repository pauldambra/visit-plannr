const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const cloudfront = new AWS.CloudFront()
const ssm = new AWS.SSM()
const fileChanged = require('./destinations/cloudfront/handler.js')
const timestamps = require('./destinations/timestamps.js')

let cloudfrontDistributionIdParam

exports.handler = async event => {
  cloudfrontDistributionIdParam = cloudfrontDistributionIdParam ||
    await ssm.getParameter({ Name: process.env.PARAM_NAME })
      .promise()

  const invalidations =
    await fileChanged
      .withCDN(cloudfront)
      .withDistribution(cloudfrontDistributionIdParam.Parameter.Value)
      .withTimestampSource(timestamps)
      .invalidate(event)

  return Promise.all(invalidations)
}
