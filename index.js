const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Tumhara naya API Endpoint (Naam GLM-4 rakha gaya hai)
app.get('/api/v1/api/glm-4', async (req, res) => {
    try {
        // 1. User ne URL mein 'q' mein kya search kiya hai wo nikalo
        const userQuery = req.query.q;

        if (!userQuery) {
            return res.status(400).json({
                status: false,
                results: "Please provide a query. Example: ?q=hii"
            });
        }

        // 2. Z.ai API Key Render se lega
        const ZAI_API_KEY = process.env.ZAI_API_KEY;

        // 3. Z.ai ke sabse advanced model (glm-4-plus) ko request bhejo
        const zaiResponse = await axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            model: "glm-4-plus", // <-- Yeh Z.ai ka sabse advanced model hai
            messages: [
                { role: "user", content: userQuery }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${ZAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // 4. AI ka text response nikalo
        const aiText = zaiResponse.data.choices[0].message.content;

        // 5. Exact wahi JSON structure return karo
        return res.json({
            status: true,
            results: aiText
        });

    } catch (error) {
        console.error("Z.ai Error:", error.response ? error.response.data : error.message);
        return res.status(500).json({
            status: false,
            results: "Z.ai AI se response lene mein problem aayi."
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chal raha hai port ${PORT} pe`);
});
