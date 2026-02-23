import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'respostas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('prova_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('provas')
        .onDelete('CASCADE')

      table.string('pergunta').notNullable()
      table.string('resposta_dada').notNullable()
      table.boolean('correta').notNullable()

      table.index(['prova_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
