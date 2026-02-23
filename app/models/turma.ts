import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
} from '@adonisjs/lucid/orm'

import Curso from '#models/curso'
import Matricula from '#models/matricula'

import type {
  BelongsTo,
  HasMany,
} from '@adonisjs/lucid/types/relations'

export default class Turma extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome?: string

  @column()
  declare ano?: number

  @column()
  declare turno?: string

  @column({ columnName: 'total_alunos' })
  declare totalAlunos: number

  @column({ columnName: 'vagas_ocupadas' })
  declare vagasOcupadas: number

  @column()
  declare sala?: string

  @column({ columnName: 'curso_id' })
  declare cursoId?: number

  /* ================= RELAÇÕES ================= */

  @belongsTo(() => Curso)
  declare curso: BelongsTo<typeof Curso>

  @hasMany(() => Matricula)
  declare matriculas: HasMany<typeof Matricula>

  /* ================= TIMESTAMPS ================= */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
