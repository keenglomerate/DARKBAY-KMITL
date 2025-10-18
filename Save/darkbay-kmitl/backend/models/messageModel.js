const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;