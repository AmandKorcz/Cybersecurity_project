const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const autenticarToken = require('../middlewares/auth.js');
const { body, validationResult } = require('express-validator');

router.post('/login', userController.loginUsuario);
router.post('/register', userController.criarUsuarios); 

// Rotas protegidas
router.get('/', autenticarToken, userController.listarUsuarios);
router.put('/:id', autenticarToken, userController.atualizarUsuarios);
router.delete('/:id', autenticarToken, userController.deletarUsuarios);

module.exports = router;
