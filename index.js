const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos do frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
const userRoutes = require('./routes/users.js');
app.use('/', userRoutes);

// Rota de fallback para páginas HTML (opcional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
