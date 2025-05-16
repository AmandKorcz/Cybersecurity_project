const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/users.js');
app.use('/', userRoutes);

//Rota de Teste de Requisição 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/login`);
});
