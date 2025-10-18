import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import { getReceiverSocketId, io } from "../server.js";
import mongoose from 'mongoose';

// @desc    Send a message
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    
    await Promise.all([conversation.save(), newMessage.save()]);
    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get all conversations for a user
const getUserConversations = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const conversations = await Conversation.find({ participants: loggedInUserId })
            .populate({ path: "participants", select: "username" })
            .populate({ path: "listing", select: "title" })
            .sort({ updatedAt: -1 });
        
        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error in getUserConversations controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get messages for a specific conversation
const getMessagesForConversation = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId).populate({
        path: 'messages',
        populate: { path: 'senderId', select: 'username' }
    });

    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    if (!conversation.participants.some(p => p.equals(userId))) return res.status(403).json({ error: "Unauthorized" });

    const otherParticipantId = conversation.participants.find(p => !p.equals(userId));
    const otherParticipant = await mongoose.model('User').findById(otherParticipantId).select('username');

    res.status(200).json({ messages: conversation.messages, otherParticipant });
  } catch (error) {
    console.error("Error in getMessagesForConversation: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Start or get a conversation
const startOrGetConversation = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { listingId } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
            listing: listingId || null,
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
                listing: listingId || null,
            });
            await conversation.save();
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error("Error in startOrGetConversation controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export { sendMessage, getUserConversations, getMessagesForConversation, startOrGetConversation };