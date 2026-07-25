const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Tumhara exact API Endpoint
app.get('/api/v1/api/gpt-5', async (req, res) => {
    try {
        // 1. User ne URL mein 'q' mein kya search kiya hai wo nikalo
        const userQuery = req.query.q;

        if (!userQuery) {
            return res.status(400).json({
                status: false,
                results: "Please provide a query. Example: ?q=hii"
            });
        }

        // 2. Free AI (Pollinations) ko request bhejo with ADVANCED MODEL
        // ?model=openai lagane se ye GPT-4o jaise advanced model ka response dega
        const aiApiUrl = `https://text.pollinations.ai/${encodeURIComponent(userQuery)}?model=openai`;
        
        const aiResponse = await axios.get(aiApiUrl);

        // 3. AI ka text response nikalo
        const aiText = aiResponse.data;

        // 4. Exact wahi JSON structure return karo jo tumne maanga tha
        return res.json({
            status: true,
            results: aiText
        });

    } catch (error) {
        console.error("AI Error:", error.message);
        return res.status(500).json({
            status: false,
            results: "AI se response lene mein kuch problem aayi."
        });
    }
});

// Render port ko automatically listen karega
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chal raha hai port ${PORT} pe`);
});