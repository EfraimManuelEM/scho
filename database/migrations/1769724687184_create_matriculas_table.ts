import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'matriculas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('telefone').nullable()

      table
        .integer('candidato_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('candidatos')
        .onDelete('SET NULL')

      table
        .integer('curso_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('cursos')
        .onDelete('SET NULL')

      table
        .integer('turma_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('turmas')
        .onDelete('SET NULL')

      table
        .integer('classe_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('classes')
        .onDelete('SET NULL')
     table.timestamps(true, true)

      table.index(['candidato_id'])
      table.index(['curso_id'])
      table.index(['turma_id'])
      table.index(['classe_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
