import type { HttpContext } from '@adonisjs/core/http'
import Professor from '#models/professor'
import Matricula from '#models/matricula'

export default class ProfessoresController {

  /* ============================================
     🚀 1. CRIAR (POST /professores)
  ============================================= */
  public async store({ request, response }: HttpContext) {
    const { nota, discimplina, matriculaId } = request.only(['nota', 'discimplina', 'matriculaId'])

    if (!nota || !discimplina || !matriculaId) {
      return response.badRequest({
        message: 'Todos os campos são obrigatórios!',
      })
    }

    const matricula = await Matricula.find(matriculaId)
    if (!matricula) {
      return response.badRequest({
        message: 'Matrícula não encontrada',
      })
    }

    const professores = await Professor.create({
      nota: Number(nota),
      matriculaId: Number(matriculaId),
    })

  await professores.load('matricula', (matriculaQuery) => {
    matriculaQuery
      .preload('candidato')
      .preload('curso')
      .preload('turma')
  })

    return response.created({
      professores,
      matricula: professores.matricula,
      candidatoNome: professores.matricula?.candidato?.nome ?? '',
      cursoNome: professores.matricula?.curso?.nome ?? '',
      turmaNome: professores.matricula?.turma?.nome ?? '',
    })
  }

  /* ============================================
     🚀 2. LISTAR TODOS (GET /professores)
  ============================================= */
public async index({ response }: HttpContext) {
  const professores = await Professor
    .query()
    .preload('matricula', (matriculaQuery) => {
      matriculaQuery.preload('candidato')
      matriculaQuery.preload('curso')
      matriculaQuery.preload('turma')
    })

  const matriculaDetalhes = professores.map((p) => ({
    id: p.id,
    nota: p.nota,
    candidatoNome: p.matricula?.candidato?.nome ?? '',
    cursoNome: p.matricula?.curso?.nome ?? '',
    turnaNome: p.matricula?.turma?.nome ?? '',
  }))

  return response.ok(matriculaDetalhes)
}


  /* ============================================
     🚀 3. BUSCAR POR ID (GET /professores/:id)
  ============================================= */
  public async show({ params, response }: HttpContext) {
    const professor = await Professor
      .query()
      .where('id', params.id)
      .preload('matricula', (matriculaQuery) => {
      matriculaQuery.preload('candidato')
      matriculaQuery.preload('curso')
      matriculaQuery.preload('turma')
    })
      .first()

    const matriculaDetalhes = professor ? [{
      id: professor.id,
      nota: professor.nota,
      candidatoNome: professor.matricula?.candidato?.nome ?? '',
      cursoNome: professor.matricula?.curso?.nome ?? '',
      turnaNome: professor.matricula?.turma?.nome ?? '',
    }] : []

    if (!professor) {
      return response.notFound({
        message: 'Pagamento não encontrado.',
      })
    }

    return response.ok(matriculaDetalhes)
  }

  /* ============================================
     🚀 4. ATUALIZAR (PUT /professores/:id)
  ============================================= */
  public async update({ params, request, response }: HttpContext) {
    const { nota, discimplina, status, matriculaId } = request.only(['nota', 'discimplina', 'status', 'matriculaId'])

    if (!nota || !discimplina || !status || !matriculaId) {
      return response.badRequest({
        message: 'Todos os campos são obrigatórios!',
      })
    }

    const professor = await Professor.find(params.id)
    if (!professor) {
      return response.notFound({
        message: 'Pagamento não encontrado.',
      })
    }

    const matricula = await Matricula.find(matriculaId)
    if (!matricula) {
      return response.badRequest({
        message: 'Matrícula não encontrada',
      })
    }

    professor.merge({
      nota: Number(nota),
      matriculaId: Number(matriculaId),
    })

    await professor.save()
    await professor.load('matricula', (matriculaQuery) => {
    matriculaQuery
      .preload('candidato')
      .preload('curso')
      .preload('turma')
  }) 

      return response.created({
      professor,
      matricula: professor.matricula,
      candidatoNome: professor.matricula?.candidato?.nome ?? '',
      cursoNome: professor.matricula?.curso?.nome ?? '',
      turmaNome: professor.matricula?.turma?.nome ?? '',
    })
  }

  /* ============================================
     🚀 5. DELETAR (DELETE /professores/:id)
  ============================================= */
  public async destroy({ params, response }: HttpContext) {
    const professor = await Professor.find(params.id)

    if (!professor) {
      return response.notFound({
        message: 'Pagamento não encontrado.',
      })
    }

    await professor.delete()

    return response.ok({
      message: 'Pagamento deletado com sucesso.',
    })
  }
}
