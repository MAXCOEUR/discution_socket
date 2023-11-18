const mysql = require('mysql2');

const db = mysql.createPool({
  host: '192.168.0.239',
  user: 'maxence',
  password: 'Max2003?',
  database: 'discution',
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});
db.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MariaDB');
    // Libérez la connexion, elle sera automatiquement retournée au pool.
    connection.release();
  }
});

module.exports = {db};
