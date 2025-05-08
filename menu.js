const inquirer = require('inquirer');
const connection = require('./database.js');
const { criarUsuarios } = require('./controllers/userController.js');

function listarUsuarios(){
    connection.query("SELECT * FROM users", (err, results) => {
        if(err) console.error("Erro: ", err);
        else console.table(results);
        mostrarMenu();
    });
}

function criarUsuarios(){
    inquirer.prompt([
        {type: 'input', name: 'nome', message: 'Digite o nome: '},
        {type: 'input', name: 'email', message: 'Digite seu email'}
    ]).then(answers => {
        connection.query("INSERT INTO users (nome, email) VALUES (?, ?)", [answers.nome, answers.email], (err, results) => {
            if (err) console.error("Erro: ", err);
            else console.log("Usuário criado com sucesso! ID: ", results.insertId);
            mostrarMenu();
        });
    });
}

function atualizarUsuarios(){
    inquirer.prompt([
        {type: 'input', name: 'id', message: 'Digite o ID do usuário a ser atualizado: '},
        {type: 'input', name: 'nome', message: 'Digite o novo nome: '},
        {type: 'input', name: 'email', message: 'Digite o novo email: '}
    ]).then(answers => {
        connection.query("UPDATE users SET nome = ?, email = ? WHERE id = ?", [answers.nome, answers.email, answers.id], (err, results) => {
            if (err) console.error("Erro: ", err);
            else if (results.affectedRows === 0) console.log("Usuário não encontrado!");
            else console.log("Usuário atualizado com sucesso!");
            mostrarMenu();
        });
    });
}

function deletarUsuarios(){
    inquirer.prompt([
        {type: 'input', name: 'id', message: 'Digite o ID do usuário a ser deletado: '}
    ]).then(answers => {
        connection.query("DELETE FROM users WHERE id = ?", [answers.id], (err, results) => {
            if (err) console.error("Erro: ", err);
            else if (results.affectedRows === 0) console.log("Usuário não encontrado!");
            else console.log("Usuário excluído com sucesso!");
            mostrarMenu();
        })
    });
}

function mostrarMenu(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'opcao',
            message: 'Escolha uma das opções a seguir: ',
            choices: ['Listar usuários', 'Criar usuário', 'Atualizar usuário', 'Deletar usuário', 'Sair']
        }
    ]).then(answers => {
        switch (answers.opcao) {
            case 'Listar usuários':
                listarUsuarios();
                break;
            case 'Criar usuário':
                criarUsuarios();
                break;
            case 'Atualizar usuário':
                atualizarUsuarios();
                break;
            case 'Deletar usuário':
                deletarUsuarios();
                break;
            case 'Sair':
                connection.end();
                console.log("Saindo...");
                process.exit;
        }
    });
}

mostrarMenu();