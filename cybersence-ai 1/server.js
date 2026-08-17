import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
// Serve the frontend file from the root
app.use(express.static('public')); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/audit', async (req, res) => {
    try {
        const { inputData } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-3.7-flash" });
        
        const prompt = `Act as an expert cybersecurity analyst. Analyze the following code, log, or network data:\n\n${inputData}\n\nProvide a concise security assessment, identify potential vulnerabilities, and suggest remediations. Format with clear headings.`;
        
        const result = await model.generateContent(prompt);
        res.json({ output: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process data. Check API Key." });
    }
});

// AWS Beanstalk defaults to port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
