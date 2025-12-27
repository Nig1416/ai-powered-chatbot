const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Get all conversations (for Admin Dashboard)
router.get('/conversations', async (req, res) => {
    try {
        const conversations = await Conversation.find().sort({ lastMessageAt: -1 });
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get messages for a conversation
router.get('/conversations/:id/messages', async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.id }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Analytics Data
router.get('/analytics', async (req, res) => {
    try {
        const totalConversations = await Conversation.countDocuments();
        const totalMessages = await Message.countDocuments();
        // Calculate average messages per conversation
        const avgMessages = totalConversations ? (totalMessages / totalConversations).toFixed(1) : 0;

        // Simple mock sentiment (Integration with AI for sentiment analysis could be a future step)
        const sentiment = { positive: 60, neutral: 30, negative: 10 };

        res.json({
            totalConversations,
            totalMessages,
            avgMessages,
            sentiment
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
