require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI Setup
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy-key", // Prevent immediate crash if missing
});

// Chat API Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('sk-proj-**********************')) {
            return res.status(401).json({ error: "OpenAI API Key is missing or invalid in .env file." });
        }

        // Construct messages array
        const messages = [
            { role: "system", content: "You are AstraGPT, a helpful, friendly, and intelligent AI assistant." },
            ...history,
            { role: "user", content: message }
        ];

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-3.5-turbo",
        });

        res.json({ reply: completion.choices[0].message.content });

    } catch (error) {
        console.error("OpenAI Error:", error.message);
        const code = error.status || 500;
        res.status(code).json({ error: error.message || "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`✨ AstraGPT Web Server running at http://localhost:${PORT}`);
});
