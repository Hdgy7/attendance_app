const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12778224',
  password: '8Y47NaPdiD',
  database: 'sql12778224'
});

connection.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected!');
});

module.exports = connection;
