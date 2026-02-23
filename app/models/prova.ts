import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
} from '@adonisjs/lucid/orm'

import Candidato from '#models/candidato'
import Resposta from '#models/resposta'

import type {
  BelongsTo,
  HasMany,
} from '@adonisjs/lucid/types/relations'

export default class Prova extends BaseModel {
    public static table = 'provas'
    
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nota: number

  @column()
  declare aprovado: boolean

  @column()
  declare status?: string

  @column({ columnName: 'candidato_id' })
  declare candidatoId?: number

  /* ================= RELAÇÕES ================= */

  @belongsTo(() => Candidato)
  declare candidato: BelongsTo<typeof Candidato>

  @hasMany(() => Resposta)
  declare respostas: HasMany<typeof Resposta>

  /* ================= TIMESTAMPS ================= */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
