const express = require('express');
// const authMiddleware = require('../middlewares/authMiddleware');
const { getAllChat, createChat, deleteChat } = require('../controllers/chatController');

const router = express.Router();

router.get('/', getAllChat);

router.post('', createChat);

// DELETE a chat message by ID
// router.delete('/:id', deleteChat);
router.delete('/messages/:id', deleteChat);


module.exports = router;
