// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app.js'

describe('files service', () => {
  it('registered the service', async () => {
    const service = app.service('files')

    assert.ok(service, 'Registered the service')

    const data = {
      hash_condition: "test",
      file: new Blob(["test"], {type: "text/plain"}),
      metadata: {
        type: "text/plain",
        size: 4,
      },
      extra: {recipient: "alice"}
    }
    const result = await service.create(data)
    console.log(result)
  })
})
