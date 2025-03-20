const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const routes = require('./routes');
const setupSockets = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('src'));

app.use('/api', routes);

setupSockets(io);

const PORT = 5050;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});