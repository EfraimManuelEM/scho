import type { HttpContext } from '@adonisjs/core/http'
import User from "#models/user"

export default class UsersController {

    public async index({}: HttpContext) {
        const users = await User.all()
        return users
    }

    public async store({ request, response }: HttpContext) {
        const data = request.only(['nome', 'email', 'senha', 'departamento', 'bi', 'genero', 'nascimento', 'telefone', 'totalUsuarios', 'vagasOcupadas', 'role'])
        const user = await User.create(data)
        response.status(201)
        return user
    }

    public async show({ params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        return user
    }

    public async update({ params, request }: HttpContext) {
        const user = await User.findOrFail(params.id)
        const data = request.only(['nome', 'email', 'senha', 'departamento', 'bi', 'genero', 'nascimento', 'telefone', 'totalUsuarios', 'vagasOcupadas', 'role'])
        user.merge(data)
        await user.save()
        return user
    }

    public async destroy({ params, response }: HttpContext) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        response.status(204)
        return {
            message: 'User deleted successfully'
        }
    }
}