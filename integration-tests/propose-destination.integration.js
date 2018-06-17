const request = require('supertest')
var exec = require('child_process').exec
const expect = require('chai').expect

const rootUrl = process.env.rootUrl || 'http://127.0.0.1:3000'
const dynamoDbUrl = process.env.dynamoDbUrl || 'http://0.0.0.0:8000'

const countItemsInTable = () => {
  return new Promise((resolve, reject) => {
    exec(
      `aws dynamodb scan --table-name visitplannr-events --endpoint-url ${dynamoDbUrl}`,
      (error, stdOut, stdErr) => {
        if (error) {
          reject(new Error(error))
          return
        }
        const scanResult = JSON.parse(stdOut)
        resolve(scanResult.Items.length)
      }
    )
  })
}

describe('propose destination', function () {
  it('can write an event to dynamodb', function (done) {
    this.timeout(5000)

    countItemsInTable()
      .then(startCount => {
        request(rootUrl)
          .post('/destination')
          .send('{"name":"test destination","geolocation":{"latitude": 0, "longitude": 0}}')
          .end((err, res) => {
            if (err) {
              done(err)
              return
            }
            countItemsInTable()
              .then(finalCount => {
                expect(finalCount).to.equal(startCount + 1)
                done()
              })
              .catch(done)
          })
      })
      .catch(done)
  })
})
