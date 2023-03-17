import * as blobService from 'feathers-blob'
import mimeTypes from 'mime-types'
import fs from 'fs-blob-store'

export class FilesService extends blobService.Service {
  async create(data, params) {
    console.log('FILES CREATE', data)
    return super.create({ id: `${data.id}.${mimeTypes.extension(data.type)}`, uri: data.uri }, params)
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: fs('./uploads/files')
  }
}
