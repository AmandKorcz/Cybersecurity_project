const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({message: "Token não fornecido"});

    jwt.verify(token, 'secreto', (err, usuario) => {
        if (err) return res.status(403).json({message: "Token inválido!"});
        req.usuario = usuario;
        next();
    });
}

module.exports = autenticarToken;