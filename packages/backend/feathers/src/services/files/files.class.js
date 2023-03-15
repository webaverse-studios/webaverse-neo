import * as blobService from 'feathers-blob'
import fs from 'fs-blob-store'
import mimeTypes from 'mime-types'

export class FilesService extends blobService.Service {
  async create( data, params ) {
    return super.create({ id: `${data.id}.${mimeTypes.extension( data.type )}`, uri: data.uri }, params )
  }
}

export const getOptions = ( app ) => {
  return {
    paginate: app.get( 'paginate' ),
    Model: fs( './uploads/files' )
  }
}
