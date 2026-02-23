import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
} from '@adonisjs/lucid/orm'

import Candidato from '#models/candidato'
import Curso from '#models/curso'
import Turma from '#models/turma'
import Pagamento from '#models/pagamento'
import Classe from '#models/classe'

import type {
  BelongsTo,
  HasMany,
} from '@adonisjs/lucid/types/relations'
import Professor from '#models/professor'

export default class Matricula extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare telefone?: string

  @column({ columnName: 'candidato_id' }) 
  declare candidatoId?: number

  @column({ columnName: 'curso_id' })
  declare cursoId?: number

  @column({ columnName: 'turma_id' })
  declare turmaId?: number


  @column({ columnName: 'classe_id' })
  declare classeId?: number


  /* ================= RELAÇÕES ================= */

  @belongsTo(() => Candidato)
  declare candidato: BelongsTo<typeof Candidato>

  @belongsTo(() => Curso)
  declare curso: BelongsTo<typeof Curso>

  @belongsTo(() => Turma)
  declare turma: BelongsTo<typeof Turma>

  @belongsTo(() => Classe)
  declare classe: BelongsTo<typeof Classe>

  @hasMany(() => Professor, {
    foreignKey: 'matriculaId',
  })
  declare professores: HasMany<typeof Professor>

  @hasMany(() => Pagamento)
  declare pagamentos: HasMany<typeof Pagamento>

  /* ================= TIMESTAMPS ================= */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
