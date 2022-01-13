const Mongoose = require('mongoose')

Mongoose.connect('mongodb://erickwendel:minhasenhasecreta@localhost:27017/herois',
    { useNewUrlParser: true },
    (error) => {
        if (!error) {
            return
        }
        console.log('Falha na conexão', error)
    })

const connection = Mongoose.connection

connection.once('open', () => console.log('Conectando ao database!'))

// setTimeout(() => {
//     const state = connection.readyState
//     console.log('state', state)    
// }, 1000);


const heroiSchema = Mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})
const model = Mongoose.model('heroi', heroiSchema)

async function main() {
    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    })
    console.log('result Cadastrar', resultCadastrar)

    const listItens = await model.find()

    console.log('items', listItens)

}

main()