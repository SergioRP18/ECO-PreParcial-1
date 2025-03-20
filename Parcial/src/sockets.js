const { assignRoles } = require('./Logicgame');

module.exports = (io) => {
    let users = [];

    io.on('connection', (socket) => {
        console.log('Nuevo usuario conectado');

        socket.on('usuarioRegistrado', (username) => {
            users.push({ username, id: socket.id });
            io.emit('nuevoUsuario', username);

            if (users.length === 3) {
                assignRoles(users);
                io.emit('roleAssigned', users);
            }
        });

        socket.on('iniciarJuego', () => {
            assignRoles(users);
            io.emit('roleAssigned', users);
        });

        socket.on('gritarMarco', () => {
            io.emit('marcoGritado');
        });

        socket.on('gritarPolo', (username) => {
            io.emit('poloGritado', username);
        });

        socket.on('seleccionarPolo', (selectedPolo) => {
            const marco = users.find(user => user.role === 'Marco');
            const poloEspecial = users.find(user => user.role === 'Polo Especial');

            if (selectedPolo === poloEspecial.username) {
                io.emit('finJuego', { ganador: marco.username });
            } else {
                io.emit('finJuego', { perdedor: marco.username });
            }
        });

        socket.on('disconnect', () => {
            users = users.filter(user => user.id !== socket.id);
            console.log('Usuario desconectado');
        });
    });
};