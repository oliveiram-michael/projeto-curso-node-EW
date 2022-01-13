const assert = require('assert')
const Postgres = require('../db/strategies/base/postgres/postgresStrategy')
const Context = require('../db/strategies/base/contextStrategy')
const heroiSchema = require('../db/strategies/base/postgres/schemas/heroiSchema')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Gavião Negro',
    poder: 'Flechas'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
}

let db= null
let context = {}

describe('Postgres Strategy', function () {
    this.timeout(Infinity)
    this.beforeAll(async function(){
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, heroiSchema)
        context = new Context(new Postgres(connection, model))

        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)
        
    })
    it('PostgresSQL Connection', async () => {
        
        const result = await context.isConnected()
        assert.equal(result, true)
    })
    it('cadastrar', async function () {

        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })  
    it('Listar', async function (){
        const [result]= await context.read({nome: MOCK_HEROI_CADASTRAR.nome})
        // pegar a primeira opção 
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    }) 
    it('Atualizar', async function() {
        const [itemAtualizar]  = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome})
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher Maravilha'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({id: itemAtualizar.id})
        assert.deepEqual(itemAtualizado.nome, novoItem.nome)
        assert.deepEqual(result, 1)
        /*
        No Javascript temos uma tecnica chamad rest/spread que é usada para mergear objetos ou separá-lo
        {
            nome: "Batman",
            poder: "Dinheiro"
        }

        {
            dataNascimento: '1988-01-01'
        }
        ** final
        {
            nome: "Batman",
            poder: "Dinheiro",
            dataNascimento: '1988-01-01'

        }
        */

    })
    it('Remover por id', async function (){
        const [item] = await context.read({})
        const result = await context.delete(item.id)
        assert.deepEqual(result, 1)

    })

})
