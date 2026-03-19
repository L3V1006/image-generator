const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Your specific Pollinations Publishable Key
const POLLINATIONS_KEY = "pk_pX062d5BCDrlCCfE";

app.post("/generate", (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const cleanPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    
    // 2026 Unified Endpoint with your API Key added at the end
    const imageUrl = `https://gen.pollinations.ai/image/${cleanPrompt}?model=flux&seed=${seed}&width=1024&height=1024&nologo=true&key=${POLLINATIONS_KEY}`;

    console.log(`✅ Request sent with API Key for: "${prompt}"`);
    res.json({ image: imageUrl });
});

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
    console.log("🔑 Authenticated with Publishable Key");
});