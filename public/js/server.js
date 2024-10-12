const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const userData = {
  fullName: process.env.USER_FULL_NAME,
  firstName: process.env.USER_FIRST_NAME,
  lastName: process.env.USER_LAST_NAME,
  phoneNumber: process.env.USER_PHONE_NUMBER,
  phoneDeviceType: process.env.USER_PHONE_DEVICE_TYPE,
  email: process.env.USER_EMAIL,
  linkedin: process.env.USER_LINKEDIN,
  address: process.env.USER_ADDRESS,
  gender: process.env.USER_GENDER,
  pronoun: process.env.USER_PRONOUN,
  graduationYear: process.env.USER_GRADUATION_YEAR,
  graduationMonth: process.env.USER_GRADUATION_MONTH,
  portfolioWebsite: process.env.USER_PORTFOLIO_WEBSITE,
  userGitHub: process.env.USER_GITHUB_WEBSITE,
  visaStatus: process.env.USER_VISA_STATUS,
  citizenship: process.env.USER_CITIZENSHIP,
  veteranStatus: process.env.USER_VETERAN_STATUS,
  currentCompany: process.env.CURRENT_COMPANY
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/call-openai', async (req, res) => {
  const {
    resumeType,
    formFields
  } = req.body;

  const prompt =
  "You are helping a user fill out a job application form.\n\n" +
  "The form fields are as follows:\n" +
  JSON.stringify(formFields) + "\n\n" +
  "The user's information is as follows:\n" +
  JSON.stringify(userData) + "\n\n" +
  "Please map the form fields to the user's information and return only the mapped fields as a JSON object.\n" +
  "Make sure to select appropriate values from dropdown options.\n" +
  "Return valid JSON in the following format:\n" +
  "{\n" +
  '  "Full Name": "John Doe",\n' +
  '  "Email": "john.doe@example.com",\n' +
  '  "Are you legally authorized to work in the country?": "Yes",\n' +
  '  ...\n' +
  "}\n" +
  "Do not include any additional text.";


  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: prompt
      }],
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
    res.json({
      success: true,
      result: parsedResponse
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to call OpenAI API'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});