import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
} from '@adonisjs/lucid/orm'
import Matricula from '#models/matricula'
import Candidato from '#models/candidato'

import type {
  BelongsTo,
} from '@adonisjs/lucid/types/relations'

export default class Pagamento extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tipo?: string

  @column()
  declare metodo?: string

  @column()
  declare valor?: number

  @column({ columnName: 'candidato_id' })
  declare candidatoId?: number

  @column({ columnName: 'matricula_id' })
  declare matriculaId?: number

  /* ================= RELAÇÕES ================= */

  @belongsTo(() => Matricula)
  declare matricula: BelongsTo<typeof Matricula>

  @belongsTo(() => Candidato)
  declare candidato: BelongsTo<typeof Candidato>

  /* ================= TIMESTAMPS ================= */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
