require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// const axios = require('axios'); // Not installed in server

async function test() {
    console.log("Testing Gemini API...");
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        console.error("Missing Key");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        // Using a model name found in the list
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        console.log("Sending message: 'Hello'");
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log("Success! Response:", response.text());

    } catch (error) {
        console.error("FAILED.");
        console.error(error.message);
    }
}

test();
