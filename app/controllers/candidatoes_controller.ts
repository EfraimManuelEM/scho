import type { HttpContext } from '@adonisjs/core/http'
import Candidato from '#models/candidato'
import Curso from '#models/curso'

export default class CandidatosController {

  /**
   * LISTAR CANDIDATOS
   */
  public async index({ response }: HttpContext) {
    const candidato = await Candidato
      .query()
      .preload('curso')

      const resultado = candidato.map((t) => ({
      id: t.id,
      nome: t.nome,
      nascimento: t.nascimento,
      bi: t.bi,
      genero: t.genero,
      email: t.email,
      telefone: t.telefone,
      nomePai: t.nomePai,
      nomeMae: t.nomeMae,
      turno: t.turno,
      endereco: t.endereco,
      mediaFinal: t.mediaFinal,
      cursoId: t.cursoId,
      cursoNome: t.curso?.nome ?? '',
    }))

    return response.ok(resultado)
  }

  /**
   * CRIAR CANDIDATO
   */
  public async store({ request, response }: HttpContext) {
    const data = request.only([
      'nome',
      'nascimento',
      'bi',
      'genero',
      'email',
      'telefone',
      'nomePai',
      'nomeMae',
      'turno',
      'endereco',
      'mediaFinal',
      'cursoId',
      'role',
    ])

    if (
      !data.nome ||
      !data.bi ||
      !data.genero ||
      !data.nascimento ||
      !data.email ||
      !data.telefone ||
      !data.nomePai ||
      !data.nomeMae ||
      !data.turno ||
      !data.endereco ||
      !data.mediaFinal ||
      !data.cursoId
    ) {
      return response.badRequest({
        message: 'Todos os campos são obrigatórios',
      })
    }

    const curso = await Curso.find(data.cursoId)
      if (!curso) {
        return response.badRequest({ message: 'Curso inválido' })
    }

    // 🔐 hash da senha (igual user)
    //if (data.senha) {
      //data.senha = await Hash.make(data.senha)
    //}

    const candidato = await Candidato.create({
      nome: data.nome,
      nascimento: data.nascimento, // 🔥 AQUI DEVE VIR DO REQUEST, MAS COMO NÃO ESTÁ NO FORM
      bi: data.bi,
      genero: data.genero,
      email: data.email,
      telefone: data.telefone,
      nomePai: data.nomePai,
      nomeMae: data.nomeMae,
      turno: data.turno,
      endereco: data.endereco,
      mediaFinal: Number(data.mediaFinal),
      cursoId: data.cursoId,
      role: data.role ?? 'candidato',
    })

    await candidato.load('curso')

    return response.created({
      candidato,
      cursoNome: candidato.curso?.nome,
    })
  }

  /**
   * MOSTRAR CANDIDATO
   */
  public async show({ params, response }: HttpContext) {
    const candidato = await Candidato
      .query()
      .where('id', params.id)
      .preload('curso')
      .firstOrFail()

    return response.ok(candidato)
  }

  /**
   * ATUALIZAR CANDIDATO
   */
  public async update({ params, request, response }: HttpContext) {
    const candidato = await Candidato.findOrFail(params.id)

    const data = request.only([
      'nome',
      'bi',
      'genero',
      'email',
      'telefone',
      'telefone2',
      'nomePai',
      'nomeMae',
      'turno',
      'endereco',
      'mediaFinal',
      'cursoId',
      'role',
    ])

    candidato.merge(data)
    await candidato.save()

    return response.ok(candidato)
  }

  /**
   * REMOVER CANDIDATO
   */
  public async destroy({ params, response }: HttpContext) {
    const candidato = await Candidato.findOrFail(params.id)
    await candidato.delete()

    return response.status(204)
  }
}
