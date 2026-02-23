import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import type {
  HasMany,
} from '@adonisjs/lucid/types/relations'
import Matricula from '#models/matricula';

export default class Classe extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classe: string;

  @column()
  declare descricao?: string;
  
  @column()
  declare valor: number;

  @hasMany(() => Matricula)
  declare matriculas: HasMany<typeof Matricula>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}