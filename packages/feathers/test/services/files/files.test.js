// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import fs from 'fs'
import { app } from '../../../src/app.js'

describe('files service', () => {
  it('registered the service', async () => {
    const service = app.service('files')

    assert.ok(service, 'Registered the service')
    // open test/test.jpg and convert to blob
    const file = fs.readFileSync('test/test.jpg')
    const blob = new Blob([file], {type: "image/jpeg"})
    console.log("BLOB", blob)
    const data = {
      hash_condition: "Image",
      file: blob,
      metadata: {
        type: blob.type,
        size: blob.size,
      },
      extra: {recipient: "alice"}
    }
    const result = await service.create(data)
    console.log("CREATE", result)
    const got = await service.get(result.id)
    console.log("GET", got)
  })
})
