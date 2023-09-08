const { db } = require('../db');
const { authenticateTokenSocket } = require('../middleware');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, uploadFile} = require('../constantes.js');

module.exports = {
    handleConnection: (socket,io) => {

        socket.on('setReaction', (data) => {
            handlesetReaction(socket, data,io);
        });
        socket.on('deleteReaction', (data) => {
            handledeleteReaction(socket, data,io);
        });
    },
};

async function handlesetReaction(socket,data,io){
    try {
        const isAuthenticated = await authenticateTokenSocket(data.token);
        if (!isAuthenticated) {
            console.error('Erreur : token invalide');
            return;
        }

        const decodedToken = jwt.verify(data.token, SECRET_KEY);
        const uniquePseudo = decodedToken.uniquePseudo;

        const query = 'call setReaction(?,?,?);';
        db.query(query, [data.messgaeId,uniquePseudo, data.reaction], (err, result) => {
            if (err) {
                console.error('Erreur lors de la création de la reaction:', err);
            } else {
                let message = result[0][0];
                io.to(`conversation:${data.conversationId}`).emit('recevoirReaction', {message});
            }
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error.message);
    }
}
async function handledeleteReaction(socket,data,io){
    try {
        const isAuthenticated = await authenticateTokenSocket(data.token);
        if (!isAuthenticated) {
            console.error('Erreur : token invalide');
            return;
        }

        const decodedToken = jwt.verify(data.token, SECRET_KEY);
        const uniquePseudo = decodedToken.uniquePseudo;

        const query = 'DELETE FROM `discution`.`reactions` WHERE (`user_uniquePseudo` = ?) and (`message_id` = ?);';
        db.query(query, [uniquePseudo,data.messgaeId], (err, result) => {
            if (err) {
                console.error('Erreur lors de la création de la reaction:', err);
            } else {
                let messgaeId = data.messgaeId;
                io.to(`conversation:${data.conversationId}`).emit('recevoirdeleteReaction', {uniquePseudo,messgaeId});
            }
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error.message);
    }
}