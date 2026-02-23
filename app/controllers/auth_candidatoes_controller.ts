import type { HttpContext } from '@adonisjs/core/http'
import Candidato from '#models/candidato'

export default class AuthCandidatoesController {
public async loginC({ request, response, auth }: HttpContext) {
  const { email,  } = request.only(['email'])

  const candidato = await Candidato.findBy('email', email)

  if (!candidato) {
    return response.badRequest({ message: 'Usuário não encontrado.' })
  }

  const token = await auth.use('candidato').createToken(candidato)

  return response.ok({
    user: {
      id: candidato.id,
      nome: candidato.nome,
      email: candidato.email,
      role: candidato.role,
    },
    token: token.value?.release(),
  })
}


  public async logoutC({ auth, response }: HttpContext) {
    await auth.use('candidato').invalidateToken()

    return response.ok({
      message: 'Logout realizado com sucesso.',
    })
  }
}
