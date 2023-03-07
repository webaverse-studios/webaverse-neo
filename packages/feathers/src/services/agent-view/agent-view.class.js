// This is a skeleton for a custom service class. Remove or add the methods you need here
export class AgentViewService {
  constructor(options) {
    this.options = options
  }

  async find(_params) {
    return []
  }

  async get(id, _params) {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data, params) {
    console.log('data', data)

    const fileMetadata = await this.options.app.service('file-metadata').create({
      id: data.id,
      metadata: {
        type: data.file.type,
        size: data.file.size
      },
    })
    console.log('fileMetadata', fileMetadata)

    // store the metadata in the database file-metadata sending _id:data.id and metadata: { type, size } and extra if data.extra
    const fileBlob = await this.options.app.service('files').create({
      id: data.id, file: data.file
    });
    console.log('fileBlob', fileBlob)

    return fileMetadata
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id, data, _params) {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id, data, _params) {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id, _params) {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app) => {
  return {app}
}
