const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const Mongodb = require('./db/strategies/mongodb/mongoDbStrategy')
const heroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')

const app = new Hapi.Server({port: 5000})

async function main(){
    const connection = Mongodb.connect()
    const context =  new Context( new Mongodb(connection, heroiSchema))
    
    app.route([
        {
            path: '/herois',
            method: 'GET',
            handler: (request, head) =>{
                return context.read()
            }
        }
    ])

    await app.start()
    console.log('Serviço da API rodando na porta',app.info.port)
}

main()