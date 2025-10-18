const express = require('express');
const router = express.Router();
const { newConversation, getUserConversations, addMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, newConversation)
  .get(protect, getUserConversations);

router.route('/:conversationId/messages')
  .post(protect, addMessage)
  .get(protect, getMessages);

module.exports = router;