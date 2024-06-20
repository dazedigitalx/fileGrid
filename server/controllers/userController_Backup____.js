const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../database').promise(); // Import mysql2 promise wrapper explicitly

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Retrieve user from database by username
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'User not found or incorrect credentials' });
        }

        const user = rows[0];

        // Compare hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'User not found or incorrect credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: `Error logging in: ${err.message}` });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email FROM users');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: `Error fetching users: ${err.message}` });
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: `Error fetching user: ${err.message}` });
    }
};

const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        const [results] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        res.status(201).json({ message: 'User added successfully', userId: results.insertId });
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ message: `Error adding user: ${err.message}` });
    }
};

const updateUserById = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    try {
        // Hash the password if provided before updating
        let hashedPassword = password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const [results] = await pool.query('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, hashedPassword, userId]);
        res.json({ message: `User ${userId} updated successfully` });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: `Error updating user: ${err.message}` });
    }
};

const deleteUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const [results] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: `User ${userId} deleted successfully` });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: `Error deleting user: ${err.message}` });
    }
};

module.exports = {
    loginUser,
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
};
