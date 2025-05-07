const express = require('express');
const router = express.Router();
const connection = require('../database/js');

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

