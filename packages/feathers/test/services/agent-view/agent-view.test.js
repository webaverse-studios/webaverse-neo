// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import {app} from '../../../src/app.js'
import fs from "fs";

describe('agent-view service', function() {
  this.timeout(60000)
  it('registered the service', async () => {
    const service = app.service('agent-view')

    assert.ok(service, 'Registered the service')

    // test create function
    // load image test/test.jpg to a blob
    const imageBuffer = fs.readFileSync("./test/test.jpg")
    const blob =  new Blob([imageBuffer], { type: 'image/jpeg' })
    const data = {
      hash_condition: {agentID: "12345", timestamp: Date.now()},
      file: blob
    }
    const created = await service.create(data)
    assert.ok(created, 'Created an item')

    // test get function
    const got = await service.get(created.id)
    assert.ok(got, 'Got an item')
    console.log('got', got)

  })
})
