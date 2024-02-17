const mysql = require('mysql');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env; // Load your environment variables

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    throw err;
  }
  console.log('Connected to MySQL');
});

module.exports = connection;
