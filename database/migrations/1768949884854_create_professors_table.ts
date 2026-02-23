import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'professores'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.engine('InnoDB') // 🔥 importante

      table.increments('id')
      table.float('nota').notNullable()
      table.string('discimplina').notNullable()
      table.string('status').notNullable()

      table
        .integer('matricula_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('matriculas') // ✅ nome correto
        .onDelete('SET NULL')

      table.timestamps(true, true)
      table.index(['matricula_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
