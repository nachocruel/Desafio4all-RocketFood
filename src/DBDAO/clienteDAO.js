const db = require('../configuracao/database')
const sequelize = db.sequelize
const Cliente = require('../models/Cliente')
const HahsCliente = require('../models/HashCliente')
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function criarCliente(cliente) {
    return new Promise((response, reject) => {
      bcrypt.hash(cliente.senha, saltRounds).then(async (hash) => {
          const transaction = await sequelize.transaction()
          try {
            cliente = await Cliente.create(cliente, {transaction: transaction});
            await HahsCliente.create({id_cliente: cliente.id, hash_password: hash}, {transaction: transaction});
            transaction.commit();
            response(cliente.toJSON())
          } catch(error) {
              console.error(error)
              await transaction.rollback();
              reject({sucesso: false, message: "Ocorreu um erro ao tentar salvar o cliente!"});
          }
      }).catch((error) => {
           console.error(error)
           reject({sucesso: false, message: "Ocorreu um erro ao tentar salvar o cliente!"})
      })
    })   
}

async function excluirConta(id) {
    return new Promise(async (response, reject) => {
        const transaction = await sequelize.transaction()
        try
       {
          await HahsCliente.destroy({
             where: {id_cliente: id}
          }, {transaction: transaction})

          await Cliente.destroy({
              where: {id: id}
          }, {transaction: transaction})
   
          await transaction.commit();
          response({sucesso: true, message: "Conta exluida com sucesso!"})
      }
      catch(error) {
        await transaction.rollback()
        console.error(error)
        reject({sucesso: false, message: "Ocorreu um erro, não foi possível excluir a conta do cliente!"})
      }
  })
}


async function logarUsuario(email, senha) {
    return new Promise(async (response, reject) => {
        try{
            const cliente = await Cliente.findOne({
                where: {
                    email: email
                }
            })

            if(!cliente) {
                reject({sucesso: false, message: "Usuário e/ou senha estão incorretos!"})
            }

            const hashList = await HahsCliente.findAll({
                where: {
                    id_cliente: cliente.id
                }
            })

          let count = 0
          hashList.forEach(async (hashCliente) => {
                await bcrypt.compare(senha, hashCliente.hash_password).then((result)=> {
                   if(result) {
                       console.warn('******usuario logado!*******')
                       response(cliente.toJSON())
                   }

                   count+=1;
                   if(count === hashList.length) {
                      reject({sucesso: false, message: "Usuário e/ou senha estão incorretos!"})
                   }
                }).catch((error) => {
                    console.error(error)
                });
            })
        } catch(error) {
            console.error(error)
            reject({sucesso: false, message: "Ocorreu um erro ao tentar salvar o cliente!"})
        }
    })
}

module.exports = { criarCliente, logarUsuario, excluirConta }