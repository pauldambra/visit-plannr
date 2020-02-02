
const record = (file, etag) => ({
  eventVersion: '2.0',
  eventTime: '1970-01-01T00:00:00.000Z',
  requestParameters: {
    sourceIPAddress: '127.0.0.1'
  },
  s3: {
    configurationId: 'testConfigRule',
    object: {
      eTag: etag,
      sequencer: '0A1B2C3D4E5F678901',
      key: file,
      size: 1024
    },
    bucket: {
      arn: 'arn:aws:s3:::the-cloudfronted-bucket',
      name: 'the-cloudfronted-bucket',
      ownerIdentity: {
        principalId: 'EXAMPLE'
      }
    },
    s3SchemaVersion: '1.0'
  },
  responseElements: {
    'x-amz-id-2': 'EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH',
    'x-amz-request-id': 'EXAMPLE123456789'
  },
  awsRegion: 'us-east-1',
  eventName: 'ObjectCreated:Put',
  userIdentity: {
    principalId: 'EXAMPLE'
  },
  eventSource: 'aws:s3'
})

module.exports = records => ({
  Records: records.map(r => record(r.file, r.etag))
})
