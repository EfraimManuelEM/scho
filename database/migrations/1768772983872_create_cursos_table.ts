import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cursos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome').nullable()
      table.string('codigo').nullable()
      table.string('duracao').nullable()
      table.string('departamento').nullable()
      table.string('image').nullable()
      table.boolean('ativo').notNullable().defaultTo(true)
      table.string('descricao').notNullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}