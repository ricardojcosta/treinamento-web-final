//-----------------------------------------------------------------------------------------------------------
// Bibliotecas utilizadas no projeto.
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dbPool = require('./middlewares/dbPool');
const Usuario = require('./controllers/usuario');
const Curso = require('./controllers/curso');

//-----------------------------------------------------------------------------------------------------------
// Inicialização e configurações do express.
let app = express();
app.use(express.json());
app.use(logger('dev'));
app.use(cors());
app.use(dbPool);

//----------------------------------------------------------------------------------------------------------
// Registra os controllers.
Usuario(app);
Curso(app);

//----------------------------------------------------------------------------------------------------------
// Inicia Aplicação.
app.listen(3000, () => {
    console.log('App Iniciado');
});
