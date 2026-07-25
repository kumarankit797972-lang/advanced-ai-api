const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/v1/api/glm-4', async (req, res) => {
    try {
        const userQuery = req.query.q;

        if (!userQuery) {
            return res.status(400).json({
                status: false,
                results: "Please provide a query. Example: ?q=hii"
            });
        }

        // Yahan tumhara Bearer Token aayega (Render se lega)
        const ZAI_TOKEN = process.env.ZAI_BEARER_TOKEN;

        // Z.ai ka actual chat endpoint (jaise browser bhejta hai)
        const zaiResponse = await axios.post('https://chat.z.ai/api/chat/reply', {
            text: userQuery,
            model: "glm-4"
        }, {
            headers: {
                'Authorization': `Bearer ${ZAI_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // AI ka jawab nikalo (Z.ai ka response format thoda alag hota hai, isliye safe side rakhi hai)
        const aiText = zaiResponse.data.detail || zaiResponse.data.text || zaiResponse.data;

        return res.json({
            status: true,
            results: typeof aiText === 'string' ? aiText : JSON.stringify(aiText)
        });

    } catch (error) {
        console.error("Z.ai Error:", error.response ? error.response.data : error.message);
        return res.status(500).json({
            status: false,
            results: "Z.ai ne block kar diya, ya token expire ho gaya."
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chal raha hai port ${PORT} pe`);
});
