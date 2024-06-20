// chatController.js

const pool = require('../database'); // Adjust path as per your project structure

const createChat = async (req, res) => {
  const { userId, content } = req.body;
  try {
    const query = 'INSERT INTO notes (userId, content) VALUES (?, ?)';
    await pool.promise().execute(query, [userId, content]);
    res.status(201).json({ message: 'Chat message created successfully' });
  } catch (error) {
    console.error('Error creating chat message:', error);
    res.status(500).json({ message: 'Failed to create chat message.' });
  }
};

const getAllChat = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM notes');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Failed to fetch notes.' });
  }
};

const deleteChat = async (req, res) => {
  const messageId = req.params.id;
  try {
    const query = 'DELETE FROM notes WHERE id = ?';
    const [result] = await pool.query(query, [messageId]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Message deleted successfully' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message.' });
  }
};

module.exports = { createChat, getAllChat, deleteChat };
