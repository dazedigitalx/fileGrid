// chatController.js

const pool = require('../database'); // Adjust path as per your project structure

const createMessage = async (req, res) => {
  const { userId, senderId, recipientId, message, created_at } = req.body; // Assuming all fields are provided in req.body
  try {
    const query = 'INSERT INTO messages (userId, senderId, recipientId, message, created_at) VALUES (?, ?, ?, ?, ?)';
    await pool.promise().execute(query, [userId, senderId, recipientId, message, created_at]);
    res.status(201).json({ message: 'Chat message created successfully' });
  } catch (error) {
    console.error('Error creating chat message:', error);
    res.status(500).json({ message: 'Failed to create chat message.' });
  }
};


const getAllMessages = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM messages');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Failed to fetch notes.' });
  }
};

// DELETE a chat message by ID
const deleteMessage = (req, res) => {
  const messageId = parseInt(req.params.messageId);
  const index = chatMessages.findIndex(msg => msg.id === messageId);
  if (index !== -1) {
      chatMessages.splice(index, 1);
      res.json({ message: `Message with ID ${messageId} deleted successfully` });
  } else {
      res.status(404).json({ error: `Message with ID ${messageId} not found` });
  }
};

// GET a specific chat message by ID
const getMessageById = async (req, res) => {
  const messageId = parseInt(req.params.messageId);
  try {
      const [rows] = await pool.promise().query('SELECT * FROM messages WHERE id = ?', [messageId]);

      if (rows.length > 0) {
          res.json(rows[0]); // Assuming you expect only one message with the given ID
      } else {
          res.status(404).json({ error: `Message with ID ${messageId} not found` });
      }
  } catch (error) {
      console.error('Error fetching message:', error);
      res.status(500).json({ message: 'Failed to fetch message' });
  }
};



module.exports = { createMessage , getAllMessages , deleteMessage, getMessageById  };
