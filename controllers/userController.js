const connection = require('../database');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//GET - Endpoint para listar os usuários cadastrados
exports.listarUsuarios = (req,res) => {
    connection.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).json({erro: err});
        res.status(200).json(results);
    });
};

//POST - Endpoint para criar novos usuários 
exports.criarUsuarios = async (req, res) => {
    const { nome, email, senha } = req.body;
    console.log("Dados recebidos:", { nome, email, senha }); 

    if (!nome || !email || !senha) {
        console.log("Faltando campos obrigatórios");
        return res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
    }

    try {
        console.log("Iniciando criptografia da senha");
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        console.log("Senha criptografada com sucesso");

        connection.query(
            "INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)",
            [nome, email, senhaCriptografada],
            (err, results) => {
                if (err) {
                    console.log("Erro ao inserir no MySQL:", err);
                    return res.status(500).json({ erro: err.message });
                }
                console.log("Usuário inserido com sucesso, ID:", results.insertId);
                res.status(201).json({
                    message: "Usuário criado com sucesso",
                    id: results.insertId,
                });
            }
        );
    } catch (error) {
        console.log("Erro geral no try:", error);
        res.status(500).json({ erro: error.message });
    }
};

//PUT - Endpoint para atualizar cadastros dos usuários
exports.atualizarUsuarios = (req, res) =>{
    const {id} = req.params;
    const {nome, email} = req.body;

    connection.query("UPDATE users SET nome = ?, email = ? WHERE id = ?", [nome, email, id], (err, results) =>{
        if (err) return res.status(500).json({erro: err});
        if (results.affectedRows === 0) return res.status(404).json({message: 'Usuário não encontrado'});
        res.status(200).json({message: 'Usuário atualizado com sucesso'});
    });
};

//DELETE - Endpoint para deletar cadastro de usuários
exports.deletarUsuarios = (req, res) => {
    const {id} = req.params;
    connection.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({erro: err});
        if (results.affectedRows === 0) return res.status(404).json({message: 'Usuário não encontrado'});
        res.status(200).json({message: 'Usuário excluído com sucesso'});
    });
};

//LOGIN do usuário
exports.loginUsuario = (req, res) => {
    const {email, senha} = req.body;
    if (!email || !senha) return res.status(400).json({message: "Email e senha são obrigatórios"});

    connection.query("SELECT * FROM users WHERE email = ?", [email], async(err, results) => {
        if (err) return res.status(500).json({erro: err});
        if (results.length === 0) return res.status(401).json({message: "Usuário não encontrado"});

        const usuario = results[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) return res.status(401).json({message: "Senha ou email incorretos."});

        const token = jwt.sign ({id: usuario.id, email: usuario.email}, 'secreto', {expiresIn: '1h'});
        res.status(200).json({message: "Login realizado com sucesso", token});
    });
};