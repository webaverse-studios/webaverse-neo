import {KnexService} from '@feathersjs/knex'

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class FileMetadataService extends KnexService {
  constructor( options ) {
    super( options )

  }

  async create( data, params ) {
    console.log( 'DATA', data )
    try {
      const existing = await this.get( data.id )
      console.log( 'EXISTING', existing )
      return existing
    } catch ( e ) {
      return await super.create( data, params )
    }
  }
}

export const
  getOptions = ( app ) => {
    return {
      paginate: app.get( 'paginate' ),
      Model: app.get( 'sqliteClient' ),
      name: 'file-metadata'
    }
  }
