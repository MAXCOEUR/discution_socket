const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '192.168.0.168',
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
