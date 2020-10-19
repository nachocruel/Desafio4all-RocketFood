CREATE DATABASE IF NOT EXISTS desafio4all;

CREATE TABLE cliente (
    id bigint(20) NOT NULL auto_increment,
    nome_completo varchar(240) NOT NULL,
    email varchar(100) UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE hash_cliente (
    id_cliente bigint(20) NOT NULL,
    hash_password varchar(120) NOT NULL,
    PRIMARY KEY (id_cliente, hash_password),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);


CREATE TABLE filme(
    id bigint(20) NOT NULL auto_increment,
    titulo varchar(240) NOT NULL,
    lancamento DATE NOT NULL,
    link_image varchar(200) default null,
    status_filme int(10) default 0,
    diretor varchar(120),
    PRIMARY KEY (id)
);

CREATE TABLE locacao(
   id_cliente bigint(20) NOT NULL,
   id_filme bigint(20) NOT NULL,
   data_de_locacao DATETIME NOT NULL,
   data_de_devolucao DATETIME,
   situacao int(10) default 0,
   PRIMARY KEY (id_cliente, id_filme, data_de_locacao), 
   FOREIGN KEY (id_cliente) REFERENCES cliente(id),
   FOREIGN KEY (id_filme) REFERENCES filme(id)
);