const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Tumhara API Endpoint
app.get('/api/v1/api/glm-4', async (req, res) => {
    try {
        const userQuery = req.query.q;

        if (!userQuery) {
            return res.status(400).json({
                status: false,
                results: "Please provide a query. Example: ?q=hii"
            });
        }

        // Google Gemini API Key (Render se aayegi)
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        // Gemini ke advanced model ko request bhejo
        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: userQuery }] }]
            }
        );

        // AI ka text response nikalo
        const aiText = geminiResponse.data.candidates[0].content.parts[0].text;

        // Exact wahi JSON structure return karo
        return res.json({
            status: true,
            results: aiText
        });

    } catch (error) {
        console.error("Gemini Error:", error.response ? error.response.data : error.message);
        return res.status(500).json({
            status: false,
            results: "Gemini AI se response lene mein problem aayi."
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chal raha hai port ${PORT} pe`);
});
