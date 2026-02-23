import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'

import Candidato from '#models/candidato'
import Matricula from '#models/matricula'
import Turma from '#models/turma'

import type {
  HasMany,
} from '@adonisjs/lucid/types/relations'

export default class Curso extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome?: string

  @column()
  declare codigo?: string

  @column()
  declare duracao?: string

  @column()
  declare departamento?: string

  @column()
  declare image: string | null

  @column()
  declare ativo: boolean

  @column()
  declare descricao: string

  /* ================= RELAÇÕES ================= */

  @hasMany(() => Candidato)
  declare candidatos: HasMany<typeof Candidato>

  @hasMany(() => Matricula)
  declare matriculas: HasMany<typeof Matricula>

  @hasMany(() => Turma)
  declare turmas: HasMany<typeof Turma>

  /* ================= TIMESTAMPS ================= */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
