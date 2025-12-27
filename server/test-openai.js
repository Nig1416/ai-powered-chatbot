require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
    console.log("Testing OpenAI API Key...");
    console.log("Key present:", !!process.env.OPENAI_API_KEY);
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Hello" }],
            model: "gpt-3.5-turbo",
        });
        console.log("Success! Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("FAILED.");
        console.error("Error Type:", error.constructor.name);
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Status:", error.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

test();
