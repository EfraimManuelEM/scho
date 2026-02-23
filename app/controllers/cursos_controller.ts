import Curso from '#models/curso'
import type { HttpContext } from '@adonisjs/core/http'
import { v4 as uuidv4 } from 'uuid'

export default class CursosController {

  public async index({}: HttpContext) {
    return await Curso.all()
  }

  public async store({ request, response }: HttpContext) {
    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (!image) {
      return response.badRequest({ message: 'Imagem é obrigatória' })
    }

    if (!image.isValid) {
      return response.badRequest(image.errors)
    }

    const fileName = `${uuidv4()}.${image.extname}`

    await image.move('public/uploads', {
      name: fileName,
      overwrite: true,
    })

    const data = request.only([
      'nome',
      'codigo',
      'duracao',
      'departamento',
      'descricao',
    ])

    const curso = await Curso.create({
      ...data,
      image: fileName ? `http://localhost:3333/uploads/${fileName}` : null, // ✅ aqui
    })

    return response.created(curso)
  }

  public async show({ params }: HttpContext) {
    const curso = await Curso.findOrFail(params.id)
    return curso
  }

  public async update({ params, request }: HttpContext) {

    const curso = await Curso.findOrFail(params.id)
    const data = request.only([
      'nome',
      'codigo',
      'duracao',
      'departamento',
    ])
    curso.merge(data)
    await curso.save()
    return curso
  }

  public async destroy({ params, response }: HttpContext) {
    const curso = await Curso.findOrFail(params.id)
    await curso.delete()
    response.status(204)
    return {
      message: 'Curso deleted successfully'
    }
  }
}
