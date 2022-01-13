const assert = require('assert')
const exp = require('constants')
// const { AssertionError } = require('assert/strict')
const api = require('./../api')

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ilh1eGFkYVNpbHZhIiwiaWQiOjEsImlhdCI6MTYzODc5OTA2NX0.KwY_nYV2FuYS2o_Cs3l3b_hlg65Es2FXcOwEtfyfsoM'
const headers = {
    Authorization: TOKEN
}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}
const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'A mira'
}
let MOCK_ID = ''
describe('Suite de testes API Heroes', function () {
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })
        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id

    })
    it('listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?skip=0&limit=1000'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })
    it('listar /herois deve retornar somente 10', async () => {
        const TAMANHO_LIMITE = 10

        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length, TAMANHO_LIMITE)
    })
    it('Listar /herois - deve retornar Erro interno no servidor', async () => {
        const TAMANHO_LIMITE = 'AEE'

        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const errorResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": ["limit"]
            }
        }
        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(errorResult))

    })
    it('listar /herois filtrar por nome', async () => {
        const TAMANHO_LIMITE = 100
        const NAME = MOCK_HEROI_INICIAL.nome
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados[0].nome, NAME)

    })
    it('Cadastrar POST - /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            headers,
            url: '/herois',
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
        })
        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, 'Heroi cadastrado com sucesso!')

    })

    it('Atualizar PATCH /herois/:id', async () => {
        const _id = MOCK_ID

        const expected = {
            poder: 'Super Mira'
        }

        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!')

    })

    it('Atualizar PATCH /herois/:id - não deve atualizar com id incorreto', async () => {
        const _id = `61aa7505f84d731dccad41a8`

        

        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${_id}`,
            payload: JSON.stringify({
                poder: 'Super Mira'
            })
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'ID do objeto não encontrado'
          }
        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })

    it('Remover DELETE -/herois/:id', async () => {
        const _id = MOCK_ID
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        })
        
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi Removido com sucesso!')
    })

    it('Remover DELETE -/herois/:id não deve deletar com id incorreto', async () => {
        const _id = '61aa7505f84d731dccad41a8'
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        })
        
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'ID do objeto não encontrado'
          }

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })
})