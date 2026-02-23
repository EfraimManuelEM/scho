import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Matricula from '#models/matricula'

export default class Professor extends BaseModel {
  public static table = 'professores'
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nota: number

  @column()
  declare discimplina: string

  @column() 
  declare status: string

  // 🔑 MAPEAMENTO CORRETO
  @column({ columnName: 'matricula_id' })
  declare matriculaId: number | null

  // 🔗 RELACIONAMENTO
  @belongsTo(() => Matricula, {
    foreignKey: 'matriculaId',
  })
  declare matricula: BelongsTo<typeof Matricula>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
