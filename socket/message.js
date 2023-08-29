const { db } = require('../db');
const { authenticateTokenSocket } = require('../middleware');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, uploadFile} = require('../constantes.js');

module.exports = {
    handleConnection: (socket,io) => {

        socket.on('envoyerMessage', (data) => {
            handleMessage(socket, data,io);
        });

        socket.on('luAllMessage', (data) => {
            handleLuAllMessage(socket, data);
        });

        socket.on('luMessage', (data) => {
            handleLuMessage(socket, data);
        });
    },
};
async function handleMessage(socket, data,io) {
    try {
        const isAuthenticated = await authenticateTokenSocket(data.token);
        if (!isAuthenticated) {
            console.error('Erreur : token invalide');
            return;
        }

        const decodedToken = jwt.verify(data.token, SECRET_KEY);
        const uniquePseudo = decodedToken.uniquePseudo;

        const query = 'call CreateMessage(?,?,?);';
        db.query(query, [uniquePseudo, data.conversationId, data.messageText], (err, result) => {
            if (err) {
                console.error('Erreur lors de la création du message:', err);
            } else {
                let message = result[0][0];
                let file = data.file;
                io.to(`conversation:${data.conversationId}`).emit('recevoirMessage', {message,file});
            }
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error.message);
    }
};
function handleLuAllMessage(socket, data) {
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
}
function handleLuMessage(socket, data) {
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
}