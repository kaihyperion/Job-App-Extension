require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());  // Allow cross-origin requests (needed for Chrome extension to talk to the server)

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint for the Chrome extension to call OpenAI API
app.post('/call-openai', async (req, res) => {
  const { jobUrl, resumeType } = req.body;
  const prompt = `
    You are helping a user apply for a job listed at ${jobUrl}.
    The user has selected resume type: ${resumeType}.
    Please generate a dynamic mapping for the job application form with the following fields:
    - Full Name
    - Email Address
    - Resume Upload
  `;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    res.json({ success: true, result: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: 'Failed to call OpenAI API' });
  }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});