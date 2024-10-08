require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());  
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/call-openai', async (req, res) => {
  const { resumeType, formFields } = req.body;

  const prompt = `
    You are helping a user fill out a job application. They provided the following form structure:

    ${JSON.stringify(formFields, null, 2)}

    Based on this form structure, identify the appropriate selectors for the following fields:
    - Full Name
    - Email Address
    - Resume Upload
    - Phone Number
    - Work Experience (Job Title, Company, Location, From-To Dates, Role Description)
    - Education (School, Degree, Field of study, GPA, From-To Dates)
    - Skills (e.g. Python, C++, Web development)
    - Voluntary Disclosure (Gender, Ethnicity, Disability Status, Veteran Status)

    Return the recommended selectors in a JSON format only, no other words.
  `;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const llmResponse = response.data.choices[0].message.content;
    const sanitizedResponse = llmResponse.replace(/```json|```/g, '').trim();
    const parsedResponse = JSON.parse(sanitizedResponse);
    res.json({ success: true, result: parsedResponse });
  } catch (error) {
    console.error('Error calling OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: 'Failed to call OpenAI API' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});