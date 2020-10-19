const db = require('../configuracao/database')
const sequelize = db.sequelize
const { Op } = require("sequelize");
const Filme = require('../models/Filme')
const Status = require('../models/StatusFilme')


async function criarFilme(filme) {
   return new Promise(async (response, reject) => {
      try {
        await sequelize.sync();
        filme = await Filme.create(filme)
        response(filme.toJSON())
      }catch(error) {
          reject({sucesso: false, message: "Ocorreu um erro ao tentar salvar o filme!"})
      }
   })   
}

async function obterFilmesDisponiveis(min, max) {
    return new Promise(async (response, reject) => {
        try {
             const listDeFilmes = await Filme.findAll({
                 where: {status_filme: Status.DISPONIVEL},
                 limit: Number(max),
                 offset: Number(min)
             })
             response(listDeFilmes)
        }
        catch(error) {
            console.error(error)
            reject({sucesso: false, message: "Ocorreu um erro ao buscar os dados!"})
        }
    })
}


async function obterFilmesPorTitulo(textBusca) {
    return new Promise(async (response, reject) => {
        try{
            const listaDeFilmes = await Filme.findAll({
               where: {
                  titulo: {
                      [Op.like]: `%${textBusca}%`
                  }
               },
               limit: 15
            })

            response(listaDeFilmes)
        }catch(error) {
            console.error(error)
        }
    })
}

module.exports = { criarFilme, obterFilmesDisponiveis, obterFilmesPorTitulo }