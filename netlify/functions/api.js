const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json());

// Your Pollinations Publishable Key
const POLLINATIONS_KEY = "pk_pX062d5BCDrlCCfE";

// The Image Generation Route
router.post("/generate", (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const cleanPrompt = encodeURIComponent(prompt);
        const seed = Math.floor(Math.random() * 1000000);
        
        // 2026 Unified Endpoint URL
        const imageUrl = `https://gen.pollinations.ai/image/${cleanPrompt}?model=flux&seed=${seed}&width=1024&height=1024&nologo=true&key=${POLLINATIONS_KEY}`;

        console.log(`✅ Function executing for prompt: "${prompt}"`);
        
        // Send the URL back to your frontend
        res.json({ image: imageUrl });

    } catch (error) {
        console.error("Function Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// IMPORTANT: Point the app to the Netlify function path
app.use("/.netlify/functions/api", router);

// Export as a Netlify Function (Replaces app.listen)
module.exports.handler = serverless(app);