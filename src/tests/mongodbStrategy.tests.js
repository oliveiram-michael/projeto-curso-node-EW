const assert = require('assert')
const Mongodb = require('../db/strategies/mongodb/mongoDbStrategy')
const Context = require('../db/strategies/base/contextStrategy')
const heroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
}
const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha - ${Date.now()}`,
    poder: 'Super teia'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino`,
    poder: 'Velocidade'
}
let MOCK_HEROI_ATUALIZAR_ID = ''

let context = {}

describe('MongoDB Suite de testes', function () {
    this.beforeAll(async () => {
        const connection = Mongodb.connect()
        context = new Context(new Mongodb(connection, heroiSchema))
        
        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ATUALIZAR_ID = result._id
    })
    it('Verificar conexão', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'
        assert.deepEqual(result, expected)
    })
    it('Cadastrar', async () => {

        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        // console.log('result', result );
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)

    })
    it('Listar', async () => {

        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })
        const result = { nome, poder }

        assert.deepEqual(result, MOCK_HEROI_DEFAULT)

    })
    it('Atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ATUALIZAR_ID, { nome: 'Pernalonga' })

        assert.deepEqual(result.nModified, 1)

    })
    it('Delete', async () => {
        const result = await context.delete(MOCK_HEROI_ATUALIZAR_ID)
        assert.deepEqual(result.n, 1)

    })

})