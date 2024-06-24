const pool = require('../database');

// Create a new channel
const createChannel = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id; // Assuming user information is decoded from JWT

    try {
        const [result] = await pool.query('INSERT INTO channels (name, creator_id) VALUES (?, ?)', [name, userId]);
        const newChannel = { id: result.insertId, name, creator_id : userId };
        res.status(201).json(newChannel);
    } catch (error) {
        console.error('Error creating channel:', error);
        res.status(500).json({ message: 'Failed to create channel' });
    }
};

// Get all channels for the authenticated user
const getUserChannels = async (req, res) => {
    const userId = req.user.id; // Assuming user information is decoded from JWT

    try {
        const [channels] = await pool.query('SELECT * FROM channels WHERE creator_id = ?', [userId]);
        res.json(channels);
    } catch (error) {
        console.error('Error fetching user channels:', error);
        res.status(500).json({ message: 'Failed to get channels' });
    }
};

// Get messages for a specific channel
const getChannelMessages = async (req, res) => {
    const { channelId } = req.params;
    try {
        const [messages] = await pool.query('SELECT * FROM messages WHERE channel_id = ?', [channelId]);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching channel messages:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('SQL:', error.sql);
        console.error('SQL State:', error.sqlState);
        console.error('Stack trace:', error.stack);

        res.status(500).json({ message: 'Failed to get messages for the channel' });
    }
};



// Add a message to a channel
// Add a message to a channel
const sendMessage = async (req, res) => {
    const { channelId } = req.params;
    const { message } = req.body;
    const userId = req.user.id; // Assuming user information is decoded from JWT

    try {
        const [result] = await pool.query('INSERT INTO messages (channel_Id, user_Id, context, created_At) VALUES (?, ?, ?, NOW())', [channelId, userId, message]);
        const newMessage = { id: result.insertId, channel_Id, user_Id, context, created_At: new Date() };
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error adding message to channel:', error);
        res.status(500).json({ message: 'Failed to add message' });
    }
};

module.exports = {
    createChannel,
    getUserChannels,
    getChannelMessages,
    sendMessage,
};
