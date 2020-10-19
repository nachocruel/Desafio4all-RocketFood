const { DataTypes, Model } = require('sequelize');
const db = require('../configuracao/database');
const sequelize = db.sequelize

class Filme extends Model {}
Filme.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lancamento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    link_image: {
        type: DataTypes.STRING,
    },
    status_filme: {
        type: DataTypes.INTEGER,
    }, 
    diretor: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Filme",
    tableName: "filme",
    createdAt: false,
    updatedAt: false
})
Filme.sync()
module.exports = Filme