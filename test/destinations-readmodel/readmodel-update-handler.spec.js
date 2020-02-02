const chai = require('chai')
const expect = chai.expect

const readModelUpdateHandler = require('../../destinations/destinations-read-model/readModelUpdateHandler.js')
const makeStreamRepository = require('../../destinations/make-stream-repository.js')
const makeReadModelRepository = require('../../destinations/destinations-read-model/make-readmodel-repository.js')

let queryCounter = 0

describe('the read model update handler', function () {
  it('processes the expected streams from the triggering event', async function () {
    const reader = makeStreamRepository.for(
      'events-table-name',
      {
        query: params => {
          return {
            promise: () => {
              queryCounter++
              return Promise.resolve({
                Count: 1,
                Items: queryCounter === 1
                  ? [{ event: { name: 'potat', type: 'destinationProposed' } }]
                  : [
                    {
                      event: {
                        name: 'floppity',
                        type: 'destinationProposed'
                      }
                    },
                    {
                      event: {
                        type: 'geolocationValidationSucceeded'
                      }
                    }
                  ]
              })
            }
          }
        }
      },
      {})

    const writer = makeReadModelRepository.for(
      'readmodels-table-name',
      {
        put: (params, cb) => { cb() }
      },
      {})

    const lambdaTriggeringEvent = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              EventId: { S: 'arbitrary' },
              event: { M: {} },
              StreamName: { S: 'potat' }
            }
          }
        },
        {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              EventId: { S: 'a second dynamo insert' },
              event: { M: {} },
              StreamName: { S: 'floppity' }
            }
          }
        }
      ]
    }

    const writes =
      await readModelUpdateHandler
        .withStreamReader(reader)
        .withReadModelWriter(writer)
        .allowingModelsWithStatus('locationValidated')
        .writeModelsFor(lambdaTriggeringEvent)

    const writeResults = await Promise.all(writes)
    const destinationNames = writeResults.map(wr => wr.Item.name)
    expect(destinationNames).to.have.deep.members(['floppity'])
  })
})
