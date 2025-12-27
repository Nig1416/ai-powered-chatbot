const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    socketId: { type: String }, // To track active session if needed
    startedAt: { type: Date, default: Date.now },
    lastMessageAt: { type: Date, default: Date.now },
    summary: { type: String }, // AI generated summary/topic
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
