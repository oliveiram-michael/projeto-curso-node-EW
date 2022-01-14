const assert = require('assert')
const api = require('../api')
const Context = require('./../db/strategies/base/contextStrategy')
const Postgres = require('./../db/strategies/base/postgres/postgresStrategy')
const usuarioSchema = require('./../db/strategies/base/postgres/schemas/usarioSchema')


let app = {}

const USER  ={
    username:  'Xuxadasilva',
    password: '123'
}

const USER_DB = {
    username: USER.username.toLocaleLowerCase(),
    password: '$2b$04$PYgCniE.tmgaBspNFgxlJu60F70yXQiV2pmQ/EsYRroRQWgpu384C'
}

describe('Suite de testes de autenticação', function () {
    this.beforeAll(async () => {
        app = await api
        const connectionPostgree = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgree, usuarioSchema)
        const postgres = new Context(new Postgres(connectionPostgree, model))
        const resultado = await postgres.update(null, USER_DB, true)


    })
    it('Obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'XuxadaSilva',
                password: '123'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })

    it('Deve retornar não autorizado ao entar obter um login incorreto', async () =>{
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'Erickwendel',
                password: '123'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 401)
        assert.deepEqual(dados.error, 'Unauthorized')
    })
})