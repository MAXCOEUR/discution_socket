const mysql = require('mysql2');

const data = mysql.createConnection({
  host: '192.168.0.239',
  user: 'maxence',
  password: 'Max2003?',
  database: 'discution'
});

data.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MariaDB');
  }
});

const db = function(){
  data.connect();
  return data;
}

module.exports = {db};
