import Matricula from '#models/matricula'
import Turma from '#models/turma'
import type { HttpContext } from '@adonisjs/core/http'

export default class MatriculasController {

  /* ==========================================
     LISTAR TODAS AS MATRÍCULAS
  ========================================== */
  public async index({ response }: HttpContext) {
    try {
      const matriculas = await Matricula.query()
        .preload('candidato')
        .preload('curso')
        .preload('turma')
        .preload('classe')

      const matriculasDetalhe = matriculas.map((m) => ({
        id: m.id,
        createdAt: m.createdAt,
        telefone: m.telefone,
        classeId: m.classeId,
        classeNome: m.classe?.classe || '',
        classeValor: m.classe?.valor || 0,
        cursoId: m.cursoId,
        cursoNome: m.curso?.nome || '',
        turmaId: m.turmaId,
        turmaNome: m.turma?.nome || '',
        candidatoId: m.candidatoId,
        candidatoNome: m.candidato?.nome || '',
        candidatoBi: m.candidato?.bi || '',
        candidatoEmail: m.candidato?.email || '',
        candidatoNascimento: m.candidato?.nascimento || '',
        candidatoTurno: m.candidato?.turno || '',
      }))

      return response.ok(matriculasDetalhe)
    } catch (error) {
      console.error('Erro ao buscar matrículas:', error)
      return response.internalServerError({ error: 'Erro ao buscar matrículas.' })
    }
  }

  /* ==========================================
     BUSCAR MATRÍCULA POR ID
  ========================================== */
  public async show({ params, response }: HttpContext) {
    try {
      const matricula = await Matricula.query()
        .where('id', params.id)
        .preload('candidato')
        .preload('curso')
        .preload('turma')
        .firstOrFail()

      return response.ok(matricula)
    } catch (error) {
      console.error('Erro ao buscar matrícula:', error)
      return response.notFound({ message: 'Matrícula não encontrada.' })
    }
  }

  /* ==========================================
     CRIAR MATRÍCULA
  ========================================== */
  public async store({ request, response }: HttpContext) {
    const { telefone, classeId, candidatoId, cursoId, turmaId } = request.only([
      'telefone',
      'candidatoId',
      'cursoId',
      'turmaId',
      'classeId'
    ])

    if (!telefone || !classeId || !candidatoId || !cursoId || !turmaId) {
      return response.badRequest({ message: 'Todos os campos são obrigatórios!' })
    }

    try {
      // Buscar turma para verificar limite
      const turma = await Turma.findOrFail(turmaId)
      await turma.load('matriculas')
      if (turma.matriculas.length >= turma.totalAlunos) {
        return response.badRequest({ message: 'Essa turma atingiu o limite de alunos!' })
      }

      const matricula = await Matricula.create({
        telefone,
        classeId,
        candidatoId,
        cursoId,
        turmaId,
      })

      await matricula.load('candidato')
      await matricula.load('curso')
      await matricula.load('turma')
      await matricula.load('classe')

      return response.created({
        matricula,
        cursoNome: matricula.curso.nome,
        candidatoNome: matricula.candidato.nome,
        candidatoBi: matricula.candidato.bi,
        candidatoEmail: matricula.candidato.email,
        candidatoNascimento: matricula.candidato.nascimento,
        candidatoTurno: matricula.candidato.turno,
        turmaNome: matricula.turma.nome,
        classeNome: matricula.classe.classe,
        classeValor: matricula.classe.valor,
      })
    } catch (error) {
      console.error('Erro ao criar matrícula:', error)
      return response.internalServerError({ error: 'Erro ao criar matrícula.' })
    }
  }

  /* ==========================================
     ATUALIZAR MATRÍCULA
  ========================================== */
  public async update({ request, response, params }: HttpContext) {
    const { telefone, candidatoId, classeId, cursoId, turmaId } = request.only([
      'telefone',
      'candidatoId',
      'cursoId',
      'turmaId',
      'classeId'
    ])

    if (!telefone || !classeId || !candidatoId || !cursoId || !turmaId) {
      return response.badRequest({ message: 'Todos os campos são obrigatórios!' })
    }

    try {
      const matricula = await Matricula.findOrFail(params.id)

      // Verificar limite da nova turma se estiver mudando
      if (matricula.turmaId !== turmaId) {
        const novaTurma = await Turma.findOrFail(turmaId)
        await novaTurma.load('matriculas')
        if (novaTurma.matriculas.length >= novaTurma.totalAlunos) {
          return response.badRequest({ message: 'A nova turma já atingiu o limite de alunos!' })
        }
      }

      matricula.merge({ telefone, candidatoId, cursoId, turmaId })
      await matricula.save()

      await matricula.load('candidato')
      await matricula.load('curso')
      await matricula.load('turma')

      return response.ok({
        matricula,
        cursoNome: matricula.curso.nome,
        candidatoNome: matricula.candidato.nome,
        candidatoBi: matricula.candidato.bi,
        candidatoEmail: matricula.candidato.email,
        candidatoNascimento: matricula.candidato.nascimento,
        candidatoTurno: matricula.candidato.turno,
        turmaNome: matricula.turma.nome,
        classeNome: matricula.classe.classe,
        classeValor: matricula.classe.valor,
      })
    } catch (error) {
      console.error('Erro ao atualizar matrícula:', error)
      return response.internalServerError({ error: 'Erro ao atualizar matrícula.' })
    }
  }

  /* ==========================================
     DELETAR MATRÍCULA
  ========================================== */
  public async destroy({ params, response }: HttpContext) {
    try {
      const matricula = await Matricula.findOrFail(params.id)
      await matricula.delete()
      return response.ok({ message: 'Matrícula deletada com sucesso.' })
    } catch (error) {
      console.error('Erro ao deletar matrícula:', error)
      return response.internalServerError({ message: 'Erro ao deletar matrícula.' })
    }
  }
}
