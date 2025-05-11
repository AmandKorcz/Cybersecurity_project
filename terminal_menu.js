const inquirer = require('inquirer').default;
const connection = require('./database.js');
const axios = require("axios");
let token = null;

function loginUsuario(){
    inquirer.prompt([
        {type: 'input', name: 'email', message: 'Digite seu email: '},
        {type: 'password', name: 'senha', message: 'Digite sua senha: '}
    ]).then(async answers => {
        try{
            const response = await axios.post('http://localhost:3000/login', {
                email: answers.email,
                senha: answers.senha
            });
            token = response.data.token;
            console.log("Login realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao fazer login: ", error.response?.data?.message || error.message);
        } finally {
            mostrarMenu();
        }
    });
}

async function listarUsuarios(){
    try{
        const response = await axios.get('http://localhost:3000/', {
            headers: {Authotization: `Bearer ${token}`}
        });
        console.table(response.data);
    }catch (error){
        console.error("Erro: ", error.response?.data?.message || error.message);
    }finally{
        mostrarMenu();
    }
}

function criarUsuarios(){
    inquirer.prompt([
        {type: 'input', name: 'nome', message: 'Digite o nome: '},
        {type: 'input', name: 'email', message: 'Digite seu email'},
        {type: 'input', name: 'senha', message: 'Digite a senha: '}
    ]).then(async answers => {
        try {
            const response = await axios.post('http://localhost:3000/', {
                nome: answers.nome,
                email: answers.email,
                senha: answers.senha
            });
            console.log("✅ Usuário criado com sucesso! ID:", response.data.id);
        } catch (error) {
            console.error("Erro:", error.response?.data?.message || error.message);
        } finally {
            mostrarMenu();
        }
    });
}

function atualizarUsuarios(){
    inquirer.prompt([
        {type: 'input', name: 'id', message: 'Digite o ID do usuário a ser atualizado: '},
        {type: 'input', name: 'nome', message: 'Digite o novo nome: '},
        {type: 'input', name: 'email', message: 'Digite o novo email: '}
    ]).then(async answers => {
        try {
            const response = await axios.put(`http://localhost:3000/${answers.id}`, {
                nome: answers.nome,
                email: answers.email
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("✅", response.data.message);
        } catch (error) {
            console.error("Erro:", error.response?.data?.message || error.message);
        } finally {
            mostrarMenu();
        }
    });
}

function deletarUsuarios(){
    inquirer.prompt([
        {type: 'input', name: 'id', message: 'Digite o ID do usuário a ser deletado: '}
    ]).then(async answers => {
        try {
            const response = await axios.delete(`http://localhost:3000/${answers.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("✅", response.data.message);
        } catch (error) {
            console.error("Erro:", error.response?.data?.message || error.message);
        } finally {
            mostrarMenu();
        }
    });
}

function mostrarMenu(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'opcao',
            message: 'Escolha uma das opções a seguir: ',
            choices: ['Login','Listar usuários', 'Criar usuário', 'Atualizar usuário', 'Deletar usuário', 'Sair']
        }
    ]).then(answers => {
        switch (answers.opcao) {
            case 'Login':
                loginUsuario();
                break;
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