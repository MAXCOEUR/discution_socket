const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'maxence',
  password: 'Max2003?',
  database: 'discution'
});

// Pour obtenir une promesse à partir du pool, vous pouvez utiliser la méthode promise()
const db = pool.promise();

module.exports = {db};
