const request = require('supertest');
var exec = require('child_process').exec;
const expect = require('chai').expect

const rootUrl = process.env.rootUrl || 'http://127.0.0.1:3000'

const countItemsInTable = () => {
  return new Promise((resolve, reject) => {
    exec(
      'aws dynamodb scan --table-name visitplannr-events --endpoint-url http://0.0.0.0:8000',
      (error, stdOut, stdErr) => {
        if (error) {
          reject(new Error(error))
          return
        }
        const scanResult = JSON.parse(stdOut)
        console.log(`read items from table - counted: ${scanResult.Items.length}`)
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
            .send('{"name":"test destination","geolocation":{"x": 0, "y": 0}}')
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
