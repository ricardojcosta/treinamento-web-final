DROP SCHEMA IF EXISTS webapp;
CREATE SCHEMA webapp;
USE webapp;

DROP USER IF EXISTS 'webapp';
CREATE USER 'webapp'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
GRANT ALL PRIVILEGES ON webapp.* TO 'webapp'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS webapp.usuario(
	codigoUsuario INTEGER PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255)  NOT NULL
);

CREATE TABLE IF NOT EXISTS webapp.curso(
	codigoCurso INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) UNIQUE NOT NULL,
    duracao INTEGER NOT NULL,
    instituicao VARCHAR(50)
);


INSERT INTO webapp.usuario (email, senha)
VALUES('admin@treinamento.com.br','$2y$10$SQj2BSSsmiZEo9yKHZeEJOyFbhw5kdis5dT/bTDd.paBMrhxLU89S');

INSERT INTO webapp.usuario (email, senha)
VALUES('cliente@treinamento.com.br','$2y$10$SQj2BSSsmiZEo9yKHZeEJOyFbhw5kdis5dT/bTDd.paBMrhxLU89S');


SELECT * FROM webapp.viagem;
SELECT * FROM webapp.curso;
