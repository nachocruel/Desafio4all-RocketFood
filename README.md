# Projeto desafio 4All rocket food.
Este é um projeto para o desafio backend, 4All.

## Requisitos.

- Mysql server 8.0
- NodeJS 12

### Instalação das dependências.
- Instale o NodeJS 12
- Instale o MSQL 8.0
- Entre na pasta 'Desafio4ALL' e faça o import do banco com o comando: mysql -u seu_usuario -p sua_senha desafio4all < desafio4all_database.sql.
- Entre no diretório  'Desafio4All' e digite o comando: npm install.
- Abra o arquivo ./configuracaoe/database.js e configure a conexão de acordo com o seu Mysql db.
- Para rodar o projeto dentro do diretório 'Desafio4All' digite: node app.js
#### Chamadas da API.

### Chamadas do cliente
- **Cadastro Cliente(usuario)**: Para criar um novo Cliente/usuário utilize POST, passando parametros do cliente. Caso Haja sucesso será retornado o cliente/usuário criado.
http://endereco-do-servidor:porta/api/cliar-cliente

Exemplo do que dever ser passado no POST(Ojeto puro):
  {
    "email": "joao@desafio4all.com",
    "nome_completo": "João da Silva",
    "senha": "joao123"
  }

- **Excluir cadastro do cliente(usuario)**: Para excluir a conta do cliente(usuario), utilize o método DELETE, passando como parâmetro o 'ID' do cliente para o endereço: http://endereco-do-servidor:porta/api/excluir-conta

- **Logar Cliente(usuario)**: Para logar o cliente(usuario) utilize o método POST para o endereço: http://endereco-do-servidor:porta/api/logar. Passe no corpo o objeto {email: 'email_do_usuario', senha: 'senha_do_usuario'}.

- **Deslogar Cliente(usuário)**: Para deslogar o usurio utilize o método DELETE para o endereeo: http://endereco-do-servidor:porta/api/deslogar


Nota: Para executar as próximas chamadas o usuário deverá está logado. 

### Chamadas do filme

- **Cadastrar um novo filme**: Para cadastrar um novo filme chame o endereço: http://endereco-do-servidor:porta/api/criar-filme, Para o cadastro do filme deve ser utilizado Form-data, porque 
também deve ser passado a imagem de capa do filme. a imagem deverá se chamar 'capa' na chave. Crie também uma chave chamada 'jsonFilme' e configure o valor da chave com o Objeto Filme em forma de String, conforme no exemplo abaixo, (Pode utilizar JSON.stringify(filme) para transfomar o filme em texto).

{
    "titulo": "Senhor dos Anéis",
    "lancamento": "2001-04-02",
    "status_filme": 0,
    "diretor": "Peter Jackson",
    "link_image": ""
}

Nota: Caso haja sucesso será retornado o objeto criado no database.

- **Buscar filme pelo título** Para buscar um filme pelo titulo chame o endereço http://endereco-do-servido:porta/api/filme-titulo utilizando método GET. Passe como parâmetro o 'text_busca'. Será retornado os filmes que contém os caracteres digitados (obs. serão buscados apenas 15 filmes a cada interacao).

- **Buscar filme disponíveis**: Para buscar os filmes que estão disponíveis chame o enereço http://endereco-do-servidor:porta/filme-disponivel, utilizando método GET. Passe como parâmetros o min e max.
min é a quantidade do skip, max é o número máximo de registros a serem retornados (Util para paginação).

### Locação

- **Locar um filme**: Para locar um filme chame o endereço http://endereco-do-servidor:porta/api/locar-filme
Passe como parâmetro o objeto {id_cliente: bigint, id_filme: bigint}, utilizando objeto puro.

Nota: Caso haja sucesso, será retornado a locação realizada. 

- **Devolver um filme**: Para devolver um filme chame o endereço http://endereco-do-servidor:porta/api/devolver-filme'. Passar como parâmetros. {id_cliente: bigint, id_filme: bigint}, utilizando objeto pro.

- **Obeter locações do cliente**: (GET) Para obeter as locacões do cliente utilize o link http:endere-do-servidor:porta/api/obter-locacoes. Passe como parâmetro o 'id_clinte' .

Nota: Será retornado um lista com os filmes locados.
