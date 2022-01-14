const Sequelize = require('sequelize')
const drive = new Sequelize(
    'heroes',
    'erickwendel',
    'minhasenhasecreta',
    {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
    }
)
async function main() {
    const Herois = drive.define('herois', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            required: true,
            primaryKey: true

        },
        nome: {
            type: Sequelize.STRING,
            required: true,

        },
        poder: {
            type: Sequelize.STRING,
            required: true
        }
    },
        {
            tableName: 'TB_HEROIS',
            freezeTableName: false,
            timestamps: false
        }
    )
    await Herois.sync()
    // await Herois.create({
    //     nome: 'Lantera Verde',
    //     poder: 'Anel'
    // })
    const result = await Herois.findAll({
        raw: true, attributes:['nome']
    })

}

main()