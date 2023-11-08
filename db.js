const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'maxence',
  password: 'Max2003?',
  database: 'discution'
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MariaDB');
  }
});

module.exports = {db};
