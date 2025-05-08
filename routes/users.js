const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/', userController.listarUsuarios);
router.post('/', userController.criarUsuarios);
router.put('/:id', userController.atualizarUsuarios);
router.delete('/:id', userController.deletarUsuarios);

module.exports = router;
