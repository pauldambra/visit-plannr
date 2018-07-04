const guid = require('../../GUID.js')
const makeReadModelRepository = require('../destinations-read-model/make-readmodel-repository.js')
const generate = require('./htmlGenerator')

const writeToS3 = (html, s3, bucketName) => {
  const params = {
    ACL: 'public-read',
    Body: html,
    Key: 'index.html',
    ContentType: 'text/html',
    Bucket: bucketName
  }

  return s3.upload(params).promise()
}

module.exports = {
  withTableName: tableName => ({
    withDocumentClient: dynamoDbClient => ({
      withStorage: (s3, bucketName) => {
        const readModelRepo = makeReadModelRepository.for(tableName, dynamoDbClient, guid)

        return async (event) => {
          console.log(event, 'triggering event')

          // we don't care about the event o_O
          const destinations = await readModelRepo.read(5)
          console.log(destinations, 'loaded destinations for home page generation')

          const html = generate.homepage(destinations.Items)
          return writeToS3(html, s3, bucketName)
        }
      }
    })
  })
}
