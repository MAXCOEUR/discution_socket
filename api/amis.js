const express = require('express');
const jwt = require('jsonwebtoken');
const { db } = require('../db'); // Importez votre connexion à la base de données depuis le fichier db.js

const router = express.Router();
const { query, body, validationResult } = require('express-validator');
const { LIGNE_PAR_PAGES, SECRET_KEY } = require('../constantes.js');
const { authenticateToken } = require('../middleware.js');

router.get('', [
    query('search').exists().withMessage('search requis'),
    query('page').notEmpty().withMessage('page requis'),
    authenticateToken
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    var { search, page } = req.query;
    var nbr_ligne = page * LIGNE_PAR_PAGES;
    search = (search == undefined) ? "" : search;

    search = "%" + search + "%";

    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const uniquePseudo = decodedToken.uniquePseudo;

    const query = "SELECT * FROM (SELECT DISTINCT u.* FROM user u JOIN amis a ON u.uniquePseudo = a.demandeur AND a.receveur = ? UNION SELECT DISTINCT u.* FROM user u JOIN amis a ON u.uniquePseudo = a.receveur AND a.demandeur = ? ) AS subquery WHERE uniquePseudo like ? LIMIT ? OFFSET ?;";
    db.query(query, [uniquePseudo, uniquePseudo, search, LIGNE_PAR_PAGES, nbr_ligne], (err, result) => {
        if (err) {
            console.error('Erreur lors de la recherche de la conversation :', err);
            res.status(500).send('Erreur lors de la recherche de la conversation');
        } else {
            res.status(201).send(JSON.stringify(result));
        }
    });
});
router.get('/demande', [
    query('search').exists().withMessage('search requis'),
    query('page').notEmpty().withMessage('page requis'),
    authenticateToken
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    var { search, page } = req.query;
    var nbr_ligne = page * LIGNE_PAR_PAGES;
    search = (search == undefined) ? "" : search;

    search = "%" + search + "%";

    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const uniquePseudo = decodedToken.uniquePseudo;

    const query = "SELECT u.* from demandeAmis da join user u on da.demandeur=u.uniquePseudo WHERE da.receveur like ? and da.demandeur like ? LIMIT ? OFFSET ?;";
    db.query(query, [uniquePseudo,search, LIGNE_PAR_PAGES, nbr_ligne], (err, result) => {
        if (err) {
            console.error('Erreur lors de la recherche de la conversation :', err);
            res.status(500).send('Erreur lors de la recherche de la conversation');
        } else {
            res.status(201).send(JSON.stringify(result));
        }
    });
});
router.get('/demande/send', [
    query('search').exists().withMessage('search requis'),
    query('page').notEmpty().withMessage('page requis'),
    authenticateToken
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    var { search, page } = req.query;
    var nbr_ligne = page * LIGNE_PAR_PAGES;
    search = (search == undefined) ? "" : search;

    search = "%" + search + "%";

    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const uniquePseudo = decodedToken.uniquePseudo;

    const query = "SELECT u.* from demandeAmis da join user u on da.receveur=u.uniquePseudo WHERE da.demandeur like ? and da.receveur like ? LIMIT ? OFFSET ?;";
    db.query(query, [uniquePseudo, search, LIGNE_PAR_PAGES, nbr_ligne], (err, result) => {
        if (err) {
            console.error('Erreur lors de la recherche de la conversation :', err);
            res.status(500).send('Erreur lors de la recherche de la conversation');
        } else {
            res.status(201).send(JSON.stringify(result));
        }
    });
});
router.delete('', [
    query('uniquePseudo').exists().withMessage('uniquePseudo requis'),
    authenticateToken
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    var { uniquePseudo } = req.query;

    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const MyuniquePseudo = decodedToken.uniquePseudo;

    const query = "DELETE FROM amis WHERE (demandeur = ? AND receveur = ?) OR (demandeur = ? AND receveur = ?);";
    db.query(query, [MyuniquePseudo, uniquePseudo, uniquePseudo, MyuniquePseudo], (err, result) => {
        if (err) {
            console.error('Erreur lors de la recherche de la conversation :', err);
            res.status(500).send('Erreur lors de la recherche de la conversation');
        } else {
            res.status(201).send(JSON.stringify(result));
        }
    });
});

router.delete('/demande', [
    query('uniquePseudo').exists().withMessage('uniquePseudo requis'),
    authenticateToken
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    var { uniquePseudo } = req.query;

    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const MyuniquePseudo = decodedToken.uniquePseudo;

    const query = "DELETE FROM demandeAmis WHERE (demandeur = ? AND receveur = ?) OR (demandeur = ? AND receveur = ?);";
    db.query(query, [MyuniquePseudo, uniquePseudo, uniquePseudo, MyuniquePseudo], (err, result) => {
        if (err) {
            console.error('Erreur lors de la recherche de la conversation :', err);
            res.status(500).send('Erreur lors de la recherche de la conversation');
        } else {
            res.status(201).send(JSON.stringify(result));
        }
    });
});

router.delete('/refuse', [
    query('uniquePseudo').exists().withMessage('uniquePseudo requis'),
    authenticateToken
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    var { uniquePseudo } = req.query;

    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const MyuniquePseudo = decodedToken.uniquePseudo;

    const query = "DELETE FROM demandeAmis WHERE (demandeur = ? AND receveur = ?) OR (demandeur = ? AND receveur = ?);";
    db.query(query, [uniquePseudo, MyuniquePseudo, MyuniquePseudo, uniquePseudo], (err, result) => {
        if (err) {
            console.error('Erreur lors de la recherche de la conversation :', err);
            res.status(500).send('Erreur lors de la recherche de la conversation');
        } else {
            res.status(201).send(JSON.stringify(result));
        }
    });
});

router.post('', [
    body('uniquePseudo').exists().withMessage('uniquePseudo requis'),
    authenticateToken
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    var { uniquePseudo } = req.body;

    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const MyuniquePseudo = decodedToken.uniquePseudo;

    const query = "call CreateAmisDemande(?,?);";
    db.query(query, [MyuniquePseudo, uniquePseudo], (err, result) => {
        if (err) {
            console.error('Erreur lors de la recherche de la conversation :', err);
            res.status(500).send('Erreur lors de la recherche de la conversation');
        } else {
            res.status(201).send(JSON.stringify(result));
        }
    });
});



module.exports = router;