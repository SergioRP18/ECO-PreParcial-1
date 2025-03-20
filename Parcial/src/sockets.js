const { assignRoles } = require('./Logicgame');

module.exports = (io) => {
    let users = [];
    let polosQueRespondieron = [];

    io.on('connection', (socket) => {
        console.log('Nuevo usuario conectado');
        
        socket.on('usuarioRegistrado', (username) => {
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
            polosQueRespondieron = [];
        });

        socket.on('gritarPolo', (username) => {
            polosQueRespondieron.push(username);
            io.emit('poloGritado', username);

            const polos = users.filter(user => user.role === 'Polo' || user.role === 'Polo Especial');
            if (polosQueRespondieron.length === polos.length) {
                const marco = users.find(user => user.role === 'Marco');
                if (marco) {
                    io.to(socket.id).emit('mostrarPolos', polosQueRespondieron);
                }
            }
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
    });
};