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
import Prova from '#models/prova'
import Pagamento from '#models/pagamento'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'


export default class Candidato extends BaseModel {
    // Define o nome exato da tabela
  public static table = 'candidatos'
    static accessTokens = DbAccessTokensProvider.forModel(Candidato) // 🔥 AQUI SEM CALLBACK
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome?: string

  @column()
  declare bi?: string

  @column()
  declare genero?: string

  @column()
  declare email?: string

  @column()
  declare telefone?: string

  @column({ columnName: 'nome_pai' })
  declare nomePai?: string

  @column({ columnName: 'nome_mae' })
  declare nomeMae?: string

  @column()
  declare turno?: string

  @column()
  declare endereco?: string

  @column({ columnName: 'media_final' })
  declare mediaFinal?: number

  @column()
  declare nascimento: string

  @column()
  declare role?: string

  @column({ columnName: 'curso_id' })
  declare cursoId: number

  /* ================= RELAÇÕES ================= */

  @belongsTo(() => Curso)
  declare curso: BelongsTo<typeof Curso>

  @hasMany(() => Matricula)
  declare matriculas: HasMany<typeof Matricula>

  @hasMany(() => Pagamento)
  declare pagamento: HasMany<typeof Pagamento>

  @hasMany(() => Prova)
  declare provas: HasMany<typeof Prova>

  /* ================= TIMESTAMPS ================= */

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
