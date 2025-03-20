const express = require('express');
const router = express.Router();
const { assignRoles } = require('./Logicgame');

let users = [];
let gameStarted = false;

router.post('/register', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'El nombre de usuario es requerido' });
    }

    if (users.length >= 3) {
        return res.status(400).json({ message: 'El juego ya tiene 3 jugadores' });
    }

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    users.push({ username, role: null });
    res.status(200).json({ message: 'Usuario registrado', users });
});

router.get('/start', (req, res) => {
    if (users.length === 3 && !gameStarted) {
        assignRoles(users);
        gameStarted = true;
        res.status(200).json({ message: 'Juego iniciado', users });
    } else {
        res.status(400).json({ message: 'No se puede iniciar el juego' });
    }
});

module.exports = router;