import express from 'express';
import { 
    sendMessage, 
    getMessagesForConversation, 
    getUserConversations, 
    startOrGetConversation 
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route gets all conversations for the logged-in user
router.get("/conversations", protect, getUserConversations);

// This route gets all messages for a specific conversation ID
router.get("/:id", protect, getMessagesForConversation);

// This route sends a message to a specific user (receiver)
router.post("/send/:id", protect, sendMessage);

// This route starts a conversation with a specific user for a listing
router.post("/start/:id", protect, startOrGetConversation);

export default router;