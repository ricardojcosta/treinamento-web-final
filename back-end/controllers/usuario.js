const bcrypt = require('bcryptjs'); // Biblioteca para geração do HASH de senhas.
var jwt = require('jsonwebtoken'); // Biblioteca para geração do token de autenticação.

module.exports = function Usuario (app) {

    //-----------------------------------------------------------------------------------------------------------
    // Adiciona novo usuário ao banco de dados.
    app.post('/usuario', async (req, res) => {

        //---------------------------------------------------------------------------------------
        // Realiza validações:
        if (req.body.email === undefined)
            return res.status(400).json({ message: 'Email não informado' });

        if (!req.body.email.includes('@eventos.org'))
            return res.status(400).json({ message: 'Email inválido' });

        if (req.body.senha === undefined)
            return res.status(400).json({ message: 'Senha não informada' });

        if (req.body.senha.length < 5)
            return res.status(400).json({ message: 'Senha não atende aos requisitos mínimos' });

        //--------------------------------------------------------------------
        // Gera hash para não salvar a senha em texto plano no banco de dados.
        const hash = bcrypt.hashSync(req.body.senha, 10);

        //-------------------------------------------------------------------
        // Tenta adicionar usuário, retorna erro caso não consiga.
        try {

            await req.dbConn.query(
                'INSERT INTO webapp.usuario (email, senha) VALUES(?,?);',
                [req.body.email, hash]
            );

            return res.status(201).json({ message: 'Usuário adicionado com sucesso' });

        } catch (err) {
            res.status(500).json({ message: 'Erro ao adicionar usuário', error: String(err) });
        }

    });

    //-----------------------------------------------------------------------------------------------------------
    // Realiza login do usuário: Devolve token caso email e senha correta.

    app.post('/usuario/login', async (req, res) => {

        //---------------------------------------------------------------------------------------
        // Realiza validações:
        if (req.body.email === undefined)
            return res.status(400).json({ message: 'Email não informado' });

        if (req.body.senha === undefined)
            return res.status(400).json({ message: 'Senha não informada' });

        //----------------------------------------------------------------------
        // Requisições ao banco sempre dentro do try para pegar possíveis erros.
        // Exemplo: perda de conexão com o banco.
        try {

            // Faz busca no banco pelo email do usuário.
            const [[usuario]] = await req.dbConn.query(
                'SELECT * FROM webapp.usuario WHERE email LIKE ?;',
                [req.body.email]
            );

            // Caso não encontre nada, retorna 401.
            if (usuario === undefined)
                return res.status(401).json({ message: 'Usuário não encontrado' });

            // Verifica hash do banco com a senha informada.
            if (bcrypt.compareSync(req.body.senha, usuario.senha) === false)
                return res.status(401).json({ message: 'Senha Incorreta' });

            // Remove senha do objeto usuário para não enviar junto ao token.
            delete usuario.senha;

            // Gera token codificado com os dados do usuário.
            const token = jwt.sign(usuario, 'jwt-secret', {
                expiresIn: 4 * 60 * 60 // Validade do token de 4 horas.
            });

            return res.status(200).json({ message: 'Login realizado com sucesso', token: token });

        } catch (err) {
            res.status(500).json({ message: 'Erro ao adicionar usuário', error: String(err) });
        }

    });

}
