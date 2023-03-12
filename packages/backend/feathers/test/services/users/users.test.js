// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app.js'

describe('users service', () => {
  it('registered the service', async () => {
    const service = app.service('users')

    assert.ok(service, 'Registered the service')
    console.log(await service.create({email: "admin", password: "admin"}))
  })
})