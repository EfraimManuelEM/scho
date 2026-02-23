import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pagas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('tipo').nullable()
      table.float('valor').nullable()
      table.string('metodo').nullable()


      table
        .integer('candidato_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('candidatos')
        .onDelete('SET NULL')

     table.timestamps(true, true)

      table.index(['candidato_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}