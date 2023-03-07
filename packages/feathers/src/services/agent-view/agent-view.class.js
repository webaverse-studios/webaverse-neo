import mimeTypes from "mime-types";

export class AgentViewService {
  constructor(options) {
    this.options = options
  }


  async get(id, _params) {
    // perform get call on file-metadata service
    const fileMetadata = await this.options.app.service('file-metadata').get(id)
    const metadata = JSON.parse(fileMetadata.metadata);
    const filename = `${fileMetadata.id}.${mimeTypes.extension(metadata.type)}`

    // return the file from the files service
    return await this.options.app.service('files').get(filename)
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
