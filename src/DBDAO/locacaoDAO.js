const db = require('../configuracao/database')
const sequelize = db.sequelize
const Locacao = require('../models/Locacao')
const Filme = require('../models/Filme')
const StatusFilme = require('../models/StatusFilme')
const SituacaoLocacao = require('../models/SituacaoLocacao')
const _ = require('lodash')

async function locarFilme(locacao) {
   return new Promise(async (response, reject) => {
      const trans = await sequelize.transaction();
      try {
       const filme = await Filme.findOne({
            where: {
                id: locacao.id_filme
            }
        });
        
        if(filme) {
            if(filme.status_filme === StatusFilme.DISPONIVEL) {
                const id_filme = locacao.id_filme
                await Filme.update({status_filme: StatusFilme.LOCADO}, {
                    where: {
                        id: id_filme
                    }
                }, {transaction: trans});

                locacao = await Locacao.create(locacao, {transaction: trans});
                
                await trans.commit();
                response(locacao.toJSON())
            } else {
                reject({sucesso: false, message: "O filme já foi locado, não é possível fazer a locação!"})
            }
        } else {
            reject({sucesso: false, message: "Erro inesperado, o filme não foi encontrado!"})
        }
      } catch(error) {
          console.error(error)
          trans.rollback();
          reject({sucesso: false, message: "Ocorreu um erro ao tentar salvar a locação!"})
      }
   })   
}


function devolverFilme(locacao) {
   return new Promise(async (response, reject) => {
    const trans = await sequelize.transaction();
    try {
        await Locacao.update({
            situacao: SituacaoLocacao.FECHADA,
            data_de_devolucao: new Date()
        }, {
            where: {
                id_cliente: locacao.id_cliente,
                id_filme: locacao.id_filme
            }
        }, {transaction: trans})

        const filme = await Filme.update({status_filme: StatusFilme.DISPONIVEL}, {
            where: {
                id: locacao.id_filme
            }
        }, {transaction: trans})

        response({sucesso: true, message: "Devolução realizada com sucesso!"})
    } catch(error) {
        console.error(error)
        await trans.rollback();
        reject({sucesso: false, message: "Não foi possível efetuar a devolução!"})
    }
   })
}


function obterLocacoes(id_cliente) {
    return new Promise(async (response, reject) => {
        try {
           const listaLocacoes = await Locacao.findAll({
             where: {
                id_cliente: id_cliente
             }
           })

           const listaFilmes = []
           let count = 0
           _.forEach(listaLocacoes, async (locacao) => {
              const filme = await Filme.findOne({
                 where: {
                    id: locacao.id_filme
                 }
              })
              listaFilmes.push(filme)

              count+=1;
              if(count === listaLocacoes.length) {
                 response(listaFilmes)
              }
           })

           if(listaLocacoes.length === 0){
               response(listaFilmes)
           }

        } catch(error) {
            console.error(error)
            reject({sucesso: false, message: "Ocorreu um erro interno ao buscar as locações"})
        }
    })
}

module.exports = { locarFilme, obterLocacoes, devolverFilme }