const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || 'dev'
ok(env === 'prod' || env === 'dev', 'a env é inválida, ou dev ou prod')

const configPath = join(__dirname, './../config/', `env.${env}`)

config({
    path: configPath
})

const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const Mongodb = require('./db/strategies/mongodb/mongoDbStrategy')
const heroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const HeroRoutes = require('./routes/heroRoute')
const AuthRoutes = require('./routes/authRoutes')
const app = new Hapi.Server({ port: process.env.PORT })
const Postgres = require('./db/strategies/base/postgres/postgresStrategy')
const UsuarioSchema = require('./db/strategies/base/postgres/schemas/usarioSchema')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const HapiJwt = require('hapi-auth-jwt2')

const JWT_SECRET = process.env.JWT_KEY

process.env
function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}
async function main() {
    const connection = Mongodb.connect()
    const context = new Context(new Mongodb(connection, heroiSchema))

    const connectionPostgree = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgree, UsuarioSchema)

    const contextPostgres = new Context(new Postgres(connectionPostgree, model))
    console.log('conectado', await contextPostgres.isConnected())

    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }

    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 1000
        // }
        validate: async (dados, request) => {
            // verifica no banco se usuario continua ativo
            // verifica no banco se usuario continua pagando
            const [result] = await contextPostgres.read({
                username: dados.username.toLowerCase()
            })
            if (!result) {
                return {
                    isValid: false
                }
            }
            return {
                isValid: true // caso não válido false
            }
        }
    })

    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods())
    ])

    await app.start()
    console.log('Serviço da API rodando na porta', app.info.port)

    return app
}

module.exports = main()