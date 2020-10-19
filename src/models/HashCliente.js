const { DataTypes, Model } = require('sequelize');
const db = require('../configuracao/database')
const sequelize = db.sequelize


class HashCliente extends Model {}

HashCliente.init({
    id_cliente: {type: DataTypes.BIGINT, allowNull: false, primaryKey: true},
    hash_password: {type: DataTypes.STRING, allowNull: false, primaryKey: true }
}, {
    sequelize,
    modelName: 'HashCliente',
    tableName: 'hash_cliente',
    createdAt: false,
    updatedAt: false
})
HashCliente.sync()
module.exports = HashCliente