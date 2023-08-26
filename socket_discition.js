const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Client connecté :', socket.id);

  socket.on('message', (data) => {
    console.log('Message reçu :', data);
    // Diffusez le message à tous les clients connectés
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
