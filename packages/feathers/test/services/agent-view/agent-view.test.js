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
      id: "123",
      file: blob
    }
    console.log("DONE", await service.create(data))
  })
})
