const port = 5000
const express = require('express')
const bodyParser = require('body-parser')
const server = express()
const corsConfig = require('./configuracao/cors')
const morgan = require('morgan');
const formidable = require('express-formidable');


server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json({ limit: '10mb' }))
server.use(express.static('public'))
server.timeout  = (1000 * 60 * 3)
server.use(corsConfig)
server.use(morgan('dev'));


server.listen(port, function() {
    console.log(`Servidor executando na porta ${port}.`)
})

module.exports = server