import type { HttpContext } from '@adonisjs/core/http'
import Turma from '#models/turma'
import Curso from '#models/curso'

export default class TurmasController {
  /**
   * LISTAR TURMAS
   */
  public async index({ response }: HttpContext) {
    const turmas = await Turma
      .query()
      .preload('curso')

    const resultado = turmas.map((t) => ({
      id: t.id,
      nome: t.nome,
      createdAt: t.createdAt,
      ano: t.ano,
      turno: t.turno,
      totalAlunos: t.totalAlunos,
      sala: t.sala,
      cursoId: t.cursoId,
      cursoNome: t.curso?.nome ?? '',
    }))

    return response.ok(resultado)
  }

  /**
   * CRIAR TURMA
   */
  public async store({ request, response }: HttpContext) {
    const data = request.only([
      'nome',
      'ano',
      'turno',
      'totalAlunos',
      'sala',
      'cursoId',
      'vagasOcupadas',
    ])

    if (
      !data.nome ||
      !data.ano ||
      !data.turno ||
      !data.totalAlunos ||
      !data.sala ||
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

    const turma = await Turma.create({
      nome: data.nome,
      ano: Number(data.ano),
      turno: data.turno,
      totalAlunos: Number(data.totalAlunos),
      sala: data.sala,
      cursoId: data.cursoId,
    })

    await turma.load('curso')

    return response.created({
      turma,
      cursoNome: turma.curso?.nome,
    })
  }

  /**
   * MOSTRAR TURMA
   */
  public async show({ params, response }: HttpContext) {
    const turma = await Turma
      .query()
      .where('id', params.id)
      .preload('curso')
      .firstOrFail()

    return response.ok(turma)
  }

  /**
   * ATUALIZAR TURMA
   */
  public async update({ params, request, response }: HttpContext) {
    const turma = await Turma.findOrFail(params.id)

    const data = request.only([
      'nome',
      'ano',
      'turno',
      'totalAlunos',
      'sala',
      'cursoId',
    ])

    const curso = await Curso.find(data.cursoId)
    if (!curso) {
      return response.badRequest({ message: 'Curso inválido' })
    }

    turma.merge({
      nome: data.nome,
      ano: Number(data.ano),
      turno: data.turno,
      totalAlunos: Number(data.totalAlunos),
      sala: data.sala,
      cursoId: data.cursoId,
    })

    await turma.save()
    await turma.load('curso')

    return response.ok({
      turma,
      cursoNome: turma.curso?.nome,
    })
  }

  /**
   * REMOVER TURMA
   */
  public async destroy({ params, response }: HttpContext) {
    const turma = await Turma.findOrFail(params.id)
    await turma.delete()

    return response.noContent()
  }

  /**
   * 🚫 REGRA: NÃO PERMITIR MAIS ALUNOS QUE O LIMITE
   */
  public async podeAdicionarAluno({ params, response }: HttpContext) {
    const turma = await Turma
      .query()
      .where('id', params.id)
      .preload('matriculas') // ou preload('alunos')
      .firstOrFail()

    const quantidadeAtual = turma.matriculas.length

    if (quantidadeAtual >= turma.totalAlunos) {
      return response.badRequest({
        message: 'Esta turma já atingiu o limite máximo de alunos',
      })
    }

    return response.ok({
      message: 'Ainda é possível adicionar alunos',
      vagasDisponiveis: turma.totalAlunos - quantidadeAtual,
    })
  }
}
