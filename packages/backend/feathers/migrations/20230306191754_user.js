/**
 *
 * @param knex
 */
export async function up( knex ) {
  await knex.schema.createTable( 'users', ( table ) => {
    table.increments( 'id' )
    table.string( 'email' ).unique()
    table.string( 'password' )
  })
}

/**
 *
 * @param knex
 */
export async function down( knex ) {
  await knex.schema.dropTable( 'users' )
}
