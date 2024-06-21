const express = require('express');
// const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getAllMessages , 
    createMessage, 
    deleteMessage, 
    getMessageById, 
    getChannels,
    createChannel,
    getChannelMessages  
} = require('../controllers/chatController');

const router = express.Router();

// GET all channels
router.get('/channels', getChannels);

// POST a new channel
router.post('/channels', createChannel);

// GET messages for a specific channel
router.get('/channels/:channelId/messages', getChannelMessages);


// GET all chat messages
router.get('/messages', getAllMessages);

// GET a specific chat message by ID
router.get('/messages/:messageId', getMessageById);

// POST a new chat message
router.post('/messages', createMessage);

// DELETE a chat message by ID
router.delete('/messages/:messageId', deleteMessage);


module.exports = router;
