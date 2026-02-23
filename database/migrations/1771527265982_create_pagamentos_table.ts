import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pagamentos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('tipo').nullable()
      table.string('metodo').nullable()
      table.float('valor').nullable()


      table
        .integer('matricula_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('matriculas')
        .nullable()
        .onDelete('SET NULL')

        table
        .integer('candidato_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('candidatos')
        .nullable()
        .onDelete('SET NULL')

     table.timestamps(true, true)

      table.index(['matricula_id'])
      table.index(['candidato_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
