const makeReadModelRepository = require('../../src/destinations/destinations-read-model/make-readmodel-repository.js')

const chai = require('chai')
const expect = chai.expect

describe('the destination read model writer repository', function () {
  const fakeGuidGenerator = {
    generate: () => 'a-generated-guid'
  }

  const fakeDynamoDbClient = {
    put: (params, callback) => { callback() }
  }

  const readModelWriter = makeReadModelRepository.for('anArbitraryTable', fakeDynamoDbClient, fakeGuidGenerator)

  let writeToTheTable

  describe('writing a new event with no correlation id', function () {
    beforeEach(function () {
      writeToTheTable = readModelWriter.write(
        {
          an: 'object',
          with: 'properties'
        }
      )
    })

    it('writes the read model as is', async function () {
      const writtenItem = await writeToTheTable
      expect(writtenItem.Item).to.deep.equal({
        an: 'object',
        with: 'properties'
      })
    })

    it('writes to the expected table', async function () {
      const writtenItem = await writeToTheTable
      expect(writtenItem.TableName).to.equal('anArbitraryTable')
    })
  })

  describe('event timestamps', function () {
    it('are added from the terminal event', async function () {
      const writtenItem = await readModelWriter.write({
        streamName: 'arbitrary-string',
        event: { winnie: 'pooh' },
        timestamp: 'a time stamp'
      })
      expect(writtenItem.Item.timestamp).to.eql('a time stamp')
    })
  })
})
