import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidatos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('nome').nullable()
      table.string('bi').unique().nullable()
      table.string('genero').nullable()
      table.string('email').unique().nullable()
      table.string('telefone').nullable()
      table.string('telefone2').nullable()
      table.string('nome_pai').nullable()
      table.string('nome_mae').nullable()
      table.string('turno').nullable()
      table.string('endereco').nullable()
      table.float('media_final').nullable()
      table.string('nascimento').nullable() 

      table.string('role').defaultTo('candidato')

      table
        .integer('curso_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cursos')
        .onDelete('CASCADE')

      table.timestamps(true, true)
      table.index(['curso_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
