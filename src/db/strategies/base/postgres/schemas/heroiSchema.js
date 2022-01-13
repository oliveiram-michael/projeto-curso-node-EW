const Sequelize = require('sequelize')

const heroiSchema = {
    name: 'herois',
    schema: {
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
    options: {
        tableName: 'TB_HEROIS',
        freezeTableName: false,
        timestamps: false
    }

}

module.exports = heroiSchema