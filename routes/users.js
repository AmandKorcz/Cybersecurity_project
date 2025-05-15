const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const autenticarToken = require('../middlewares/auth.js');
const { body, validationResult } = require('express-validator');

router.post('/login', userController.loginUsuario);
router.post(
  '/register',
  [
    body('nome')
      .notEmpty().withMessage('O nome é obrigatório')
      .trim()
      .matches(/^[^<>]*$/).withMessage('O nome não pode conter < ou >')
      .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres')
      .escape(),
    body('email')
      .isEmail().withMessage('E-mail inválido')
      .normalizeEmail(),
    body('senha')
      .notEmpty().withMessage('A senha é obrigatória')
      .isLength({ min: 3 }).withMessage('A senha deve ter no mínimo 3 caracteres')
  ],
  userController.criarUsuarios
);

// Rotas protegidas
router.get('/', autenticarToken, userController.listarUsuarios);
router.put('/:id', autenticarToken, userController.atualizarUsuarios);
router.delete('/:id', autenticarToken, userController.deletarUsuarios);

//Rota de teste CSRF
router.put('/teste-csrf/:id', userController.atualizarUsuarios); 

module.exports = router;