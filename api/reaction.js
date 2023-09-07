const express = require('express');
const jwt = require('jsonwebtoken');
const { db } = require('../db'); // Importez votre connexion à la base de données depuis le fichier db.js
const { io } = require('../discution');

const router = express.Router();
const { query, body, validationResult } = require('express-validator');
const { LIGNE_PAR_PAGES, SECRET_KEY, uploadFile } = require('../constantes.js');
const { authenticateToken } = require('../middleware.js');


function isInConv(token, id_conversation, parametre, func) {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const uniquePseudo = decodedToken.uniquePseudo;
    const query = "select * from `user-conversation` where uniquePseudo_user=? and id_conversation=?";
    db.query(query, [uniquePseudo, id_conversation], (err, result) => {
        if (err) {
            console.error('Erreur lors  :', err);
            return false;
        } else {
            if (result.length === 0) {
                console.log('l utilisateur n est pas dans la conversation');
                parametre.res.status(500).send(JSON.stringify({ 'message': 'l utilisateur n est pas dans la conversation' }));
            } else {
                func(parametre);
            }
        }
    });
}

router.post('', [
    body('id_message').notEmpty().withMessage('id_message requis'),
    body('emoji').notEmpty().withMessage('emoji requis'),
    body('id_conversation').notEmpty().withMessage('id_conversation requis'),
    authenticateToken
], async (req, res) => {
    const { id_message, emoji,id_conversation } = req.body;

    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const uniquePseudo = decodedToken.uniquePseudo;

    const parametre = {
        id_message,
        emoji,
        uniquePseudo,
        id_conversation,
        res
    }

    isInConv(token, id_conversation, parametre, postReaction);
});

const postReaction = function (parametre) {
    // Vérifier si la réaction existe déjà pour cet utilisateur et ce message
    const selectQuery = 'SELECT * FROM reactions WHERE message_id = ? AND user_uniquePseudo = ?';
    db.query(selectQuery, [parametre.id_message, parametre.uniquePseudo], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la vérification de la réaction existante :', err);
            parametre.res.status(500).json({ message: 'Erreur lors de la vérification de la réaction existante' });
        } else {
            // Si la réaction existe, la supprimer
            if (rows.length > 0) {
                const deleteQuery = 'DELETE FROM reactions WHERE message_id = ? AND user_uniquePseudo = ?';
                db.query(deleteQuery, [parametre.id_message, parametre.uniquePseudo], (err, result) => {
                    if (err) {
                        console.error('Erreur lors de la suppression de la réaction existante :', err);
                        parametre.res.status(500).json({ message: 'Erreur lors de la suppression de la réaction existante' });
                    }
                });
            }

            // Insérer la nouvelle réaction
            const insertQuery = 'INSERT INTO reactions (message_id, user_uniquePseudo, emoji) VALUES (?, ?, ?)';
            db.query(insertQuery, [parametre.id_message, parametre.uniquePseudo, parametre.emoji], (err, result) => {
                if (err) {
                    console.error('Erreur lors de l\'ajout de la réaction :', err);
                    parametre.res.status(500).json({ message: 'Erreur lors de l\'ajout de la réaction' });
                } else {
                    const deleteQuery = 'Select * FROM user WHERE uniquePseudo = ?';
                    db.query(deleteQuery, [parametre.uniquePseudo], (err, result) => {
                        if (err) {
                            console.error('Erreur lors de l\'ajout de la réaction :', err);
                            parametre.res.status(500).json({ message: 'Erreur lors de l\'ajout de la réaction' });
                        } else {
                            io.to(`conversation:${parametre.id_conversation}`).emit('newReaction', { 'id_message': parametre.id_message,'emoji':parametre.emoji, 'user': JSON.stringify(result[0]) });
                            parametre.res.status(201).json({ message: 'Réaction ajoutée avec succès' });
                        }
                    });

                }
            });
        }
    });
}

module.exports = router;