import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
} from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
} from '@adonisjs/lucid/types/relations'
import Candidato from '#models/candidato'

export default class Paga extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tipo?: string

  @column()
  declare valor?: number

  @column()
  declare metodo?: string

  @column({ columnName: 'candidato_id' })
  declare candidatoId?: number

  @column({ columnName: 'matricula_id' })
  declare matriculaId?: number

  /* ================= RELAÇÕES ================= */

  @belongsTo(() => Candidato)
  declare candidato: BelongsTo<typeof Candidato>

  /* ================= TIMESTAMPS ================= */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}