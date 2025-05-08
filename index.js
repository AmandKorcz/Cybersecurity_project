const express = require('express');
const router = express.Router();
const connection = require('./database.js');

app.use(express.json());
app.use('/', router);

//GET - Endpoint para listar os usuários cadastrados
router.get('/', (req, res) =>{
    connection.query("SELECT * FROM users", (err, results) =>{
        if(err) return res.status(500).json({erro: err});
        res.status(200).json(results);
    });
});

//POST - Endpoint para criar novos usuários 
router.post('/', (req, res) =>{
    const {nome, email} = req.body;
    if (!nome || !email) return res.status(400).json({message: "Nome e email são chaves obrigatórias"});

    connection.query("INSERT INTO users (nome, email) VALUES (?, ?)", [nome, email], (err, results) =>{
        if (err) return res.status(500).json({erro: err});
        res.status(201).json({message: "Usuário criado com sucesso", id: results.insertId});
    });
});

//PUT - Endpoint para atualizar cadastros dos usuários
router.put('/', (req, res) =>{
    const {id} = req.params;
    const {nome, email} = req.body;

    connection.query("UPDATE users SET nome = ?, email = ? WHERE id = ?", [nome, email, id], (err, results) =>{
        if (err) return res.status(500).json({erro: err});
        if (results.affectedRows === 0) return res.status(404).json({message: 'Usuário não encontrado'});
        res.status(200).json({message: 'Usuário atualizado com sucesso'});
    });
});

//DELETE - Endpoint para deletar cadastro de usuários
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    connection.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({erro: err});
        if (results.affectedRows === 0) return res.status(404).json({message: 'Usuário não encontrado'});
        res.status(200).json({message: 'Usuário excluído com sucesso'});
    });
});

module.exports = router;