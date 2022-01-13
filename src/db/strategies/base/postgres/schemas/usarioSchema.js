const Sequelize = require('sequelize')

const usuarioSchema = {
    name: 'usuarios',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            required: true,
            primaryKey: true

        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            required: true,

        },
        password: {
            type: Sequelize.STRING,
            required: true
        }
    },
    options: {
        tableName: 'TB_USUARIOS',
        freezeTableName: false,
        timestamps: false
    }

}

module.exports = usuarioSchema