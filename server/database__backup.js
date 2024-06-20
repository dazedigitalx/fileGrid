// server/database.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database msg from database.js');
});

module.exports = db;
