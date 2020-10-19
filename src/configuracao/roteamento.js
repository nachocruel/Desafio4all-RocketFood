const express = require('express')
const db = require('./database')
const session = require('express-session');
const { logarUsuario, criarCliente } = require('../DBDAO/clienteDAO');
const clienteDAO = require('../DBDAO/clienteDAO');
const filmeDAO = require('../DBDAO/filmeDAO')
const locacaoDAO = require('../DBDAO/locacaoDAO');
const port = 5000
const endereco_do_servidor = `http://localhost:${port}/uploads`
const formidable = require('express-formidable');
const SituacaoLocacao = require('../models/SituacaoLocacao');

module.exports = (server) => {
  // Configura rota para acessar na api
  const router = express.Router()
  server.use(session({resave: true, saveUninitialized: true, secret: "segredo da sessao", cookie: { maxAge: 120000 }}));
  server.use('/api', router)
  
  router.route('/cliar-cliente').post((req, res) => {
    criarCliente(req.body).then((result) => {
      res.status(200).send(result)
    }).catch((error) => {
      res.status(500).send(error)
    })
  })
  
  router.route('/logar').post((req, res) => {
    const loginData = req.body
    logarUsuario(loginData.email, loginData.senha).then((cliente) => {
      req.session['user'] = cliente
      res.status(200).send(cliente)
    }).catch((error) => {
      res.status(500).send(error)
    })
  })


  router.route('/deslogar').delete((req, res) => {
    req.session.destroy((error) => {
      if(!error) {
        res.status(200).send({sucesso: true, message: "Usuário deslogado com sucesso!"})
      } else {
        res.status(500).send({sucesso: false, message: "Ocorreu um erro ao tentar deslogar!"})
      }
    })
  })

  router.route('/excluir-conta').delete((req, res) => {
    if(req.session.user) {
      const id = req.query.id
      clienteDAO.excluirConta(id).then((result) => {
        req.session.destroy((error) => {
          if(!error){
            console.warn(result)
            res.status(200).send(result)
          } else {
            res.status(500).send({sucesso: false, message: "Ocorreu um erro interno!"})
          }
        })
      }).catch((error) => {
        res.status(500).send(error)
      })
    } else {
       res.status(500).send({sucesso: false, message: "Ocorreu um erro interno!"})
    }
  })


  // Rota locação
  // loca filme
  router.route('/locar-filme').post((req, res) => {
    if(req.session.user) {
      const locacao = {
        id_cliente: req.body.id_cliente,
        id_filme: req.body.id_filme,
        data_de_locacao: new Date(),
        data_de_devolucao: null,
        situacao: SituacaoLocacao.ABERTA
      }

      locacaoDAO.locarFilme(locacao).then((result) => {
        res.status(200).send(result)
      }).catch(error => {
        res.status(500).send(error)
      })
    }else{
      res.status(500).send({sucesso: false, message: "Ocorreu um erro interno!"})
    }
  })


  router.route('/devolver-filme').put((req, res) => {
    if(req.session.user) {
      locacaoDAO.devolverFilme(req.body).then((result) => {
        res.status(200).send(result)
      }).catch((error) => {
        res.status(500).send(error)
      })
    } else {
      res.status(500).send({sucesso: false, message: "Ocorreu um erro interno!"})
    }
  })


  router.route('/obter-locacoes').get((req, res) => {
    if(req.session.user) {
      locacaoDAO.obterLocacoes(req.query.id_cliente).then((result) => {
        res.status(200).send(result)
      }).catch((error) => {
        res.status(500).send(error)
      })
    } else {
      res.status(500).send({sucesso: false, message: "Ocorreu um erro interno!"})
    }
  })

  // Rotas criação de filme e busca
  router.use(formidable({
    encoding: 'utf-8',
    uploadDir: './public/uploads',
    multiples: true,
    keepExtensions:true
 }))

  router.route('/criar-filme').post((req, res) => {
    if(req.session.user) {

       let pathFile  = ""
       if(req.files && req.files.capa) {
          req.files.capa.path = req.files.capa.path.replace(/\\/g, '/') // altera barra invertida se windows
          console.warn(req.files.capa.path.split('/'))
          pathFile = endereco_do_servidor + "/" + req.files.capa.path.split('/')[2]
       }
        
       let filme = null
       if(req.fields && req.fields.jsonFilme) {
          filme = JSON.parse(req.fields.jsonFilme)
       }

       if(!filme) {
         res.status(500).send({sucesso: false, message: "Ocorreu um erro interno!"})
         return;
       }
        
        filme.link_image = pathFile

        filmeDAO.criarFilme(filme).then((filme) => {
          res.status(200).send(filme)
        }).catch(error => {
          res.status(500).send(error)
        })
    } else {
      res.status(500).send({sucesso: false, message: "Ocorreu um erro interno!"})
    }
  })


  router.route('/filme-titulo').get((req, res) => {
     if(req.session.user) {
       filmeDAO.obterFilmesPorTitulo(req.query.text_busca).then((result) => {
           res.status(200).send(result)
       }).catch(error => {
           res.status(500).send(error)
       })
     } else {
          res.status(500).send({sucesso: false, message: "Ocorreu um erro interno!"})
     }
  })


  router.route('/filme-disponivel').get((req, res) => {
    if(req.session.user) {
      const min = req.query.min
      const max = req.query.max
      filmeDAO.obterFilmesDisponiveis(min, max).then((result) => {
        res.status(200).send(result)
      }).catch(error => {
        res.status(200).send(error)
      })
    } else {
      res.status(500).send({sucesso: false, message: "Ocorreu um erro interno!"})
    }
  })

}