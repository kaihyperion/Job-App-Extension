require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());  
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/call-openai', async (req, res) => {
  const { resumeType, formFields, userData } = req.body;

  const prompt = 
  "You are helping a user fill out a job application form.\n\n" +
  "The form fields are as follows:\n" +
  JSON.stringify(formFields) + "\n\n" +
  "The user's information is as follows:\n" +
  JSON.stringify(userData) + "\n\n" +
  "Please map the form fields to the user's information and return only the mapped fields as a JSON object.\n" +
  "Only return valid JSON in the following format:\n" +
  "{\n" +
  '  "Full Name": "John Doe",\n' +
  '  "Email": "john.doe@example.com",\n' +
  '  ...\n' +
  "}\n" +
  "Do not include any additional text.";
  


  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
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