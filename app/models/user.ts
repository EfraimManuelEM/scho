import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'senha',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User) // 🔥 AQUI SEM CALLBACK

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare senha: string

  @column()
  declare departamento: string | null

  @column()
  declare bi: string | null

  @column()
  declare genero: string | null

  @column.dateTime()
  declare nascimento: DateTime | null

  @column()
  declare telefone: string | null

  @column({ columnName: 'total_usuario' })
  declare totalUsuarios: number

  @column({ columnName: 'vagas_ocupadas' })
  declare vagasOcupadas: number

  @column()
  declare role: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
