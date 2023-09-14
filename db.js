const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '46.227.18.31',
  user: 'maxence',
  password: 'Max2003?',
  database: 'discution2'
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MariaDB');
  }
});

module.exports = {db};
