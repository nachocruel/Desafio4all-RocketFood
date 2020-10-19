const { DataTypes, Model } = require('sequelize');
const db = require('../configuracao/database')
const sequelize = db.sequelize

class Locacao extends Model {}
Locacao.init({
    id_cliente: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    id_filme: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    data_de_locacao: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    data_de_devolucao: {
        type: DataTypes.DATE
    },
    situacao: {
        type: DataTypes.INTEGER,
    }
},
{
    sequelize,
    modelName: 'Locacao',
    tableName: 'locacao',
    createdAt: false,
    updatedAt: false
}
);
Locacao.sync()
module.exports = Locacao