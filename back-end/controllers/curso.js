const auth = require('../middlewares/auth');

module.exports = function Curso(app) {

    //-----------------------------------------------------------------------------------------------------------
    // Retorna Lista de viagens
    app.get('/curso', auth, async (req, res) => {

        // Realiza consulta.
        const [rows] = await req.dbConn.query(
            'SELECT * FROM webapp.curso;'
        );

        res.status(200).json(rows);
    });

    //-----------------------------------------------------------------------------------------------------------
    // Retorna curso com id
    app.get('/curso/:id', auth, async (req, res) => {

        const [curso] = await req.dbConn.execute(
            'SELECT * FROM webapp.curso WHERE codigoCurso = ?', [req.params.id]
        );

        res.status(200).json(curso[0]);
    });

    //-----------------------------------------------------------------------------------------------------------
    // Cria uma curso com os campos do body
    app.post('/curso', auth, async (req, res) => {

        if (!req.decodedToken.email.includes('admin'))
            return res.status(401).json({ message: 'Você não tem permissão para realizar esta operação' });

        try {

            await req.dbConn.execute(
                'INSERT INTO webapp.curso ' +
                '(nome, duracao, instituicao)' +
                'VALUES(?,?,?);',
                [
                    req.body.nome,
                    req.body.duracao,
                    req.body.instituicao

                ]
            );

            res.status(201).json({ message: 'Dados armazenados com sucesso' });

        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    });

    //-----------------------------------------------------------------------------------------------------------
    // Atualiza uma curso pelo id com os campos do body
    app.put('/curso/:id', auth, async (req, res) => {

        if (!req.decodedToken.email.includes('admin'))
            return res.status(401).json({ message: 'Você não tem permissão para realizar esta operação' });

        try {

            await req.dbConn.execute(
                'UPDATE webapp.curso ' +
                'SET nome = ?,' +
                'duracao = ?,' +
                'instituicao = ? ' +
                'WHERE codigoCurso = ?',
                [
                    req.body.nome,
                    req.body.duracao,
                    req.body.instituicao,
                    req.params.id
                ]
            );

            res.status(201).json({ message: 'Dados armazenados com sucesso' });

        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    });

    //-----------------------------------------------------------------------------------------------------------
    // Remove uma curso pelo ID
    app.delete('/curso/:id', auth, async (req, res) => {

        if (!req.decodedToken.email.includes('admin'))
            return res.status(401).json({ message: 'Você não tem permissão para realizar esta operação' });

        await req.dbConn.execute(
            'DELETE FROM webapp.curso WHERE codigoCurso = ?', [req.params.id]
        );

        res.status(200).json({ message: 'curso removido com sucesso' });
    });
}
