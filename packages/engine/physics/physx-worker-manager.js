import { makeId } from './util.js'
// import PhysxWorker from './physx-worker.js?sharedworker'

const defaultNumPhysicsWorkers = 1
// const defaultNumPhysicsWorkers = 2

class PhysicsWorkerManager {
  constructor ({ numWorkers = defaultNumPhysicsWorkers } = {}) {
    this.numWorkers = numWorkers

    this.workers = []
    this.nextWorker = 0
    this.loadPromise = null
  }

  waitForLoad () {
    if (!this.loadPromise) {
      this.loadPromise = (async () => {
        console.log(this.loadPromise)

        // create workers
        const workers = Array(this.numWorkers)
        for (let i = 0; i < this.numWorkers; i++) {
          // const worker = new Worker('./physx-worker.js?import', {

          // NO MODULE
          // const worker = new Worker(
          //   new URL('./physx-worker.js', import.meta.url)
          // )

          // MODULE
          const worker = new Worker(
            new URL('./physx-worker.js', import.meta.url),
            {
              type: 'module'
            }
          )

          // const worker = new PhysxWorker()

          const cbs = new Map()

          worker.onmessage = e => {
            console.log('worker message', e.data)

            const { requestId } = e.data
            const cb = cbs.get(requestId)
            if (cb) {
              cbs.delete(requestId)
              cb(e.data)
            } else {
              console.warn('worker message without callback', e.data)
            }
          }

          worker.onerror = err => {
            console.log('physx worker load error', err)
          }

          worker.request = (method, args) => {
            console.log('worker request', method, args)

            return new Promise((resolve, reject) => {
              const requestId = makeId(5)
              cbs.set(requestId, data => {
                const { error, result } = data
                if (error) {
                  reject(error)
                } else {
                  resolve(result)
                }
              })

              worker.postMessage({
                method,
                args,
                requestId
              })
            })
          }

          workers[i] = worker
        }

        this.workers = workers
      })()
    }

    return this.loadPromise
  }

  async cookGeometry (mesh) {
    console.log('cookGeometry', mesh)
    await this.waitForLoad()

    const { workers } = this
    const worker = workers[this.nextWorker]
    this.nextWorker = (this.nextWorker + 1) % workers.length

    const result = await worker.request('cookGeometry', {
      positions: mesh.geometry.attributes.position.array,
      indices: mesh.geometry.index.array
    })
    return result
  }

  async cookConvexGeometry (mesh) {
    console.log('cookConvexGeometry', mesh)
    await this.waitForLoad()

    const { workers } = this
    const worker = workers[this.nextWorker]
    this.nextWorker = (this.nextWorker + 1) % workers.length

    const result = await worker.request('cookConvexGeometry', {
      positions: mesh.geometry.attributes.position.array,
      indices: mesh.geometry.index.array
    })
    return result
  }

  async cookHeightfieldGeometry (numRows, numColumns, heights) {
    console.log('cookHeightfieldGeometry', numRows, numColumns, heights)
    await this.waitForLoad()

    const { workers } = this
    const worker = workers[this.nextWorker]
    this.nextWorker = (this.nextWorker + 1) % workers.length

    const result = await worker.request('cookHeightfieldGeometry', {
      numRows,
      numColumns,
      heights
    })
    return result
  }

  /* async meshoptSimplify(mesh, targetRatio, targetError) {
    await this.waitForLoad();

    const {workers} = this;
    const worker = workers[this.nextWorker];
    this.nextWorker = (this.nextWorker + 1) % workers.length;

    const result = await worker.request('meshoptSimplify', {
      positions: mesh.geometry.attributes.position.array,
      // uvs: mesh.geometry.attributes.uv.array,
      indices: mesh.geometry.index.array,
      targetRatio,
      targetError,
    });
    return result;
  }

  async meshoptSimplifySloppy(mesh, targetRatio, targetError) {
    await this.waitForLoad();

    const {workers} = this;
    const worker = workers[this.nextWorker];
    this.nextWorker = (this.nextWorker + 1) % workers.length;

    const result = await worker.request('meshoptSimplifySloppy', {
      positions: mesh.geometry.attributes.position.array,
      // uvs: mesh.geometry.attributes.uv.array,
      indices: mesh.geometry.index.array,
      targetRatio,
      targetError,
    });
    return result;
  } */
}

const physicsWorkerManager = new PhysicsWorkerManager()
export default physicsWorkerManager
