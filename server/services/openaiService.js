require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(history, newMessage) {
    try {
        // For Gemini, we use the "gemini-2.5-flash" model (Confirmed working)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Construct chat history (Gemini format: { role: 'user'|'model', parts: [{ text: string }] })
        // Our 'history' array comes as { role: 'user'|'assistant', content: string }
        // We need to map it.
        // Gemini enforces that the first message MUST be from 'user'.
        // If our history starts with 'model' (assistant), it will crash.
        // We find the index of the first 'user' message and slice from there.
        let firstUserIndex = history.findIndex(msg => msg.role === 'user');

        let validHistory = [];
        if (firstUserIndex !== -1) {
            validHistory = history.slice(firstUserIndex);
        }

        const chatHistory = validHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model', // Gemini uses 'model' instead of 'assistant'
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        const result = await chat.sendMessage(newMessage);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Gemini AI Error:", error);
        return `[System Error]: ${error.message}`; // Return actual error for debugging
    }
}

module.exports = { generateResponse };
