import type { HttpContext } from '@adonisjs/core/http'
import Prova from "#models/prova"
import Candidato from '#models/candidato'

export default class ProvasController {

  /* ==========================================
     LISTAR TODAS AS PROVAS
  ========================================== */
  public async index({ response }: HttpContext) {
    try {
      const provas = await Prova.query()
        .preload('respostas')

      return response.ok(provas)
    } catch (error) {
      console.error('Erro ao buscar provas:', error)
      return response.internalServerError({ message: 'Erro ao buscar provas.' })
    }
  }

  /* ==========================================
     BUSCAR PROVA DE UM ALUNO PELO NOME OU EMAIL
  ========================================== */
 public async show({ request, response }: HttpContext) {
  try {
    // ✅ Captura query params corretamente
    const { nome, email } = request.qs() // <-- aqui estava 'request.query()'

    if (!nome && !email) {
      return response.badRequest({ message: 'Informe o nome ou email do aluno!' })
    }

    let candidato: Candidato | null = null

    if (email) {
      candidato = await Candidato.findBy('email', String(email))
    } else if (nome) {
      candidato = await Candidato.query().where('nome', String(nome)).first()
    }

    if (!candidato) {
      return response.notFound({ error: 'Aluno não encontrado!' })
    }

    const prova = await Prova.query()
      .where('candidatoId', candidato.id)
      .preload('respostas') // <-- verifique se o relacionamento no model é 'respostas'
      .first()

    if (!prova) {
      return response.notFound({ error: 'Este aluno ainda não realizou a prova.' })
    }

    return response.ok(prova)
  } catch (error) {
    console.error('Erro ao buscar prova única:', error)
    return response.internalServerError({ message: 'Erro ao buscar prova.' })
  }
}


  /* ==========================================
     CRIAR PROVA
  ========================================== */
  public async store({ request, response }: HttpContext) {
    const { email, nota, resposta } = request.only(['email', 'nota', 'resposta'])

    if (!email || typeof nota !== 'number' || !Array.isArray(resposta) || resposta.length === 0) {
      return response.badRequest({ message: 'Todos os campos são obrigatórios!' })
    }

    try {
      const candidato = await Candidato.findBy('email', email)

      if (!candidato) {
        return response.notFound({ error: 'Aluno não encontrado!' })
      }

      const provaExistente = await Prova.query()
        .where('candidatoId', candidato.id)
        .first()

      if (provaExistente) {
        return response.badRequest({ error: 'Você já realizou a prova! Aguarde o resultado.' })
      }

      const prova = await Prova.create({
        candidatoId: candidato.id,
        nota,
      })

      // Criar respostas
      await prova.related('respostas').createMany(
        resposta.map((r: any) => ({
          pergunta: r.pergunta,
          respostaDada: r.respostaDada,
          correta: r.correta,
        }))
      )

      await prova.load('respostas')

      return response.created(prova)
    } catch (error) {
      console.error('Erro ao criar prova:', error)
      return response.internalServerError({ message: 'Erro ao criar prova.' })
    }
  }

  /* ==========================================
     ATUALIZAR PROVA
  ========================================== */
  public async update({ request, response, params }: HttpContext) {
    const { nota } = request.only(['nota'])

    if (typeof nota !== 'number') {
      return response.badRequest({ message: 'Informe a nota!' })
    }

    try {
      const prova = await Prova.findOrFail(params.id)
      prova.nota = nota
      await prova.save()

      await prova.load('respostas')

      return response.ok(prova)
    } catch (error) {
      console.error('Erro ao atualizar prova:', error)
      return response.internalServerError({ message: 'Erro ao atualizar prova.' })
    }
  }

  /* ==========================================
     DELETAR PROVA
  ========================================== */
  public async destroy({ request, response }: HttpContext) {
    const { id } = request.only(['id'])

    if (!id) {
      return response.badRequest({ message: 'ID da prova é obrigatório.' })
    }

    try {
      const prova = await Prova.findOrFail(id)
      await prova.delete()
      return response.ok({ message: 'Prova apagada com sucesso.' })
    } catch (error) {
      console.error('Erro ao deletar prova:', error)
      return response.internalServerError({ message: 'Erro ao deletar prova.' })
    }
  }
}
