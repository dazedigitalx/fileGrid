const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const pool = require('../database').promise();

router.post('/send', authMiddleware, async (req, res) => {
    const { recipientId, message } = req.body;
    console.log('User in route handler:', req.user); // Debug log
    console.log('RecipientId and Message:', recipientId, message); // Debug log

    try {
        const senderId = req.user.id;
        console.log('SenderId:', senderId); // Debug log
        const result = await pool.query('INSERT INTO messages (senderId, recipientId, message) VALUES (?, ?, ?)', [senderId, recipientId, message]);
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query('SELECT * FROM messages WHERE recipientId = ?', [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

module.exports = router;
