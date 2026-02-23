import type { HttpContext } from '@adonisjs/core/http'
import Pagamento from '#models/pagamento'
import Matricula from '#models/matricula'
import Candidato from '#models/candidato'

export default class PagamentosController {
  /* ============================================
     🚀 1. CRIAR PAGAMENTO
     - Apenas matrícula OU candidato
  ============================================ */
  public async store({ request, response }: HttpContext) {
    try {
      const { tipo, metodo, valor, matriculaId, candidatoId } = request.all()

      /* ========= VALIDAÇÕES ========= */
      if (!tipo || !metodo || !valor) {
        return response.badRequest({
          message: 'Tipo, método e valor são obrigatórios!',
        })
      }

      if (!matriculaId && !candidatoId) {
        return response.badRequest({
          message: 'Informe matrícula OU candidato.',
        })
      }

      if (matriculaId && candidatoId) {
        return response.badRequest({
          message: 'Pagamento deve ser apenas por matrícula OU por candidato.',
        })
      }

      if (matriculaId) {
        const matricula = await Matricula.find(matriculaId)
        if (!matricula) {
          return response.badRequest({ message: 'Matrícula inválida!' })
        }
      }

      if (candidatoId) {
        const candidato = await Candidato.find(candidatoId)
        if (!candidato) {
          return response.badRequest({ message: 'Candidato inválido!' })
        }
      }

      /* ========= CRIA PAGAMENTO (SEM NULL) ========= */
      const pagamento = new Pagamento()
      pagamento.tipo = tipo
      pagamento.metodo = metodo
      pagamento.valor = valor

      if (matriculaId) {
        pagamento.matriculaId = Number(matriculaId)
      }

      if (candidatoId) {
        pagamento.candidatoId = Number(candidatoId)
      }

      await pagamento.save()

      /* ========= LOAD RELAÇÕES ========= */
      await pagamento.load('matricula', (q) => q.preload('candidato'))
      await pagamento.load('candidato')

      return response.created({
        pagamento,
        referencia: pagamento.matricula
          ? pagamento.matricula.candidato?.nome
          : pagamento.candidato?.nome,
      })
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
    }
    return ({
      message: 'Pagamento criando com sucesso.',
    })
  }

  /* ============================================
     🚀 2. LISTAR PAGAMENTOS
  ============================================ */
  public async index({ response }: HttpContext) {
    try {
      const pagamentos = await Pagamento.query()
        .preload('matricula', (q) => {
          q.preload('candidato')
          q.preload('classe')
        })
        .preload('candidato')

      const resultado = pagamentos.map((p) => ({
        id: p.id,
        tipo: p.tipo,
        metodo: p.metodo,
        valor: p.valor,
        createdAt: p.createdAt,
        referencia: p.matricula
        ? `Aluno(a)`
        : `Candidato(a)`,
        candidatoNome: p.candidato?.nome,
        matriculaNome: p.matricula?.candidato?.nome,
        classeNome: p.matricula?.classe?.classe,
        classeValor: p.matricula?.classe?.valor
      }))

      return response.ok(resultado)
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error)
      return response.internalServerError({
        message: 'Erro ao buscar pagamentos.',
      })
    }
  }

  /* ============================================
     🚀 3. BUSCAR PAGAMENTO POR ID
  ============================================ */
  public async show({ params, response }: HttpContext) {
    try {
      const pagamento = await Pagamento.query()
        .where('id', params.id)
        .preload('matricula', (q) => q.preload('candidato'))
        .preload('candidato')
        .first()

      if (!pagamento) {
        return response.notFound({
          message: 'Pagamento não encontrado.',
        })
      }

      return response.ok(pagamento)
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error)
      return response.internalServerError({
        message: 'Erro ao buscar pagamento.',
      })
    }
  }

  /* ============================================
     🚀 4. ATUALIZAR PAGAMENTO
     - Mantém regra matrícula OU candidato
  ============================================ */
  public async update({ params, request, response }: HttpContext) {
    try {
      const { tipo, valor, metodo, matriculaId, candidatoId } = request.only([
        'tipo',
        'valor',
        'metodo',
        'matriculaId',
        'candidatoId',
      ])

      if (!tipo || !valor || !metodo) {
        return response.badRequest({
          message: 'Campos obrigatórios em falta!',
        })
      }

      if (!matriculaId && !candidatoId) {
        return response.badRequest({
          message: 'Informe matrícula OU candidato.',
        })
      }

      if (matriculaId && candidatoId) {
        return response.badRequest({
          message: 'Pagamento não pode ter matrícula e candidato juntos.',
        })
      }

      const pagamento = await Pagamento.find(params.id)
      if (!pagamento) {
        return response.notFound({
          message: 'Pagamento não encontrado.',
        })
      }

      pagamento.tipo = tipo
      pagamento.metodo = metodo

      // limpa relações anteriores
      pagamento.matriculaId = undefined
      pagamento.candidatoId = undefined

      if (matriculaId) {
        pagamento.matriculaId = Number(matriculaId)
      }

      if (candidatoId) {
        pagamento.candidatoId = Number(candidatoId)
      }

      await pagamento.save()

      await pagamento.load('matricula', (q) => q.preload('candidato'))
      await pagamento.load('candidato')

      return response.ok({ pagamento })
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error)
      return response.internalServerError({
        message: 'Erro ao atualizar pagamento.',
      })
    }
  }

  /* ============================================
     🚀 5. DELETAR PAGAMENTO
  ============================================ */
  public async destroy({ params, response }: HttpContext) {
    try {
      const pagamento = await Pagamento.find(params.id)

      if (!pagamento) {
        return response.notFound({
          message: 'Pagamento não encontrado.',
        })
      }

      await pagamento.delete()

      return response.ok({
        message: 'Pagamento deletado com sucesso.',
      })
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error)
      return response.internalServerError({
        message: 'Erro ao deletar pagamento.',
      })
    }
  }
}
