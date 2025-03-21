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

        socket.on('gritarMarco', (username) => {
            io.emit('marcoGritado', username);
        });

        socket.on('gritarPolo', (username) => {
            io.emit('poloGritado', username);
            io.emit('mostrarPolos', users.filter(user => user.role === 'Polo' || user.role === 'Polo Especial').map(user => user.username));
        });

        socket.on('seleccionarPolo', (selectedPolo) => {
            const marco = users.find(user => user.role === 'Marco');
            const poloEspecial = users.find(user => user.role === 'Polo Especial');
        
            if (marco && poloEspecial) {
                console.log('marco && poloEspecial');
                
                if (selectedPolo === poloEspecial.username) {
                    io.emit('finJuego', { ganador: marco.username });
                } else {
                    io.emit('finJuego', { perdedor: marco.username });
                }
            } else {
                console.log('Error: Marco o Polo Especial no definidos');
            }
        });

        socket.on('reiniciarJuego', () => {
            users = [];
            io.emit('reiniciarJuegoServidor');
        });

        socket.on('disconnect', () => {
            users = users.filter(user => user.id !== socket.id);
            console.log('Usuario desconectado');
        });
    });
};