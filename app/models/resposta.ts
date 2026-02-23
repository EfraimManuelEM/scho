import {
  BaseModel,
  column,
  belongsTo,
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Prova from '#models/prova'

export default class Resposta extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'prova_id' })
  declare provaId: number

  @column()
  declare pergunta: string

  @column({ columnName: 'resposta_dada' })
  declare respostaDada: string

  @column()
  declare correta: boolean

  /* ================= RELAÇÃO ================= */

  @belongsTo(() => Prova)
  declare prova: BelongsTo<typeof Prova>
}
