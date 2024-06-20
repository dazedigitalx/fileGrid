const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const { Promise } = require('bluebird'); // Import bluebird for promises

const userRouter = require('./routes/userRouter');
const authMiddleware = require('./middlewares/authMiddleware');
const { getCurrentUser } = require('./controllers/userController');
const noteRouter = require('./routes/noteRouter');
const chatRouter = require('./routes/chatRouter'); // Import your chat router



// Load environment variables
dotenv.config();

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Enable all CORS requests (for development; tighten in production)
app.use(cors());

// Database connection pool with promise support
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    Promise: Promise // Set Promise to bluebird Promise
});

module.exports = pool.promise(); // Export promise-enabled pool

// Testing the database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
    connection.release(); // Release the connection back to the pool
});

// Make pool accessible to router
app.use((req, res, next) => {
    req.pool = pool;
    next();
});


// Mount chatRouter for handling chat routes
app.use('/api/chat', authMiddleware, chatRouter);

// GET /api/users/me - Get current authenticated user
app.get('/api/users/me', authMiddleware, getCurrentUser);

// Mount userRouter for handling user routes
app.use('/api/users', userRouter);

// Mount noteRouter for handling note routes
app.use('/api/notes', authMiddleware, noteRouter);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
