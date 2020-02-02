const expect = require('chai').expect
const handler = require('../../destinations/homepage/handler.js')

describe('home page generation handler', function () {
  let queryParams = {}
  let uploadParams = {}

  beforeEach(async function () {
    const fakeDocumentClient = {
      query: (params) => {
        queryParams = params
        return {
          promise: () => Promise.resolve(
            { Items: [{ name: '1' }, { name: '2' }, { name: 3 }, { name: '4' }, { name: '5' }] }
          )
        }
      }
    }

    const fakeS3 = {
      upload: (params) => {
        uploadParams = params
        return {
          promise: () => Promise.resolve(0)
        }
      }
    }

    await handler
      .withTableName('arbitrary-table')
      .withDocumentClient(fakeDocumentClient)
      .withStorage(fakeS3, 'arbitrary-bucket-name')()
  })

  it('loads the 5 most recent destinations', function () {
    expect(queryParams.Limit).to.eql(5)
  })

  it('uploads the templated html to s3', function () {
    expect(uploadParams.Body).to.contain('<li>1</li>')
    expect(uploadParams.Body).to.contain('<li>2</li>')
    expect(uploadParams.Body).to.contain('<li>3</li>')
    expect(uploadParams.Body).to.contain('<li>4</li>')
    expect(uploadParams.Body).to.contain('<li>5</li>')
  })

  it('sets the content type of the upload', function () {
    expect(uploadParams.ContentType).to.eql('text/html')
  })
})
