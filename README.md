# 🚀 LLM-Powered Job Application Automation Tool

A powerful **Chrome extension** leveraging **GPT-4** to automate job applications. This tool intelligently maps user data to form fields, fills out job applications across multiple job portals, and ensures seamless user interaction using **Node.js**, **Express.js**, and **Chrome APIs**.

---

## 📖 **Table of Contents**

- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)


---

## 🎥 **Demo**


![Demo GIF](https://github.com/kaihyperion/Job-App-Extension/blob/master/demo.gif)

---

## ✨ **Features**

- **GPT-4 Integration:** Uses LLM to map user data intelligently to application forms.
- **Mass Auto-Fill for Text Fields:** Automatically fills out multiple text fields at once.
- **Select Box Automation:** Clicks and reveals dropdowns, chooses the best-matching option based on user data.
- **Chrome Extension Architecture:** Seamlessly communicates between background, content scripts, and UI components.
- **Backend with Node.js and Express.js:** Handles secure API calls to OpenAI and data mapping.
- **Error Handling:** Ensures smooth user experience with effective error management.

---

## 🛠️ **Technologies Used**

- **React.js** – Frontend UI for the extension popup.
- **Node.js + Express.js** – Backend for secure API handling.
- **Chrome API** – Manages browser actions like tab and form interactions.
- **GPT-4** – For intelligent data mapping and form filling.
- **JavaScript** – Handles interactions between background scripts, content scripts, and UI.

---

## 🚀 **Installation**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kaihyperion/job-app-extension.git
   cd job-app-extension

2. **Install Dependencies**
   ```bash
   npm install

3. **Set up backend**
   - create a `.env` file in the root directory
   ```bash
   USER_FULL_NAME=John Doe
   USER_FIRST_NAME=John
   USER_LAST_NAME=Doe
   USER_EMAIL=john.doe@example.com
   USER_PHONE=123-456-7890
   USER_LINKEDIN=https://linkedin.com/in/johndoe
   OPENAI_API_KEY=your-openai-api-key
   etc...

4. **Start the backend server:**
   ```bash
   node public/js/server.js

5. **Load the Chrome Extension**
   - Open chrome and go to `chrome://extensions/`
   - Enable **Developer Mode**
   - Click **Load Unpacked** and select the `job-app-extension` folder

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
