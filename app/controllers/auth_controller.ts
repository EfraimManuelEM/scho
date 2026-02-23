import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class AuthController {
public async login({ request, response, auth }: HttpContext) {
  const { email, senha } = request.only(['email', 'senha'])

  const admin = await User.findBy('email', email)

  if (!admin) {
    return response.badRequest({ message: 'Usuário não encontrado.' })
  }

  const senhaCorreta = await hash.verify(admin.senha, senha)

  if (!senhaCorreta) {
    return response.badRequest({ message: 'Senha incorreta.' })
  }

  const token = await auth.use('api').createToken(admin)

  return response.ok({
    user: {
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      role: admin.role,
    },
    token: token.value?.release(),
  })
}


  public async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()

    return response.ok({
      message: 'Logout realizado com sucesso.',
    })
  }
}
