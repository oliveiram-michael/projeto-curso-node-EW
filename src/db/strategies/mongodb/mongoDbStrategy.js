const IDb = require('../base/interfaceDb');

const Mongoose = require('mongoose')
const STATUS = {
  0: 'Desconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Desconectando'
}

class MongoDBStrategy extends IDb {
  constructor(connection, schema) {
    super();
    this._connection = connection
    this._schema = schema

  }
  async isConnected() {
    const state = STATUS[this._connection.readyState]

    if (state === 'Conectado' || state !== 'Conectando') return state;

    await new Promise(resolve => setTimeout(resolve, 1000))

    return STATUS[this._connection.readyState]
  }
  static connect() {
    Mongoose.connect(process.env.MONGODB_URL,
      { useNewUrlParser: true },
      (error) => {
        if (!error) {
          return
        }
        console.log('Falha na conexão', error)
      })

    const connection = Mongoose.connection
    connection.once('open', () => console.log('Conectando ao database!'))
    return connection
  }
  async create(item) {
    return await this._schema.create(item)
  }
  async read(item, skip = 0, limit = 10) {
    return this._schema.find(item).skip(skip).limit(limit)
    // .skip(skip).limit(limit)
  }
  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item })
  }
  delete(id) {
    return this._schema.deleteOne({ _id: id })
  }
}

module.exports = MongoDBStrategy;
