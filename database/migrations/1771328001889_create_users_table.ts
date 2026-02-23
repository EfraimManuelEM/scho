import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('nome').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('senha').notNullable()
      table.string('departamento').nullable()
      table.string('bi').nullable()
      table.string('genero').nullable()
      table.timestamp('nascimento').nullable()
      table.string('telefone').nullable()
      table.integer('total_usuario').notNullable().defaultTo(0)
      table.integer('vagas_ocupadas').notNullable().defaultTo(0)
      table.string('role').nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}