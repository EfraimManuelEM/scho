import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'turmas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('nome').nullable()
      table.integer('ano').nullable()
      table.string('turno').nullable()
      table.integer('total_alunos').nullable()
      table.integer('vagas_ocupadas').nullable()
      table.string('sala').nullable()

      table
        .integer('curso_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('cursos')
        .onDelete('SET NULL')

      table.timestamps(true, true)
      table.index(['curso_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
