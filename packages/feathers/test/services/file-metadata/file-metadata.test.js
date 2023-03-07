// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app.js'

// describe('file-metadata service', () => {
//   it('registered the service', async () => {
//     const service = app.service('file-metadata')
//
//     assert.ok(service, 'Registered the service')
//
//     // test create function
//     const data = {
//       id: "1234567",
//       metadata:
//         {"type":"image/jpeg","size":25980},
//       extra:
//         {agentID: "123456", timestamp: 123456789}
//     }
//     console.log("DONE", await service.create(data))
//   })
// })

async function main(){
  const service = app.service('file-metadata')

  // test create function
  const data = {
    id: "1234567",
    metadata:
      {"type":"image/jpeg","size":25980},
    extra:
      {agentID: "123456", timestamp: 123456789}
  }
  console.log("DONE", await service.create(data))
}

await main()
