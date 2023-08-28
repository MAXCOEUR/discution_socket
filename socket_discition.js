const express = require('express');
const http = require('http');
const SocketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { db } = require('./db');

const { SECRET_KEY, LIGNE_PAR_PAGES } = require('./constantes.js');
const { authenticateToken } = require('./middleware.js');

const app = express();
const server = http.createServer(app);
const io = SocketIo(server, {
  maxHttpBufferSize: 1e8
});

io.on('connection', (socket) => {
  console.log('Client connecté :', socket.id);

  socket.on('joinConversations', (data) => {
    console.log('joinConversations :', data.uniquePseudo);
    const query = 'select c.id from conversation c join `user-conversation` uc on c.id=uc.id_conversation Where uc.uniquePseudo_user=?';
    db.query(query, [data.uniquePseudo], (err, result) => {
      if (err) {
        console.error('Erreur lors de la creation du message:', err);
      } else {
        for (let i = 0; i < result.length; i++) {
          socket.join(`conversation:${result[i].id}`);
        }
      }
    });
  });
  socket.on('joinConversation', (data) => {
    console.log('joinConversation :', data.idConversation);
    socket.join(`conversation:${data.idConversation}`);
  });
  socket.on('leaveConversation', (data) => {
    console.log('leaveConversation :', data.idConversation);
    socket.leave(`conversation:${data.idConversation}`);
  });
  socket.on('leaveConversations', (data) => {
    console.log('leaveConversation :', data.uniquePseudo);
    const query = 'select c.id from conversation c join `user-conversation` uc on c.id=uc.id_conversation Where uc.uniquePseudo_user=?';
    db.query(query, [data.uniquePseudo], (err, result) => {
      if (err) {
        console.error('Erreur lors de la creation du message:', err);
      } else {
        for (let i = 0; i < result.length; i++) {
          socket.leave(`conversation:${result[i].id}`);
        }
      }
    });
  });

  socket.on('envoyerMessage', async (data) => {
    try {
      const isAuthenticated = await authenticateToken(data.token);
      if (!isAuthenticated) {
        console.error('Erreur : token invalide');
        return;
      }
      console.log('Message reçu :', data);

      const decodedToken = jwt.verify(data.token, SECRET_KEY);
      const uniquePseudo = decodedToken.uniquePseudo;

      const query = 'call CreateMessage(?,?,?,?);';
      db.query(query, [uniquePseudo, data.conversationId, data.messageText, null], (err, result) => {
        if (err) {
          console.error('Erreur lors de la creation du message:', err);
        } else {
          io.to(`conversation:${data.conversationId}`).emit('recevoirMessage', result[0][0]);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du token :', error.message);
    }
  });
  socket.on('luAllMessage', (data) => {
    const decodedToken = jwt.verify(data.token, SECRET_KEY);
    const uniquePseudo = decodedToken.uniquePseudo;
  
    const query = 'CALL MarkAllUnreadMessagesAsRead(?, ?);';
    db.query(query, [data.conversationId, uniquePseudo], (err, result) => {
      if (err) {
        console.error('Erreur lors de la creation du message:', err);
      } else {
        console.log("luAllMessage "+uniquePseudo+" : "+data.conversationId);
      }
    });
  });
  socket.on('luMessage', (data) => {
    const decodedToken = jwt.verify(data.token, SECRET_KEY);
    const uniquePseudo = decodedToken.uniquePseudo;
  
    const query = 'insert into `message-read` (id_message,uniquePseudo_user) values(?,?);';
    db.query(query, [data.messageId, uniquePseudo], (err, result) => {
      if (err) {
        console.error('Erreur lors de la creation du message:', err);
      } else {
        console.log("luAllMessage "+uniquePseudo+" : "+data.messageId);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});