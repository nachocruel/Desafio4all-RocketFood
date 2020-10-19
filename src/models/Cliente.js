const { DataTypes, Model } = require('sequelize');
const db = require('../configuracao/database')
const sequelize = db.sequelize
class Cliente extends Model {}

Cliente.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        nome_completo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            senha: DataTypes.STRING
        }
    },
    {
        sequelize,
        modelName: 'Cliente',
        tableName: 'cliente',
        createdAt: false,
        updatedAt: false
    }
)
Cliente.sync();
module.exports = Cliente
