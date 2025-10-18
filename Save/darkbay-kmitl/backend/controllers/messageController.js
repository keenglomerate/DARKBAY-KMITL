const Conversation = require('../models/conversationModel.js');
const Message = require('../models/messageModel.js');

// @desc    Create a new conversation
// @route   POST /api/conversations
// @access  Private
const newConversation = async (req, res) => {
    const { receiverId, listingId } = req.body;
    
    // Check if a conversation already exists between these two users for this listing
    let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, receiverId] },
        listing: listingId
    });

    if (conversation) {
        return res.status(200).json(conversation);
    }

    const newConversation = new Conversation({
        participants: [req.user._id, receiverId],
        listing: listingId
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(201).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
};

// @desc    Get conversations of a user
// @route   GET /api/conversations
// @access  Private
const getUserConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user._id] },
        }).populate('participants', 'username').populate('listing', 'title images');
        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json(err);
    }
};

// @desc    Add a message to a conversation
// @route   POST /api/conversations/:conversationId/messages
// @access  Private
const addMessage = async (req, res) => {
    const newMessage = new Message({
        conversationId: req.params.conversationId,
        sender: req.user._id,
        content: req.body.content,
    });

    try {
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
};

// @desc    Get messages from a conversation
// @route   GET /api/conversations/:conversationId/messages
// @access  Private
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        }).populate('sender', 'username');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
};


module.exports = { newConversation, getUserConversations, addMessage, getMessages };