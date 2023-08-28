const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./constantes.js');

function authenticateToken(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject(new Error('No token provided'));
        }

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                reject(new Error('Invalid token'));
            } else {
                resolve(true);
            }
        });
    });
}

module.exports = { authenticateToken };
