/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')
const CursosController = () => import('#controllers/cursos_controller')
const CandidatosController = () => import('#controllers/candidatoes_controller')
const TurmasController = () => import('#controllers/turmas_controller')
const ProfessoresController = () => import('#controllers/professors_controller')
const MatriculasController = () => import('#controllers/matriculas_controller')
const ProvasController = () => import('#controllers/prova_controller')
const PagamentosController = () => import('#controllers/pagamentos_controller')
const ClassesController = () => import('#controllers/classes_controller')
import AuthController from '#controllers/auth_controller'
import AuthCandidatoesController from '#controllers/auth_candidatoes_controller'


router.post('/login', [AuthController, 'login'])
router.post('/logout', [AuthController, 'logout'])
router.post('/loginC', [AuthCandidatoesController, 'loginC'])
router.post('/logoutC', [AuthCandidatoesController, 'logoutC'])
router.resource('user', UsersController).apiOnly()
router.resource('curso', CursosController).apiOnly()
router.resource('candidato', CandidatosController).apiOnly()
router.resource('turma', TurmasController).apiOnly()
router.resource('professor', ProfessoresController).apiOnly()
router.resource('matricula', MatriculasController).apiOnly()
router.resource('prova', ProvasController).apiOnly()
router.resource('pagamento', PagamentosController).apiOnly()
router.resource('classe', ClassesController).apiOnly()

  router.get('/', async () => {
  return {
    hello: 'world',
  }
})
