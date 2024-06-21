// chatController.js

const pool = require('../database'); // Adjust path as per your project structure

// GET messages for a specific channel
const getChannelMessages = async (req, res) => {
  const channelId = req.params.channelId;
  try {
    const query = 'SELECT * FROM messages WHERE channel_id = ?';
    const [rows] = await pool.promise().query(query, [channelId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching channel messages:', error);
    res.status(500).json({ message: 'Failed to fetch channel messages.' });
  }
};

// GET /api/channels - Fetch channels for a user
const getChannels = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM channels');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ message: 'Failed to fetch channels.' });
  }
};

// POST /api/channels - Create a new channel
const createChannel = async (req, res) => {
  const { name, description } = req.body; // Assuming name and description are provided in req.body
  try {
    const query = 'INSERT INTO channels (name, description) VALUES (?, ?)';
    await pool.promise().execute(query, [name, description]);
    res.status(201).json({ message: 'Channel created successfully' });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({ message: 'Failed to create channel.' });
  }
};

/////// messages ..................................

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
const deleteMessage = async (req, res) => {
  const messageId = parseInt(req.params.messageId);

  try {
    // Example SQL query to delete a message by its ID
    const query = 'DELETE FROM messages WHERE id = ?';
    const [result] = await pool.promise().execute(query, [messageId]);

    if (result.affectedRows > 0) {
      res.json({ message: `Message with ID ${messageId} deleted successfully` });
    } else {
      res.status(404).json({ error: `Message with ID ${messageId} not found` });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message' });
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




module.exports = { 
  createMessage , 
  getAllMessages , 
  deleteMessage, 
  getMessageById, 
  getChannels,
  createChannel,
  getChannelMessages 
  };
