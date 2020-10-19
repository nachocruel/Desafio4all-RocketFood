const { Sequelize } = require('sequelize');
const dbServer = "127.0.0.1"
const port = 3306
const dbSenha = "toor"
const usuario = "edvan"
const dbName = 'desafio4all'
const sequelize = new Sequelize(`mysql://${usuario}:${dbSenha}@${dbServer}:${port}/${dbName}`,
{
    logging: console.log,                  // Apresentador de log padrão
    logging: (msg) => {
        console.error(msg)
    }, // Apresentar a mensagem de log na integra
    logging: true,                       // Habilita ou desabilita os logs
    //logging: msg => logger.debug(msg),     // Usa um customizador de logs
    //logging: logger.debug.bind(logger)     // Jeito alternativo de utilizar o log customizado
}
)  // Conexão com Mysql databases


async function TestarConexao() {
    try {
        await sequelize.authenticate();
        console.log('conectado com sucesso!')
        return {conectado: true, message: "conectado com sucesso!"};
    } catch (error) {
        console.error('Não foi possivel conectar aos dados!', error);
        return {conectado: false, error: 'Não foi possível conectar aos dados!'};
    }
}

module.exports = { TestarConexao, sequelize }