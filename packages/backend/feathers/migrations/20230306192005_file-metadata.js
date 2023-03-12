export async function up(knex) {
  await knex.schema.createTable('file-metadata', (table) => {
    table.text('id').primary()
    table.json('metadata');
  //   an optional extra field
    table.json('extra');
  })
}

export async function down(knex) {
  await knex.schema.dropTable('file-metadata')
}
