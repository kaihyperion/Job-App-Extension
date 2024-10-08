require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());  
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/call-openai', async (req, res) => {
  const { formFields, userData } = req.body;

  const prompt = `
    You are helping a user fill out a job application. The form has the following structure:

    ${JSON.stringify(formFields, null, 2)}

    The user provided the following details:
    - Full Name: ${userData.fullName}
    - Phone Number: ${userData.phoneNumber}
    - Email: ${userData.email}
    - Address: ${userData.address}
    Based on this form structure and user data, return a mapping of which user data should fill which form fields.
    Handle field name variations such as 'Name' vs 'Full Name' vs 'First Name' 'Last Name', 'Email' vs 'Email Address', etc.
    Return the mapping as JSON object. no other words
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