const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { generateResponse } = require('./openaiService');

function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Join a conversation room or create one
        socket.on('join_conversation', async (conversationId) => {
            if (conversationId) {
                socket.join(conversationId);
                console.log(`Socket ${socket.id} joined ${conversationId}`);
            } else {
                // Create new conversation
                const newConv = new Conversation({ socketId: socket.id });
                await newConv.save();
                socket.join(newConv._id.toString());
                socket.emit('conversation_started', newConv._id);
            }
        });

        socket.on('send_message', async ({ conversationId, content }) => {
            if (!conversationId) return;

            try {
                // 1. Save User Message
                const userMsg = new Message({
                    conversationId,
                    sender: 'user',
                    content
                });
                await userMsg.save();

                // Broadcast to room (so user sees their own msg confirmed, or just relies on optimistic UI)
                // Actually, usually we emit back to sender or room.
                io.to(conversationId).emit('receive_message', userMsg);

                // 2. Update Conversation timestamp
                await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: Date.now() });

                // 3. Get Context (Last 10 messages)
                const recentMessages = await Message.find({ conversationId })
                    .sort({ timestamp: -1 }) // Newest first
                    .limit(10);

                // Format for OpenAI (reverse to oldest first)
                const history = recentMessages.reverse().map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.content
                }));
                // Remove the current message from history if we are passing it separately, 
                // but checking above logic, "recentMessages" includes the userMsg we just saved.
                // So "history" has the latest user message at the end.
                // generateResponse expects "history" + "newMessage".
                // Let's adjust: remove the last one since we pass it explicitly, OR just pass history.
                // My service takes (history, newMessage).
                // Let's split it.
                const historyForAI = history.slice(0, -1);

                // 4. Generate AI Response
                // Send "typing" event
                io.to(conversationId).emit('typing', true);

                let aiResponseText = await generateResponse(historyForAI, content);

                io.to(conversationId).emit('typing', false);

                if (!aiResponseText) {
                    aiResponseText = "I apologize, but I am currently experiencing high traffic. A human agent will be with you shortly.";
                }

                // 5. Save AI Message
                const botMsg = new Message({
                    conversationId,
                    sender: 'bot',
                    content: aiResponseText
                });
                await botMsg.save();

                // 6. Send AI Response
                io.to(conversationId).emit('receive_message', botMsg);

            } catch (err) {
                console.error("Socket Error:", err);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}

module.exports = { setupSocket };
