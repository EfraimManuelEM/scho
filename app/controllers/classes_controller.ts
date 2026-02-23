import Classe from '#models/classe'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClassesController {

    public async index({} : HttpContext) {
        const classes = await Classe.all()
        return classes
    }

    public async show({ params }: HttpContext ) {
        const classe = await Classe.findOrFail(params.id)
        return classe
    }

    public async store({ request, response }: HttpContext) {
        const data = request.only(['classe', 'descricao', 'valor'])
        const classe = await Classe.create(data)
        response.status(201)
        return classe
    }

    public async update({ params, request }: HttpContext) {
        const classe = await Classe.findOrFail(params.id)
        const data = request.only(['classe', 'descricao', 'valor'])
        classe.merge(data)
        await classe.save()
        return classe
    }

    public async destroy({ params, response }: HttpContext) {
        const classe = await Classe.findOrFail(params.id)
        await classe.delete()
        response.status(204)
        return {
            message: 'Classe deleted successfully'
        }
    }
}